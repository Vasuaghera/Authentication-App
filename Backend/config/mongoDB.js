import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Database connection successful");
    }   
    catch(error) {
        console.error("Database connection failed", error);
        process.exit(1); 
    }
};

export default connectDB ;
