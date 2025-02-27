const express = require("express");
const connectDB = require("./db/connect");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const routes = require("./routes/api/v1/index");

const app = express();

// Ensure certificates directory exists
const certificatesDir = path.join(process.cwd(), "certificates");
if (!fs.existsSync(certificatesDir)) {
    fs.mkdirSync(certificatesDir);
    console.log("Created certificates directory");
}

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

connectDB();

app.use("/api/v1", routes);

app.listen(5000, () => {
    console.log(`Server running on port 5000`);
});
