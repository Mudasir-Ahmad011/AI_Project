const express = require('express');
const connecttomongoose = require('./db');
var cors = require('cors');

connecttomongoose();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth",require("./routes/auth"));
app.use("/api/admin",require("./routes/admin"));
app.use("/api/agent",require("./routes/agent"));

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
})