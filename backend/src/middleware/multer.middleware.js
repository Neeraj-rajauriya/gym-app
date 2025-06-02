import multer from "multer";
import path from "path";
import fs from "fs";


const dir = "uploads/progress";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/progress/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (/image\/(jpeg|png|jpg)/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter });
