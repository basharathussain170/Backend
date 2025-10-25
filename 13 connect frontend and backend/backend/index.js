const express = require("express");
const dotenv = require("dotenv");
const cors=require('cors')

dotenv.config();
const app = express();

//local module
const connectDB = require("./config/db");
const userRoute = require("./routes/userRoute");

connectDB();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/users", userRoute);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
