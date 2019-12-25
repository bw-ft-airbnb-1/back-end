import express, { Application, Request, Response, json } from "express";
import cors from "cors";

const app: Application = express();

// GLOBAL MIDDLEWARE
app.use(cors())
app.use(json());


app.get("/", (req: Request, res: Response) : void => {
  res.send("Hello World");
});

export default app;
