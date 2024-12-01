import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import createApp from "./app";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = createApp();

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Data Source initialization error:", error);
  });
