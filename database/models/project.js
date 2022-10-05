module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define("project", {
    project_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    project_name: {
      type: Sequelize.STRING(100),
    },
  });
  return Project;
};
