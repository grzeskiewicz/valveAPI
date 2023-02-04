const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

await agenda.cancel({ name: 'cropID' });
await agenda.cancel({ name: 'send monthly billing report' });
await agenda.cancel({ name: 'crop' });
await agenda.cancel({ name: 'cropx' });


agenda.define("tester", async (job) => {
    console.log("lolo")
});

(async function () {
    const job = agenda.create('tester', {valve:1});
	await agenda.start();


	await job.repeatEvery("2 minutes", {timezone:'Europe/Warsaw',startDate:'04.02.2023 14:02',endDate:'04.02.2023 14:06'}).save();
})();

