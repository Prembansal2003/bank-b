const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser=require("body-parser");
const cors=require("cors");
const app = express();

app.use(cors({origin:"*"}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter=require("./routes/users.routes");
const uploadRouter=require("./routes/upload.routes");
const emailRouter=require("./routes/email.routes");
const brandingRouter=require("./routes/branding.routes");
const branchRouter=require("./routes/branch.routes");
const currencyRouter=require("./routes/currency.routes");
const loginRouter=require("./routes/login.routes");
const verifyRouter= require("./routes/verify.routes");
const customerRouter= require("./routes/customer.routes");
const findByAccountRouter=require("./routes/findByAccount.routes");
const transactionRouter=require("./routes/transaction.routes");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

 
app.use('/api/users',userRouter);
app.use('/api/upload',uploadRouter);
app.use('/api/email',emailRouter);
app.use('/api/branding',brandingRouter);
app.use('/api/branch',branchRouter);
app.use('/api/currency',currencyRouter);
app.use('/api/login',loginRouter);
app.use('/api/verify-token',verifyRouter);
app.use('/api/customers',customerRouter);
app.use('/api/find-by-account',findByAccountRouter);
app.use('/api/transaction',transactionRouter);


// error handler
// error handler (Revised for API)
app.use(function(err, req, res, next) {
    const status = err.status || 500;

    res.status(status).json({
        status: status,
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
