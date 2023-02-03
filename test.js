const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("cropID3", async (job) => {
    console.log("1231231312")
});

(async function () {
    const job = agenda.create('cropID3', {valve:1});
	await job.repeatEvery('0 1 20 3-7 3 2023').save();
    await agenda.start();

})();