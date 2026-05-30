import express from "express";
import {ENV} from "./config/env"
import dbConnect from "./config/db"
import helmet from "helmet";
import morgan from "morgan";


dbConnect();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"))

app.get("/",(req,res)=>{
    res.send("Hello World")
})


app.listen(ENV.PORT,()=>{
    console.log(`Server is running on port ${ENV.PORT}`)
})