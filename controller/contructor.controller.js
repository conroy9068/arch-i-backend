const db = require("../database/config");
Contructor = db.contructor;

const createContructor = async (req, res) => {
  try {
    await Contructor.create({
      contructor_name: req.body.name,
      companyName: req.body.companyName,
      signature: req.body.signature,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
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
const updateContructor = async (req, res) => {
  try {
    await Contructor.update(
      {
        end_time: req.body.end_time,
      },
      {
        where: { contructor_id: req.params.cid },
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

const getContructorList = async (req, res) => {
  const contructorList = [];
  try {
    const data = await Contructor.findAll();
    data.forEach((d) => {
      if (!d.dataValues.end_time) {
        contructorList.push(d.dataValues);
      }
    });
    res.status(200).json({
      status: true,
      data: contructorList,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const getContructorListAdmin = async (req, res) => {
  try {
    const data = await Contructor.findAll({
      order: [["start_time", "DESC"]],
    });
    res.status(200).json({
      status: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};
const editContructor = async (req, res) => {
  try {
    await Contructor.update(
      {
        name: req.body.name,
        companyName: req.body.companyName,
        signature: req.body.signature,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
      },
      {
        where: {
          contructor_id: req.params.cid,
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
const deleteContructor = async (req, res) => {
  try {
    const data = await Contructor.destroy({
      where: {
        contructor_id: req.params.cid,
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
  createContructor,
  updateContructor,
  getContructorList,
  getContructorListAdmin,
  editContructor,
  deleteContructor,
};
