import express, { Application, Request, Response } from "express";
import cors from "cors";
const app: Application = express();
import cookieParser from "cookie-parser";
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://bicycle-haven.vercel.app"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Medi Mart Server Is Running... 😇",
  });
});

// Error Handler
app.use(globalErrorHandler)
app.use(notFound);
export default app;
