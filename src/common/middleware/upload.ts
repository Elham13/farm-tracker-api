import multer from "multer";
import path from "path";

const uploadDir = path.join(__dirname, "../../uploads");

const upload = multer({
  dest: uploadDir,
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename(_req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

export default upload;
