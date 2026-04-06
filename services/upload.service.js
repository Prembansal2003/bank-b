const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const folder = req.query.folderName;
        if (!folder) {
            return cb(new Error("No folder name provided"));
        }
        const uploadPath = path.join(__dirname, "../public", folder);
        
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + unique + ext);
    }
});

const upload = multer({ storage });
module.exports = upload;
