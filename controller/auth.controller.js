const db = require("../database/config");
const jwt = require("jsonwebtoken");
Admin = db.admin;

const register = async (req, res) => {
  try {
    await Admin.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
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

const login = async (req, res) => {
  console.log(req.body);
  try {
    const data = await Admin.findOne({ where: { email: req.body.email } });
    const payload = {
      email: data.email,
      id: data.id,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN);
    res.json({ token: "Bearer " + accessToken });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const protectedRoute = (req, res) => {
  return res.status(200).send({
    user: req.user.email,
  });
};

module.exports = {
  register,
  login,
  protectedRoute,
};
