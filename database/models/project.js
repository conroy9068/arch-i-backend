module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("project", {
    project_id: {
      type: Sequelize.UUID,
    },
    project_name: {
      type: Sequelize.STRING(100),
    },
  });
  return Project;
};
