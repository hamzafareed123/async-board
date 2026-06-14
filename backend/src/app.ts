import express from "express";
import { ENV } from "./config/env"
import dbConnect from "./config/db"
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/auth-route";
import roomRoute from "./modules/room/room.route";
import { OutputHandler } from "./middlewares/outputHandler-middleware";



dbConnect();
const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"));

app.use("/api/auth", authRoute);
app.use("/api/room", roomRoute);

app.use((error: any, req: any, res: any, next: any) => {
  (res as any).error = error;

  const status =
    error instanceof Error &&
      "statusCode" in error &&
      typeof (error as any).statusCode === "number"
      ? (error as any).statusCode
      : 500;

  OutputHandler(status, req, res, next);
});


app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`)
})