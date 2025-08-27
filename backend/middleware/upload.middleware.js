import upload from "./multer.middleware.js"

const uploadMiddleware = async (req, res, next) => {
    upload.single("picture")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
}

export default uploadMiddleware