const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("cropID", async (job) => {
    console.log("CHUJKOOO")
});

(async function () {
    const job = agenda.create('cropID', {valve:1});
	await agenda.start();
	await job.repeatEvery("2 minutes", {timezone:'Europe/Warsaw',startDate:'2023-02-03T18:00:00+01:00',endDate:'2023-02-03T19:00:00+01:00'}).save();
})();