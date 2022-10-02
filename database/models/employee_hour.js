const moment = require("moment");
module.exports = (sequelize, Sequelize) => {
  const Employee_Hour = sequelize.define("employee_hour", {
    employee_id: {
      type: Sequelize.STRING(),
    },
    project_id: {
      type: Sequelize.STRING(),
    },
    date: {
      type: Sequelize.DATEONLY,
    },
    start_time: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    end_time: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: "1971-01-01 00:00:00",
    },
    hours: {
      type: Sequelize.FLOAT(),
      defaultValue: 0,
    },
  });
  return Employee_Hour;
};
