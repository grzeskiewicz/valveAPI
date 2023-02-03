const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("cropx", async (job) => {
    console.log("XDHEHEH")
});

(async function () {
    const job = agenda.create('cropx', {valve:1});
	await agenda.start();
	await job.repeatEvery("2 minutes", {timezone:'Europe/Warsaw',startDate:'2023-02-03 20:08',endDate:'2023-02-03 20:14'}).save();
})();