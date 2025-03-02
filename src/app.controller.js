import helmet from "helmet";
import connectionDB from "./DB/connectionDb.js";
import { AppError, globalErrorHandller } from "./utils/globalErrorHandling/index.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import cron from"node-cron";
import { UserModel } from "./DB/models/user.model.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js";


const limiter = rateLimit({
  windowMs:  15*60 * 1000, 
  limit: 50,
  legacyHeaders: false,
  handler: (req, res, next) => {
    return next(new AppError("Too many requests", 429));
  }
});
const bootstrap = (app, express) => {
  // Apply the rate limiting middleware to all requests.
  app.use(limiter);
  app.use(cors());
  app.use(helmet());
  app.use(express.json());

  // connect to database
  connectionDB();

  // main route
  app.get("/", (req, res, next) => {
    res.status(200).send("Welcome to the API");
  });

  // application routes
  app.use("/auth",authRouter)
  app.use("/user",userRouter)


  // routes for unhandelered requests
  app.use("*", (req, res, next) => {
    return next(new Error(`invalid url ${req.originalUrl}`, { cause: 404 }));
  });

  // delete expired OTPs
  cron.schedule("0 * */6 * *", async () => {
    try {
        await UserModel.updateMany({}, { $pull: { OTP: { expiresIn: { $lt: new Date() } } } });
        console.log("Expired OTPs deleted");
    } catch (error) {
        console.error("Error deleting expired OTPs:", error);
    }
});

  // global error handler
  app.use(globalErrorHandller);
};

export default bootstrap;
