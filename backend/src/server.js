import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { ENV } from './lib/env.js';
import { app,server } from './lib/socket.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json({limit:'10mb'}));
app.use(cors({origin:ENV.CLIENT_URL, credentials:true }));
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.get("/check", (req, res) => {
    console.log("Cookies:", req.cookies);
    res.json(req.cookies);
});

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.use((req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
    })
}

server.listen(PORT, () => {
  console.log('Server is running on port '+ PORT);
  connectDB();
});