import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import contactRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT;

export function setupServer() {
  const app = express();

  //MIDDLEWARES
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    pinoHttp({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  // Test route
  app.get("/", (request, response) => {
    response.send("Welcome to the contacts API!");
  });

  // Routes
  app.use("/contacts", contactRouter);

  app.use("/auth", authRouter);

  // Handle 404
  app.use(notFoundHandler);

  // Handle 500
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
