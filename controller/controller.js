const dbService = require("../services/db.service.js");
const { getCache, setCache, deleteCache } = require("../services/redis.service.js");

// ─── Cache TTLs (seconds) ────────────────────────────────────
const TTL = {
    branch:   300,  // 5 minutes  — changes rarely
    currency: 300,  // 5 minutes  — changes rarely
    branding: 600,  // 10 minutes — almost never changes
    summary:  60,   // 1 minute   — balance/transaction counts
};

// Derive a stable cache key from a Mongoose model name
const modelKey = (schema) => schema.modelName?.toLowerCase() || "data";

const createData = async (req, res, schema) => {
    try {
        const data = req.body;
        const dbres = await dbService.createNewRecord(data, schema);
        await deleteCache(modelKey(schema));
        res.status(201).json({
            message: "data inserted",
            success: true,
            data: dbres
        });
    }
    catch (error) {
        if (error.code == 11000) {
            const field = Object.keys(error.keyValue)[0];
            res.status(422).json({ message: `${field} already exists`, success: false, field });
        }
        else if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            res.status(400).json({ message: messages[0], success: false, errors: messages });
        }
        else {
            res.status(500).json({ message: "internal error", success: false });
        }
    }
};

const getData = async (req, res, schema) => {
    try {
        const key = modelKey(schema);
        const ttl = TTL[key] || 60;

        // 1. Try cache first
        const cached = await getCache(key);
        if (cached) {
            return res.status(200).json({
                message: "data fetch successfully",
                success: true,
                data: cached,
                source: "cache"
            });
        }

        // 2. Cache miss — hit MongoDB
        const data = await dbService.findAllRecord(schema);

        // 3. Store in cache for next time
        await setCache(key, data, ttl);

        res.status(200).json({
            message: "data fetch successfully",
            success: true,
            data: data
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal error", success: false });
    }
};

const deleteData = async (req, res, schema) => {
    try {
        const { id } = req.params;
        const data = await dbService.deleteRecord(id, schema);
        await deleteCache(modelKey(schema));
        res.status(200).json({ message: "data deleted successfully", success: true, data: data });
    }
    catch (error) {
        res.status(500).json({ message: "Internal error", success: false });
    }
};

const updateData = async (req, res, schema) => {
    try {
        const { id } = req.params;
        const data1 = req.body;
        const data = await dbService.updateRecord(id, data1, schema);
        await deleteCache(modelKey(schema));
        res.status(200).json({ message: "data updated successfully", success: true, data: data });
    }
    catch (error) {
        res.status(500).json({ message: "Internal error", success: false });
    }
};

const findByAccountNo = async (req, res, schema) => {
    try {
        const query = req.body;
        const dbres = await dbService.findOneRecord(query, schema);
        return res.status(200).json({ message: "Record Found", data: dbres });
    }
    catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getTransactionSummary = async (req, res, schema) => {
    const { branch, accountNo } = req.query;
    const cacheKey = `summary:${accountNo || "all"}:${branch || "all"}`;

    try {
        // 1. Try cache first
        const cached = await getCache(cacheKey);
        if (cached) {
            return res.status(200).json({ ...cached, source: "cache" });
        }

        // 2. Cache miss — run aggregation
        const matchStage = {};
        if (branch) matchStage.branch = branch;
        if (accountNo) matchStage.accountNo = String(accountNo);

        const summary = await schema.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalCredit: { $sum: { $cond: [{ $eq: ["$transactionType", "cr"] }, "$transactionAmount", 0] } },
                    totalDebit:  { $sum: { $cond: [{ $eq: ["$transactionType", "dr"] }, "$transactionAmount", 0] } },
                    creditCount: { $sum: { $cond: [{ $eq: ["$transactionType", "cr"] }, 1, 0] } },
                    debitCount:  { $sum: { $cond: [{ $eq: ["$transactionType", "dr"] }, 1, 0] } },
                    totalTransactions: { $sum: 1 },
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCredit: 1, totalDebit: 1,
                    totalTransactions: 1, creditCount: 1, debitCount: 1,
                    balance: { $subtract: ["$totalCredit", "$totalDebit"] }
                }
            }
        ]);

       if(summary.length==0){
        return res.status(200).json({
            totalCredit:0,
            totalDebit:0,
            totalTransactions:0,
            creditCount:0,
            debitCount:0,
            balance:0
        });
    }

        // 3. Cache for 60 seconds
        await setCache(cacheKey, summary[0], TTL.summary);

        return res.status(200).json(summary[0]);
    }
    catch (error) {
        return res.status(500).json({ message: "Error collecting summary" });
    }
};

const getPaginatedTransactions = async (req, res, schema) => {
    try {
        const { accountNo, branch, page = 1, pageSize = 10 } = req.query;

        const filter = {};
        if (accountNo) filter.accountNo = accountNo;
        if (branch) filter.branch = branch;

        const skip = (parseInt(page) - 1) * parseInt(pageSize);
        const limit = parseInt(pageSize);

        const [transactions, total] = await Promise.all([
            schema.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
            schema.countDocuments(filter)
        ]);

        res.status(200).json({
            data: transactions,
            total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching transactions" });
    }
};

const filterData = async (req, res, schema) => {
    try {
        const { fromDate, toDate, accountNo, branch } = req.body;
        const startDate = new Date(fromDate);
        const endDate   = new Date(toDate);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format", success: false });
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const query = { createdAt: { $gte: startDate, $lte: endDate } };
        if (branch && branch != "")    query.branch    = branch;
        if (accountNo && accountNo != "") query.accountNo = String(accountNo);

        const result = await schema.find(query);
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server error", success: false });
    }
};

module.exports = {
    createData, getData, deleteData, updateData,
    findByAccountNo, getTransactionSummary,
    getPaginatedTransactions, filterData
};
