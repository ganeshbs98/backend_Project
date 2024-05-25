import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRETKEY
});


export const uploadOnCloundinary=async(loaclFilePath)=>{
    try{
        if(!loaclFilePath)return null
        const response=await cloudinary.uploader.upload(loaclFilePath,{
            resource_type:'auto'
        })
        //file has been successfully
        console.log("File uploaded successfully",response.url)
        return response;

    }catch(Error){
        fs.unlinkSync(loaclFilePath)
        //removed the local saved temprory file as upload operation got failed
        return null
    }

}


// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });