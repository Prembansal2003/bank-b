require("dotenv").config();
const jwt= require("jsonwebtoken");

const verifyToken = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            message: "There is no token!",
            isVerified: false
        };
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return {
            message: "There is no token!",
            isVerified: false
        };
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            message: "Token Verified",
            isVerified: true,
            data: decoded
        };
    } catch (error) {
        return {
            message: "Invalid or expired token",
            isVerified: false,
            error
        };
    }
};

module.exports = { verifyToken };
