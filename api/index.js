import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import authRouter from '../api/routes/auth.route.js'
import userRouter from '../api/routes/user.route.js'
import test from './routes/user.route.js'
import cookieParser from 'cookie-parser';
import cors from "cors";
import axios from 'axios'

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



app.listen(3000,()=>{
    console.log("server is running on port 3000...")
})

//test route
// app.use('/api/tes',test);

//signup route
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)



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



//test sign-in route 
const signIn = async (email, password) => {
    try {
        const res = await fetch("http://localhost:3000/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
            credentials: "include" // Include cookies for authentication
        });

        if (!res.ok) {
            throw new Error("Invalid email or password");
        }

        const data = await res.json();
        console.log("Login successful:", data);
        return data;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
};

// // Example usage
signIn("student@gmail.com", "student");




  











