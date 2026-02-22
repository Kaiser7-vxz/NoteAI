const fs = require("fs");

function readCareers() {
  return JSON.parse(fs.readFileSync("./data/careers.json", "utf8"));
}

exports.generate = (career) => {
  const careers = readCareers();
  return careers[career] || { stages: [] };
};