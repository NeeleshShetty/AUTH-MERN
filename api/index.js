import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from "./routes/user.auth.js"
dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Successfully connected to  MongoDB.");
})
.catch((err) => console.error("Error in connecting the MongoDB"));

const app = express()

app.use('/api/user',userRoutes)
app.listen(3000, () => {
    console.log("Successfully running on server 3000");
})