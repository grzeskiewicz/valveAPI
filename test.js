const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("hoplaxd", async (job) => {
    console.log(job)
});

(async function () {
    const job = agenda.create('hoplaxd', {valve:1});
	await agenda.start();


	await job.repeatEvery("*/2 16 4-10 2 *", {timezone:'Europe/Warsaw'});
    await job.save();
})();

