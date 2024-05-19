import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



// console.log("momgo uri",process.env.MONGODB_URI,"DB_NAME",{DB_NAME})
const ConnectDb=async()=>{
    try{
       const connectInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`\n mongodb connected..!! DB_HOST:${connectInstance.connection.host}`)
    }catch(error){
        console.log("mongoDB connection ERROR FAILED",error);
        process.exit(1)
    }
}

export default ConnectDb
