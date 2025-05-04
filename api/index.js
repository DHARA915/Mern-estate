import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import authRouter from '../api/routes/auth.route.js'
import userRouter from '../api/routes/user.route.js'
import listRouter from '../api/routes/listing.route.js'
import test from './routes/user.route.js'
import cookieParser from 'cookie-parser';
import cors from "cors";
import axios from 'axios'
import path from 'path'

dotenv.config();


const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    
}));



mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected sucessfully")
}).catch((err)=>{
    console.log(err)
})

const __dirname = path.resolve();




app.listen(3000,()=>{
    console.log("server is running on port 3000...")
})

//test route
// app.use('/api/tes',test);

//signup route
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/listing',listRouter)

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*',(req,res)=>{
   res.sendFile(path.join(__dirname,'client','dist','index.html'));
})



//Error Handling Middleware
app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message = err.message || 'Internal server Error'
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})


