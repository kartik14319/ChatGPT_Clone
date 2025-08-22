import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import chatRoutes from "./routes/chat.js";

const app=express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.listen(PORT,()=>{
    console.log(`server  running on ${PORT}`);
    connectDB();
});

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected with DataBase");
    } catch(err){
        console.log("Failed to connect with DB",err);
    }
}

// app.post("/test",async (req,res)=>{
//     const options={
//         method:"POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },

//         body:JSON.stringify({
//             model:"gpt-4o-mini",
//             Messages:[{
//                 role:"user",
//                 Content:"hello"
//             }]
//         })
//     }
//     try{
//         const response = await fetch("https://api.openai.com/v1/chat/completions",options);
//           const data = await response.json();
//         // console.log(data.choices[0].Messages.Content);
//         res.send(data.choices[0].Messages.Content);
//     } catch(err){
//         console.log(err);
//     }
// });



  
       