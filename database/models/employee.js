module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define(
    "employee",
    {
      employee_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(50),
      },
    },
    {
      timestamps: false,
    }
  );
  return Employee;
};
