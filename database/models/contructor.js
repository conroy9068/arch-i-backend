module.exports = (sequelize, Sequelize) => {
  const Contructor = sequelize.define("contructor", {
    contructor_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(50),
    },
    companyName: {
      type: Sequelize.STRING(150),
    },
    signature: {
      type: Sequelize.STRING(150),
    },
    start_time: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    end_time: {
      type: Sequelize.DATE,
    },
  });
  return Contructor;
};
