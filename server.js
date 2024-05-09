require("dotenv").config({ path: __dirname + "/.env" });
// const backup_task = require("./services/backup");
// const update_currency_rate = require("./services/currency");
// const restore = require("./services/restordb");
const express = require("express");
const connectDb = require("./config/db").connectDb;
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser');
const cors = require("cors");
// const helmet = require("helmet");

const app = express();

connectDb()
  .then((res) => console.log("connected"))
  .catch((e) => console.log(e));
let port = process.env.PORT || 5050;
//cores fix
app.use(cors());
// app.use(
//   cors({
//     origin: "*",
//   })
// );

// app.use(
//   cors({
//     origin: "*",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   })
// );

// app.use(express.json({ limit: "10mb" }));

// Increase URL-encoded payload size limit
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const routeAPI = require("./Routes/index.js");
app.use("/api", routeAPI);

// global error handdler


app.listen(port, () => console.log(`App listening on port ${port}!`));