import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import noteRoutes from './routes/note'

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
