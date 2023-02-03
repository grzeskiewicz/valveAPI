const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("send monthly billing report", async (job) => {
  // some code that aggregates the database and send monthly billing report.
  console.log("CHUJOOOOOOOOOOO")
});

(async function () {
  // IIFE to give access to async/await
  await agenda.start();

  await agenda.every("2 minutes", "send monthly billing report");
})();