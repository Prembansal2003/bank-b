const express = require("express");
const router = express.Router();
const customerSchema = require("../model/customer.model");
const controller = require("../controller/controller");
const { verifyToken, isAdmin, isAdminEmployee } = require("../middlewares/midddleware");
const { validateCustomer } = require("../middlewares/validate");

router.get('/', verifyToken, isAdminEmployee, (req, res) => (
    controller.getData(req, res, customerSchema)
));

router.post("/", verifyToken, isAdminEmployee, validateCustomer, (req, res) => {
    controller.createData(req, res, customerSchema)
});

router.put("/:id", verifyToken, isAdminEmployee, (req, res) => {   // ← removed validateCustomer
    controller.updateData(req, res, customerSchema)
});

router.delete("/:id", verifyToken, isAdmin, (req, res) => {        // ← removed validateCustomer, isAdmin only
    controller.deleteData(req, res, customerSchema);
});

module.exports = router;
