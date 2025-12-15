import mongoose from 'mongoose';


export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected successfully :", conn.connection.host);
    }catch(err){
        console.log("MongoDB connection failed");
        console.log(err);
        process.exit(1);
    }
}