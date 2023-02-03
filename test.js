const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("cropID", async (job) => {
    console.log("CHUJKOOO")
});

(async function () {
    const job = agenda.create('cropID', {valve:1});
	await job.repeatEvery('0 0 20 3-7 3 2023').save();
    await agenda.start();

})();