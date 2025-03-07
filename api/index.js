import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import authRouter from '../api/routes/auth.route.js'
import test from '../api/routes/test.js'
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected sucessfully")
}).catch((err)=>{
    console.log(err)
})

const app = express()
app.use(express.json());

app.listen(3000,()=>{
    console.log("server is running on port 3000...")
})

//test route
// app.use('/api/tes',test);

//signup route
app.use('/api/auth',authRouter)


