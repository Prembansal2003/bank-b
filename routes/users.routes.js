const express = require("express");
const router = express.Router();
const userSchema = require("../model/users.model");
const controller = require("../controller/controller");
const { verifyToken, isAdmin, isAdminEmployee } = require("../middlewares/midddleware");
const { validateUser } = require("../middlewares/validate");

router.get('/', verifyToken, isAdmin, (req, res) => (
    controller.getData(req, res, userSchema)
));

router.post("/", verifyToken, isAdminEmployee, validateUser, (req, res) => {
    controller.createData(req, res, userSchema)
});

router.put("/:id", verifyToken, isAdminEmployee, (req, res) => {  // ← removed validateUser
    controller.updateData(req, res, userSchema)
});

router.delete("/:id", verifyToken, isAdminEmployee, (req, res) => {  // ← removed validateUser
    controller.deleteData(req, res, userSchema);
});

module.exports = router;
