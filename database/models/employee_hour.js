module.exports = (sequelize, Sequelize) => {
  const Employee_Hour = sequelize.define(
    "employee_hour",
    {
      employee_id: {
        type: Sequelize.UUID,
      },
      // project_id: {
      //   type: Sequelize.UUID,
      //   // references: {
      //   //   model: "projects",
      //   //   key: "project_id",
      //   // },
      // },
      date: {
        type: Sequelize.DATEONLY,
      },
      start_time: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      end_time: {
        type: Sequelize.DATE,
        defaultValue: "1971-01-01T00:00:00.000Z",
      },
      hours: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
    }
  );
  return Employee_Hour;
};
