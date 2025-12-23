import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import contactRouter from "./routers/contacts.js";
import authRouter from "./routers/auth.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { UPLOAD_FOLDER } from "./constants/index.js";

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

  // Static File Server
  app.use("/uploads", express.static(UPLOAD_FOLDER));

  // Swagger UI - /api-docs
  const swaggerJsonPath = path.resolve("docs", "swagger.json");
  let swaggerDocument = {};

  if (fs.existsSync(swaggerJsonPath)) {
    swaggerDocument = JSON.parse(fs.readFileSync(swaggerJsonPath, "utf-8"));
  }

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Routes
  app.use("/contacts", contactRouter);

  app.use("/auth", authRouter);

  // Handle 404
  app.use(notFoundHandler);

  // Handle 500
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.APP_DOMAIN}`);
  });
}
