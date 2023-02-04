const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("hopla", async (job) => {
    console.log("KURWA")
});

(async function () {
    const job = agenda.create('hopla', {valve:1});
	await agenda.start();
    const start=new Date();
    start.setHours(14,25);
    const end=new Date();
    end.setHours(14,28);

	await job.repeatEvery("2 minutes", {timezone:'Europe/Warsaw',startDate:start,endDate:end});
    await job.save();
})();

