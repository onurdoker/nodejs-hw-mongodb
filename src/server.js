import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

export function setupServer() {
  const app = express();
  
  //MIDDLEWARES
  app.use(cors());
  app.use(express.json());
  app.use(
      pinoHttp({
                 transport: {
                   target: "pino-pretty",
                 },
               }),
  );
  
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });
  
  // Handle 404
  app.use((req, res) => {
    res.status(404).send(
        {
          message: "Page not found",
          status: 404,
        },
    );
  });
  
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
  
}
