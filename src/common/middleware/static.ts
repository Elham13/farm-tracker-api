import path from "node:path";
import express from "express";

const uploadPath = path.join(__dirname, "../../uploads");

const staticServe = express.static(uploadPath, {
  setHeaders: (res, _path) => {
    // Set appropriate headers for security;
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Content-Disposition", "inline");
  },
});

export default staticServe;
