const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://dopdpvpm:JUY3VF-2yd9IvBaW-IoTHMXOK5wrOwd3@mouse.db.elephantsql.com/dopdpvpm"
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.employee = require("./models/employee")(sequelize, Sequelize);
db.project = require("./models/project")(sequelize, Sequelize);
db.employee_Hour = require("./models/employee_hour")(sequelize, Sequelize);
db.admin = require("./models/admin")(sequelize, Sequelize);

// db.project.hasOne(db.employee_Hour, {
//   foreignKey: "project_id",
// });

module.exports = db;
