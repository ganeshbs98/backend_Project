import dotenv from 'dotenv'
import ConnectDB from "./db/dbconnect.js";
import { app } from './app.js';


dotenv.config({
    path:'./.env'
})

const Port=process.env.PORT||7000

ConnectDB().then(()=>{
    app.listen(Port,()=>{
        console.log("lsitening to port ",Port)
    })
}).catch((error)=>{
    console.log("Error",error)
})


//  const app=express()
/*(async()=>{
    try{
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error    )=>{
        console.log("Error: " ,error)
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`listening on ${process.env.PORT}`)
       })
    }catch(error){
        console.log("ERROR",error)
    }
})()*/