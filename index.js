const express = require("express");
const { static } = express;
const app = express();
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const morgan = require("morgan");
const { checkAccessToken } = require("./utils/auth");
require("dotenv").config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up connection to MongoDB
const mongoUri = process.env.mongoUri;
if (!mongoUri) {
    // console.log(process.env);
    console.log("The mongoUri was not found.");
    process.exit(1);
}

const mongoose = require("mongoose");
mongoose.connect(mongoUri).catch((error) => {
    console.log("MongoDB Connection error:\n" + error);
    process.exit(1);
});

// Middleware
app.use(morgan("dev"));
app.use(static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Routers (yes)
const APIROUTE = "/api";
const statusRouter = require("./routes/status");
const signupRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const testsRouter = require("./routes/tests");
const userRouter = require("./routes/userinfo");
const fypRouter = require("./routes/fyp");
app.use(`${APIROUTE}/status`, statusRouter);
app.use(`${APIROUTE}/signup`, signupRouter);
app.use(`${APIROUTE}/login`, loginRouter);
app.use(`${APIROUTE}/tests`, testsRouter);
app.use(`${APIROUTE}/userinfo`, userRouter);
app.use(`${APIROUTE}/fyp`, fypRouter);

// Catch when the API route does not exist
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "notfound.html"));
});

// Start server and listen for responses
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`START / ${PORT} @ http://localhost:${PORT}/`);
});
