import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import dotenv from "dotenv";
import { getContacts, getContactsById } from "./services/contacts.js";

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
  
  // Test route
  app.get("/", (req, res) => {
    res.send("Welcome to the contacts API!");
  });
  
  // Get all contacts
  app.get("/contacts", async (req, res) => {
    const contacts = await getContacts();
    console.log(contacts);
    
    res.status(200).send({
                           message: "Contacts fetched successfully",
                           status: 200,
                           data: contacts,
                         });
    
  });
  
  app.get("/contacts/:contactId", async (req, res) => {
    const { contactId } = req.params;
    
    const contact = await getContactsById(contactId);
    
    if (!contact) {
      return res.status(404).send({
                                    message: "Contact not found",
                                    status: 404,
                                  });
    }
    
    res.status(200).send({
                           message: "Contact fetched successfully",
                           status: 200,
                           data: contact,
                         });
    
    
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
  
  // Handle 500
  app.use((req, res) => {
    res.status(500).send(
        {
          message: "Something went wrong",
          status: 500,
        },
    );
  });
  
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
  
}
