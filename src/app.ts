import express, { Application, Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./modules/user/user.route";
import { AdminRoutes } from "./modules/admin/admin.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Server is running..." });
});

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/admins", AdminRoutes);

export default app;
