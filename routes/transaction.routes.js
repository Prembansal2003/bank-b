const express = require("express");
const router = express.Router();
const transactionSchema = require("../model/transaction.model");
const controller = require("../controller/controller");
const { verifyToken, isAdmin, isAdminEmployee, isAdminEmployeeCustomer } = require("../middlewares/midddleware");
const { validateTransaction, validateTransactionFilter } = require("../middlewares/validate");
const { deleteCache } = require("../services/redis.service");

// Helper — wipe all summary caches after any transaction write
const bustSummaryCache = async (req, res, next) => {
    // We can't know all accountNo/branch combos, so we rely on TTL (60s)
    // but we DO bust the "all" summary used by admin dashboard
    await deleteCache("summary:all:all");
    next();
};

router.get('/summary', verifyToken, isAdminEmployeeCustomer, (req, res) =>
    controller.getTransactionSummary(req, res, transactionSchema)
);
router.get('/pagination', verifyToken, isAdminEmployeeCustomer, (req, res) =>
    controller.getPaginatedTransactions(req, res, transactionSchema)
);
router.get('/', verifyToken, isAdminEmployee, (req, res) =>
    controller.getPaginatedTransactions(req, res, transactionSchema)
);

router.post("/", verifyToken, isAdminEmployee, validateTransaction, bustSummaryCache, (req, res) =>
    controller.createData(req, res, transactionSchema)
);
router.post("/filter", verifyToken, isAdminEmployeeCustomer, validateTransactionFilter, (req, res) =>
    controller.filterData(req, res, transactionSchema)
);
router.put("/:id", verifyToken, isAdminEmployee, bustSummaryCache, (req, res) =>
    controller.updateData(req, res, transactionSchema)
);
router.delete("/:id", verifyToken, isAdmin, bustSummaryCache, (req, res) =>
    controller.deleteData(req, res, transactionSchema)
);

module.exports = router;
