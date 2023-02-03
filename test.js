const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

await agenda.cancel({ name: 'cropID' });
await agenda.cancel({ name: 'send monthly billing report' });
await agenda.cancel({ name: 'crop' });
await agenda.cancel({ name: 'cropx' });


agenda.define("nanana", async (job) => {
    console.log("XDHEHEH2")
});

(async function () {
    const job = agenda.create('nanana', {valve:1});
	await agenda.start();
    const start=new Date();
    start.setHours(20,34,0);
    const end=new Date();
    end.setHours(20,38,0);

	await job.repeatEvery("2 minutes", {timezone:'Europe/Warsaw',startDate:start,endDate:end}).save();
})();

