import express, { Application, Request, Response } from "express";
import cors from "cors";
const app: Application = express();
import cookieParser from "cookie-parser";
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';


// Middleware
app.use(express.json());
app.use(cookieParser());

// Cors Config
app.use(
  cors({
    origin: ["http://localhost:5173", "https://bicycle-haven.vercel.app"],
    credentials: true,
  })
);


// Application Routes
app.use('/api/v1', router)

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Medi Mart Server Is Running... 😇",
  });
});

// Error Handler
app.use(globalErrorHandler)
app.use(notFound);

// Export App
export default app;
