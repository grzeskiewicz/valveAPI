const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("hopla", async (job) => {
    console.log("KURWA")
});

(async function () {
    const job = agenda.create('hopla', {valve:1});
	await agenda.start();


	await job.repeatEvery("12 16 4-10 2 *", {timezone:'Europe/Warsaw'});
    await job.save();
})();

