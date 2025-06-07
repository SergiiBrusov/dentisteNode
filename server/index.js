import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db.js";
import commentsRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import fs from "fs";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();// <-- сначала инициализируем app


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 1 минута
  max: 100, // не более 5 запросов в минуту с одного IP
  message: "Trop de requêtes, réessayez plus tard.",
});

app.use("/api/comments", limiter);

 
// Создать папку uploads, если её нет
const dir = "./uploads";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const PORT = process.env.PORT || 3001;

connectDB();
const corsOptions = {
  origin: "http://localhost:5173", // адрес фронта
  credentials: true,
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // для поддержки form-data

app.use("/uploads", express.static("uploads"));

app.use("/api/comments", commentsRoutes);
app.use("/api/auth", authRoutes); // <-- теперь можно использовать

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
