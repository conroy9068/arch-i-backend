module.exports = (app) => {
  const authController = require("../controller/auth.controller");
  const employeeController = require("../controller/employee.controller");
  const projectController = require("../controller/project.controller");
  const workingHoursController = require("../controller/workingHours.controller");
  const contructorController = require("../controller/contructor.controller");
  const passport = require("passport");

  //create and get employee
  app.post("/api/v1/employee", employeeController.createEmployee);
  app.get("/api/v1/employees", employeeController.getAllEmployee);

  //create and get project
  app.post("/api/v1/project", projectController.createProject);
  app.get("/api/v1/projects", projectController.getAllProject);

  //create, update and get working hours
  app.post(
    "/api/v1/employee/hours",
    workingHoursController.createEmployee_hour
  );
  app.put(
    "/api/v1/employee/:eid/project/:pid/end_hours",
    workingHoursController.updateEmployee_hour
  );
  app.get("/api/v1/hours", workingHoursController.getHoursByEmployee);
  app.get(
    "/api/v1/employee/:eid",
    workingHoursController.getSingleEmployeeProject
  );

  //Contructor
  app.post("/api/v1/contructors/signin", contructorController.createContructor);
  app.patch("/api/v1/contructors/:cid", contructorController.updateContructor);
  app.get("/api/v1/contructors", contructorController.getContructorList);
  app.get(
    "/api/v1/admin/contructors",
    contructorController.getContructorListAdmin
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
