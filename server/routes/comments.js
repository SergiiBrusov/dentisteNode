import express from "express";
import multer from "multer";
import Comment from "../models/Comment.js";
import path from "path";
import validator from "validator";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Allowed file types for upload
// Only JPEG, PNG, and WEBP images are allowed
const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers JPEG, PNG, et WEBP sont autorisés."));
    }
  },
});

// Get all comments
router.get("/", async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});

// Add comment
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { name, message, token } = req.body;

    if (!name || !message || !token) {
      return res.status(400).json({ error: "Données incomplètes" });
    }

    // reCAPTCHA validation (v2)
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    const { data } = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      new URLSearchParams({
        secret,
        response: token,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!data.success) {
      return res.status(403).json({ error: "Échec reCAPTCHA" });
    }

    const safeName = validator.escape(name);
    const safeMessage = validator.escape(message);
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newComment = new Comment({
      name: safeName,
      message: safeMessage,
      photoUrl,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ error: err.message || "Erreur lors de l'envoi" });
  }
});

// Likes
router.put("/:id/like", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du like" });
  }
});

export default router;
