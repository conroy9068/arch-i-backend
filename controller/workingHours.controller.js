const db = require("../database/config");
const moment = require("moment");
const { Op } = require("sequelize");
Employee_Hour = db.employee_Hour;

//Calculating hours
const getHoursformTime = (stime, etime) => {
  const dateFormat = "YYYY-MM-DD HH:mm:ss";
  const duration = moment(moment(etime).format(dateFormat)).diff(
    moment(stime).format(dateFormat),
    "minutes"
  );
  const hour_minute = parseFloat(
    parseInt(duration / 60) + "." + parseInt(duration % 60)
  );
  return hour_minute;
};

//organizing data
const manipulateData = (data) => {
  const chartData = [];
  let series;
  data.forEach((d) => {
    const foundValue = chartData.find((value) => {
      return value.name == d.dataValues.project_id;
    });
    if (foundValue === undefined) {
      const hourData = [];
      hourData.push(parseFloat(d.dataValues.hours.toFixed(2)));

      series = {
        name: d.dataValues.project_id,
        hours: hourData,
        working_date: [d.dataValues.date],
      };
      chartData.push(series);
    } else {
      chartData.forEach((cd) => {
        if (cd.name === d.dataValues.project_id) {
          if (!cd.working_date.includes(d.dataValues.date)) {
            cd.hours.push(d.dataValues.hours);
            cd.working_date.push(d.dataValues.date);
          } else {
            const index = cd.working_date.indexOf(d.dataValues.date);
            cd.hours[index] = cd.hours[index] + d.dataValues.hours;
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
  const newChart = [];
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
          hours: hour_minute.toFixed(2),
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
  try {
    await Employee_Hour.create({
      employee_id: req.body.employee_id,
      project_id: req.body.project_id,
      date: req.body.date,
      start_time: req.body.start_time,
    });
    res.status(200).json({
      status: true,
      message: `Data was inserted`,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `${err} Something went wrong`,
    });
  }
};

const getHoursByEmployee = async (req, res) => {
  const employee = req.query.employee;
  const project = req.query.project;
  const sdate = req.query.sdate || "2022-09-20";
  const edate = req.query.edate || "2022-09-21";

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

  try {
    const data = await Employee_Hour.findAll({
      where: query,
      order: [["date", "ASC"]],
    });

    const dateHours = manipulateData(data);
    const chartData = findMissingDate(dateHours, sdate, edate);
    console.log(chartData);
    res.status(200).json({
      status: true,
      ChartData: dateHours,
    });
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
};
