import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },

  filename: async (req, file, cb) => {
    cb(null, file.originalname);
  }
});

export default multer({ storage });
