const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("crop", async (job) => {
    console.log("CHUJKOOO")
});

(async function () {
    const job = agenda.create('crop', {valve:1});
	await agenda.start();
	await job.repeatEvery("2 minutes", {timezone:'Europe/Warsaw',startDate:'2023-02-03 20:03',endDate:'2023-02-03 20:09'}).save();
})();