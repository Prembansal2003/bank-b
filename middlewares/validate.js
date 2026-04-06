// validate.js — request body validation middleware

const sendError = (res, message, field = null) => {
    return res.status(400).json({
        success: false,
        message,
        ...(field && { field })
    });
};

// ── Transaction ──────────────────────────────────────────────
const validateTransaction = (req, res, next) => {
    const { transactionType, transactionAmount, accountNo, branch, category } = req.body;

    if (!transactionType)
        return sendError(res, 'Transaction type is required (cr or dr)', 'transactionType');
    if (!['cr', 'dr'].includes(transactionType))
        return sendError(res, 'Transaction type must be either "cr" or "dr"', 'transactionType');

    if (transactionAmount === undefined || transactionAmount === '')
        return sendError(res, 'Transaction amount is required', 'transactionAmount');
    if (isNaN(transactionAmount) || Number(transactionAmount) <= 0)
        return sendError(res, 'Transaction amount must be a positive number', 'transactionAmount');

    if (!accountNo || String(accountNo).trim() === '')
        return sendError(res, 'Account number is required', 'accountNo');

    if (!branch || String(branch).trim() === '')
        return sendError(res, 'Branch is required', 'branch');

    const validCategories = ['salary', 'deposit', 'withdrawal', 'transfer', 'loan', 'fee', 'other'];
    if (!category)
        return sendError(res, 'Category is required', 'category');
    if (!validCategories.includes(category))
        return sendError(res, `Category must be one of: ${validCategories.join(', ')}`, 'category');

    next();
};

const validateTransactionFilter = (req, res, next) => {
    const { fromDate, toDate } = req.body;

    if (!fromDate)
        return sendError(res, 'fromDate is required', 'fromDate');
    if (!toDate)
        return sendError(res, 'toDate is required', 'toDate');

    const start = new Date(fromDate);
    const end   = new Date(toDate);

    if (isNaN(start.getTime()))
        return sendError(res, 'fromDate is not a valid date', 'fromDate');
    if (isNaN(end.getTime()))
        return sendError(res, 'toDate is not a valid date', 'toDate');
    if (start > end)
        return sendError(res, 'fromDate cannot be after toDate', 'fromDate');

    next();
};

// ── User (Employee / Admin) ───────────────────────────────────
const validateUser = (req, res, next) => {
   const { fullName, email, password, mobile, branch, userType, address } = req.body;

if (!fullName || String(fullName).trim() === '')
    return sendError(res, 'Full name is required', 'fullName');
    if (!email || String(email).trim() === '')
        return sendError(res, 'Email is required', 'email');
    if (!/^\S+@\S+\.\S+$/.test(email))
        return sendError(res, 'Please enter a valid email address', 'email');

    if (!password || String(password).trim() === '')
        return sendError(res, 'Password is required', 'password');
    if (String(password).length < 6)
        return sendError(res, 'Password must be at least 6 characters', 'password');

    if (!mobile || String(mobile).trim() === '')
        return sendError(res, 'Mobile number is required', 'mobile');
    if (!/^\d{10}$/.test(String(mobile)))
        return sendError(res, 'Mobile number must be exactly 10 digits', 'mobile');

    if (!branch || String(branch).trim() === '')
        return sendError(res, 'Branch is required', 'branch');

    if (!address || String(address).trim() === '')
        return sendError(res, 'Address is required', 'address');

    if (!userType)
        return sendError(res, 'User type is required', 'userType');
    if (!['admin', 'employee', 'customer'].includes(userType))
        return sendError(res, 'User type must be "admin", "employee", or "customer"', 'userType');

    next();
};

// ── Customer ─────────────────────────────────────────────────
const validateCustomer = (req, res, next) => {
    const { fullName, email, password, mobile, fatherName, dob, gender, branch, address } = req.body;

    if (!fullName || String(fullName).trim() === '')
        return sendError(res, 'Full name is required', 'fullName');

    if (!email || String(email).trim() === '')
        return sendError(res, 'Email is required', 'email');
    if (!/^\S+@\S+\.\S+$/.test(email))
        return sendError(res, 'Please enter a valid email address', 'email');

    if (!password || String(password).trim() === '')
        return sendError(res, 'Password is required', 'password');
    if (String(password).length < 6)
        return sendError(res, 'Password must be at least 6 characters', 'password');

    if (!mobile || String(mobile).trim() === '')
        return sendError(res, 'Mobile number is required', 'mobile');
    if (!/^\d{10}$/.test(String(mobile)))
        return sendError(res, 'Mobile number must be exactly 10 digits', 'mobile');

    if (!fatherName || String(fatherName).trim() === '')
        return sendError(res, "Father's name is required", 'fatherName');

    if (!dob || String(dob).trim() === '')
        return sendError(res, 'Date of birth is required', 'dob');

    if (!gender)
        return sendError(res, 'Gender is required', 'gender');
    if (!['male', 'female', 'other'].includes(gender))
        return sendError(res, 'Gender must be "male", "female", or "other"', 'gender');

    if (!branch || String(branch).trim() === '')
        return sendError(res, 'Branch is required', 'branch');

    if (!address || String(address).trim() === '')
        return sendError(res, 'Address is required', 'address');

    next();
};

// ── Login ─────────────────────────────────────────────────────
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || String(email).trim() === '')
        return sendError(res, 'Email is required', 'email');
    if (!/^\S+@\S+\.\S+$/.test(email))
        return sendError(res, 'Please enter a valid email address', 'email');

    if (!password || String(password).trim() === '')
        return sendError(res, 'Password is required', 'password');

    next();
};

module.exports = {
    validateTransaction,
    validateTransactionFilter,
    validateUser,
    validateCustomer,
    validateLogin
};
