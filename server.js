import express from "express"; 
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Routes
import weatherRoutes from "./routes/weatherRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://weather-app-frontend-one-pi.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());

app.use("/api", weatherRoutes);

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log("MongoDb connected");
    } catch (err) {
        console.error("MongoDb connection error: ", err.message);
        process.exit(1);
    }
};

app.get("/", (req, res) => {
  res.send("🌦 Weather App Backend is running...");
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});