const db = require("../database/config");
Project = db.project;

const createProject = async (req, res) => {
  console.log(req.body);
  try {
    await Project.create({
      project_name: req.body.name,
    });
    res.status(200).json({
      status: true,
      message: `data was inserted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const getAllProject = async (req, res) => {
  try {
    const data = await Project.findAll();
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
const updateProject = async (req, res) => {
  try {
    await Project.update(
      {
        project_name: req.body.name,
      },
      {
        where: {
          project_id: req.params.pid,
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
const deleteProject = async (req, res) => {
  try {
    await Project.destroy({
      where: {
        project_id: req.params.pid,
      },
    });
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
module.exports = {
  createProject,
  getAllProject,
  deleteProject,
  updateProject,
};
