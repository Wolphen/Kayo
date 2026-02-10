import app from "./app";
import dotenv from "dotenv";

dotenv.config({ path: "env" });
dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
