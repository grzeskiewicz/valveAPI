const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("tester", async (job) => {
    console.log("lolo")
});

(async function () {
    const job = agenda.create('tester', {valve:1});
	//await agenda.start();

	await job.repeatEvery("2 minutes", {timezone:'Europe/Warsaw',startDate:'04.02.2023 14:13',endDate:'04.02.2023 14:17'});
    await job.save()
})();

