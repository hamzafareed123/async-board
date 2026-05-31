import express from "express";
import {ENV} from "./config/env"
import dbConnect from "./config/db"
import helmet from "helmet";
import morgan from "morgan";
import authRoute from "./modules/auth/auth-route"

dbConnect();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(morgan("dev"))

app.use("/api/auth",authRoute);



app.listen(ENV.PORT,()=>{
    console.log(`Server is running on port ${ENV.PORT}`)
})