import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from "./routes/user.route.js"
import authRoutes from './routes/auth.route.js'
dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Successfully connected to  MongoDB.");
})
.catch((err) => console.error("Error in connecting the MongoDB"));

const app = express()
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/auth',authRoutes)
app.listen(3000, () => {
    console.log("Successfully running on server 3000");
})