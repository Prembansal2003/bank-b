const cloudinary = require("cloudinary");
const fs = require("fs"); 

const uploadfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                error: "no file uploaded"
            });
        }

        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        
        
        fs.unlinkSync(req.file.path); 

        res.status(200).json({
            message: "file uploaded successfully",
            filePath: uploadResult.url,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Upload failed" });
    }
}

module.exports = { uploadfile };
