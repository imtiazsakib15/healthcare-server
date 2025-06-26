import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Server is running..." });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

export default app;
