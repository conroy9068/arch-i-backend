const moment = require("moment");
const { Connection } = require("pg");
const start = moment("2022-09-29").add(6, "days").format("YYYY-MM-DD");

console.log(start.toString());
for (let i = 0; i < 10; i++) {
  if (i === 5) {
    i = 4;
  }
  console.log(i);
}
