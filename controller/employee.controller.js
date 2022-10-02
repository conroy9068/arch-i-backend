const db = require("../database/config");

Employee = db.employee;

const createEmployee = async (req, res) => {
  try {
    await Employee.create({
      name: req.body.name,
    });
    res.status(200).json({
      status: true,
      message: `Data was inserted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const data = await Employee.findAll();
    res.status(200).json({
      status: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployee,
};
