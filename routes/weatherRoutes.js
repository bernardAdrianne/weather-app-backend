import express from "express";
import { searchWeather } from "../controllers/weather.js";

const router = express.Router();

router.get('/weather/:city', searchWeather);

export default router;