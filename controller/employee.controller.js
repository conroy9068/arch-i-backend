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
    let skipdata = 0;
    let maxlimit = 10;
    if (req.query.limit) {
      maxlimit = req.query.limit;
    }
    if (req.query.page && req.query.page > 0) {
      skipdata = (req.query.page - 1) * maxlimit;
    }
    const data = await Employee.findAll({ offset: skipdata, limit: maxlimit });
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
const updateEmployee = async (req, res) => {
  try {
    await Employee.update(
      {
        name: req.body.name,
      },
      {
        where: {
          employee_id: req.params.eid,
        },
      }
    );
    res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};
const deleteEmployee = async (req, res) => {
  try {
    const data = await Employee.destroy({
      where: {
        employee_id: req.params.eid,
      },
    });
    if (data === 0) {
      res.status(404).json({
        status: false,
      });
    } else {
      res.status(200).json({
        status: true,
      });
    }
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
  deleteEmployee,
  updateEmployee,
};
