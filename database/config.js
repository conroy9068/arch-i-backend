const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "postgres://dopdpvpm:JUY3VF-2yd9IvBaW-IoTHMXOK5wrOwd3@mouse.db.elephantsql.com/dopdpvpm"
);
// const sequelize = new Sequelize("employees", "postgres", "shawon", {
//   host: "localhost",
//   dialect: "postgres",
//   operatorsAliases: false,
// });
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.employee = require("./models/employee")(sequelize, Sequelize);
db.project = require("./models/project")(sequelize, Sequelize);
db.employee_Hour = require("./models/employee_hour")(sequelize, Sequelize);
db.admin = require("./models/admin")(sequelize, Sequelize);

db.project.hasOne(db.employee_Hour, {
  foreignKey: "project_id",
  allowNull: false,
  unique: true,
  as: "employee_hour",
});
db.employee_Hour.belongsTo(db.project, {
  foreignKey: "project_id",
  allowNull: false,
  unique: true,
  as: "project",
});
// db.employee.hasMany(db.employee_Hour, {
//   foreignKey: "employee_id",
//   allowNull: false,
//   unique: true,
// });
// db.employee_Hour.belongsTo(db.employee, {
//   foreignKey: "employee_id",
//   allowNull: false,
//   unique: true,
// });

module.exports = db;
