import express from "express";
import userRoutes from "./routes/user.routes";
import commentRoutes from './routes/comment.routes';
import postRoutes from "./routes/post.routes";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    return next();
});

app.use("/users", userRoutes);
app.use("/comments", commentRoutes);
app.use("/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("API running.");
});

export default app;
