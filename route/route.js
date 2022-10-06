module.exports = (app) => {
  const authController = require("../controller/auth.controller");
  const employeeController = require("../controller/employee.controller");
  const projectController = require("../controller/project.controller");
  const workingHoursController = require("../controller/workingHours.controller");
  const passport = require("passport");

  //create and get employee
  app.post("/api/employee", employeeController.createEmployee);
  app.get("/api/employees", employeeController.getAllEmployee);

  //create and get project
  app.post("/api/project", projectController.createProject);
  app.get("/api/projects", projectController.getAllProject);

  //create, update and get working hours
  app.post("/api/employee/hours", workingHoursController.createEmployee_hour);
  app.put(
    "/api/employee/:eid/project/:pid/end_hours",
    workingHoursController.updateEmployee_hour
  );
  app.get("/api/hours", workingHoursController.getHoursByEmployee);
  app.get(
    "/api/employee/:eid",
    workingHoursController.getSingleEmployeeProject
  );

  //auth
  app.post("/api/auth/register", authController.register);
  app.post("/api/auth/login", authController.login);
  app.get(
    "/api/auth/protected",
    passport.authenticate("jwt", { session: false }),
    authController.protectedRoute
  );
};
