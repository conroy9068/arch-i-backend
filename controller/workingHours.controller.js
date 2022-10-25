const db = require("../database/config");
const moment = require("moment");
const { Op, Sequelize } = require("sequelize");
Employee_Hour = db.employee_Hour;
Employee = db.employee;

//Calculating hours
const getHoursformTime = (stime, etime) => {
  const dateFormat = "YYYY-MM-DD HH:mm:ss";
  const duration = moment(moment(etime).format(dateFormat)).diff(
    moment(stime).format(dateFormat),
    "minutes"
  );
  let hour_minute = 0;
  const h = parseInt(duration / 60);
  const m = parseInt(duration % 60);
  if (m < 10) {
    hour_minute = parseFloat(h + ".0" + m);
  } else {
    hour_minute = parseFloat(h + "." + m);
  }

  return parseFloat(hour_minute.toFixed(2));
};

//organizing data
const manipulateData = (data) => {
  const chartData = [];
  let series;
  data.forEach((d) => {
    const foundValue = chartData.find((value) => {
      return value.project_id == d.dataValues.project_id;
    });
    if (foundValue === undefined) {
      const hourData = [];
      hourData.push(parseFloat(d.dataValues.hours.toFixed(2)));
      series = {
        project_name: d.dataValues.project.dataValues.project_name,
        project_id: d.dataValues.project_id,
        hours: hourData,
        working_date: [d.dataValues.date],
      };
      chartData.push(series);
    } else {
      chartData.forEach((cd) => {
        if (cd.project_id === d.dataValues.project_id) {
          if (!cd.working_date.includes(d.dataValues.date)) {
            cd.hours.push(d.dataValues.hours);
            cd.working_date.push(d.dataValues.date);
          } else {
            const index = cd.working_date.indexOf(d.dataValues.date);
            cd.hours[index] = cd.hours[index] + d.dataValues.hours;

            let hm = cd.hours[index].toString().split(".");
            if (hm[1] > 59) {
              let hour_minute = 0;
              let h = parseInt(hm[0]);
              let hh = parseInt(hm[1] / 60);
              let nm = parseInt(hm[1] % 60);
              h = h + hh;
              if (nm < 10) {
                hour_minute = parseFloat(h + ".0" + nm);
              } else {
                hour_minute = parseFloat(h + "." + nm);
              }
              cd.hours[index] = hour_minute;
            }
          }
        }
      });
    }
  });
  return chartData;
};
//creating array based on given date
const createDateArray = (sdate, edate) => {
  var start = moment(sdate, "YYYY-MM-DD");
  var end = moment(edate, "YYYY-MM-DD");
  const total_date = moment.duration(end.diff(start)).asDays();

  const newDateArray = [];
  for (let i = 0; i <= total_date; i++) {
    const dates = moment(sdate).add(i, "days").format("YYYY-MM-DD").toString();
    newDateArray.push(dates);
  }
  return newDateArray;
};

//reorganizing data
const findMissingDate = (data, sd, ed) => {
  const dateArray = createDateArray(sd, ed);
  data.forEach((d) => {
    for (let i = 0; i < dateArray.length; i++) {
      if (dateArray[i] !== d.working_date[i]) {
        d.hours.splice(i, 0, 0);
        d.working_date.splice(i, 0, dateArray[i]);
      }
    }
  });
  return data;
};

const updateEmployee_hour = async (req, res) => {
  try {
    const info = await Employee_Hour.findOne({
      where: {
        employee_id: req.params.eid,
        project_id: req.params.pid,
        date: req.body.date,
      },
    });
    const hour_minute = getHoursformTime(
      info.dataValues.start_time,
      req.body.end_time
    );
    try {
      const data = await Employee_Hour.update(
        {
          end_time: req.body.end_time,
          hours: hour_minute,
        },
        {
          where: {
            project_id: req.params.pid,
            employee_id: req.params.eid,
            date: req.body.date,
          },
        }
      );
      res.status(200).json({
        status: true,
        message: data,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: `${err} Something went wrong`,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const createEmployee_hour = async (req, res) => {
  let hour_minute = 0;
  if (req.body.end_time) {
    hour_minute = getHoursformTime(req.body.start_time, req.body.end_time);
  }
  try {
    const data = await Employee_Hour.create({
      employee_id: req.body.employee_id,
      project_id: req.body.project_id,
      date: req.body.date,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      hours: hour_minute,
    });
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

const getHoursByEmployee = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD").toString();
    const pastSeven = moment(today)
      .subtract(7, "days")
      .format("YYYY-MM-DD")
      .toString();

    const employee = req.query.employee;
    const project = req.query.project;
    const sdate = req.query.sdate || pastSeven;
    const edate = req.query.edate || today;

    const query = {
      [Op.or]: [
        {
          date: {
            [Op.between]: [sdate, edate],
          },
        },
      ],
    };

    if (employee && project) {
      query.employee_id = employee;
      query.project_id = project;
    }
    if (employee) {
      query.employee_id = employee;
    }
    if (project) {
      query.project_id = project;
    }

    const data = await Employee_Hour.findAll({
      include: [{ model: db.project, as: "project" }],
      where: query,
      order: [["date", "ASC"]],
    });
    const chartData = manipulateData(data);
    findMissingDate(chartData, sdate, edate);
    res.status(200).json({
      status: true,
      ChartData: chartData,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const calculateHour = (data) => {
  let total_hours = 0;
  data.forEach((d) => {
    total_hours = total_hours + d.dataValues.hours;

    let hm = total_hours.toString().split(".");
    if (hm[1] > 59) {
      let hour_minute = 0;
      let h = parseInt(hm[0]);
      let hh = parseInt(hm[1] / 60);
      let nm = parseInt(hm[1] % 60);
      h = h + hh;
      if (nm < 10) {
        hour_minute = parseFloat(h + ".0" + nm);
      } else {
        hour_minute = parseFloat(h + "." + nm);
      }
      total_hours = hour_minute;
    }
  });
  return parseFloat(total_hours.toFixed(2));
};
const organizeData = (data, edata) => {
  const employee_data = {
    employee_id: edata.dataValues.employee_id,
    employee_name: edata.dataValues.name,
    total_hours: calculateHour(data),
    project: null,
  };
  data.forEach((d) => {
    const time = moment(d.dataValues.start_time)
      .format("YYYY-MM-DD H:m:s")
      .toString();
    const pdata = {
      project_id: d.dataValues.project.dataValues.project_id,
      project_name: d.dataValues.project.dataValues.project_name,
      start_time: time,
    };
    if (!d.dataValues.end_time) {
      employee_data.project = pdata;
    } else {
      employee_data.project = null;
    }
  });
  return employee_data;
};
const getSingleEmployeeProject = async (req, res) => {
  try {
    const today = moment().format("YYYY-MM-DD").toString();
    const edata = await Employee.findByPk(req.params.eid);
    const data = await Employee_Hour.findAll({
      // attributes: [
      //   [Sequelize.fn("DISTINCT", Sequelize.col("project_id")), "project_id"],
      // ],
      where: { employee_id: req.params.eid, date: today },
      include: [{ model: db.project, as: "project" }],
    });
    //console.log(data);
    const employee_data = organizeData(data, edata);
    res.status(200).json({
      status: true,
      data: employee_data,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const organizeEmployeeData = (data, edata) => {
  const employee_data = [];
  data.forEach((d) => {
    let etime = null;
    const stime = moment(d.dataValues.start_time)
      .format("YYYY-MM-DD H:m:s")
      .toString();
    if (d.dataValues.end_time) {
      etime = moment(d.dataValues.end_time)
        .format("YYYY-MM-DD H:m:s")
        .toString();
    }

    const info = {
      id: d.dataValues.id,
      project_id: d.dataValues.project.dataValues.project_id,
      project_name: d.dataValues.project.dataValues.project_name,
      start_time: stime,
      end_time: etime,
      hours: d.dataValues.hours,
      date: d.dataValues.date,
    };
    edata.forEach((ed) => {
      if (d.dataValues.employee_id === ed.dataValues.employee_id) {
        (info.employee_id = ed.dataValues.employee_id),
          (info.employee_name = ed.dataValues.name);
      }
    });
    employee_data.push(info);
  });

  return employee_data;
};

const getAllEmployee = async (req, res) => {
  try {
    let skipdata = 0;
    let maxlimit = 5;
    if (req.query.limit) {
      maxlimit = req.query.limit;
    }
    if (req.query.page && req.query.page > 0) {
      skipdata = (req.query.page - 1) * maxlimit;
    }
    const today = moment().format("YYYY-MM-DD").toString();
    const pastSeven = moment(today)
      .subtract(7, "days")
      .format("YYYY-MM-DD")
      .toString();
    const employee = req.query.employee;
    const project = req.query.project;
    const sdate = req.query.sdate || pastSeven;
    const edate = req.query.edate || today;

    const query = {
      [Op.or]: [
        {
          date: {
            [Op.between]: [sdate, edate],
          },
        },
      ],
    };

    if (employee && project) {
      query.employee_id = employee;
      query.project_id = project;
    }
    if (employee) {
      query.employee_id = employee;
    }
    if (project) {
      query.project_id = project;
    }

    const info = await Employee_Hour.findAll({ where: query });
    const edata = await Employee.findAll();
    const data = await Employee_Hour.findAll({
      where: query,
      offset: skipdata,
      limit: maxlimit,
      include: [{ model: db.project, as: "project" }],
    });
    const employee_data = organizeEmployeeData(data, edata);
    res.status(200).json({
      status: true,
      data: employee_data,
      total: info.length,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const editEmployee_hour = async (req, res) => {
  try {
    const info = await Employee_Hour.findOne({
      where: {
        employee_id: req.params.eid,
        project_id: req.params.pid,
        date: req.body.date,
      },
    });
    const stime = req.body.start_time || info.dataValues.start_time;
    const etime = req.body.end_time || info.dataValues.end_time;
    const hour_minute = getHoursformTime(stime, etime);
    const data = await Employee_Hour.update(
      {
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        hours: hour_minute,
      },
      {
        where: {
          project_id: req.params.pid,
          employee_id: req.params.eid,
          date: req.body.date,
        },
      }
    );

    if (data[0] === 0) {
      res.status(404).json({
        status: false,
        message: "Could not update data",
      });
    } else {
      res.status(200).json({
        status: true,
        data: data,
      });
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something missing`,
    });
  }
};

const deleteEmployee_hour = async (req, res) => {
  try {
    const data = await Employee_Hour.destroy({
      where: {
        id: req.params.id,
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
  updateEmployee_hour,
  createEmployee_hour,
  getHoursByEmployee,
  getSingleEmployeeProject,
  deleteEmployee_hour,
  editEmployee_hour,
  getAllEmployee,
};
