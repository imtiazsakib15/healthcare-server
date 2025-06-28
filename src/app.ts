import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Server is running..." });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
