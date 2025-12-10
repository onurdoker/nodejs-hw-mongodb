import dotenv from "dotenv";
import { setupServer } from "./server.js";
import initMongoConnection from "./db/initMongoConnection.js";
import { createFileIfNotExist } from "./utils/createFileIfNotExist.js";
import { UPLOAD_FOLDER, TEMP_FOLDER } from "./constants/index.js";

dotenv.config();
const bootstrap = async () => {
  await initMongoConnection();
  await createFileIfNotExist(UPLOAD_FOLDER);
  await createFileIfNotExist(TEMP_FOLDER);
  setupServer();
};

bootstrap();
