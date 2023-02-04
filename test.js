const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("hoplaxd", async (job) => {
    console.log("KURWAMAĆ")
});

(async function () {
    const job = agenda.create('hoplaxd', {valve:1});
	await agenda.start();


	await job.repeatEvery("13 16 4-10 2 *", {timezone:'Europe/Warsaw'});
    await job.save();
})();

