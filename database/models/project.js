module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("project", {
    name: {
      type: Sequelize.STRING(100),
    },
  });
  return Project;
};
