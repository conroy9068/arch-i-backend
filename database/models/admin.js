module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define(
    "admin",
    {
      name: {
        type: Sequelize.STRING(50),
      },
      email: {
        type: Sequelize.STRING(150),
      },
      password: {
        type: Sequelize.STRING(150),
      },
    },
    {
      timestamp: false,
    }
  );
  return Admin;
};
