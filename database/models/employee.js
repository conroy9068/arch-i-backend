module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define("employee", {
    employee_id: {
      type: Sequelize.UUID,
    },
    name: {
      type: Sequelize.STRING(50),
    },
  });
  return Employee;
};
