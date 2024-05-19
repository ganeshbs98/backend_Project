import dotenv from 'dotenv'
import ConnectDb from "./db/dbconnect.js";


dotenv.config({
    path:'./env'
})

ConnectDb()


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