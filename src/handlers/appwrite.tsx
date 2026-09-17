import { Client, Account, TablesDB } from "appwrite";
import {} from "appwrite";

console.log("Endpoint:", import.meta.env.VITE_APPWRITE_ENDPOINT);
console.log("Project ID:", import.meta.env.VITE_APPWRITE_PROJECT_ID);

const client = new Client()
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT);

const account = new Account(client);

const databases = new TablesDB(client);

const tablesAPI = new TablesDB(client);

export { client, account, databases, tablesAPI };
