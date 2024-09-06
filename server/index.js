import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors'
const app = express()
const PORT = 8000
import dotenv from 'dotenv';
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

import userRoute from "./routes/userRoute.js"

app.use('/api/v1', userRoute)

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log(`Connected!`);
    app.listen(PORT, ()=>{
        console.log(`App is running on port ${PORT}`);
    })    
}).catch((err) => {
    console.log(err);
});