const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");

app.use(cors());
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
require("./controller/passport");

const db = require("./database/config");

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and Resync");
});
require("./route/route")(app);

app.listen(process.env.PORT || 8000, () => {
  console.log("server is running at port 8000");
});
