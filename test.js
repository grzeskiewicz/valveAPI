const Agenda = require("agenda");
const agenda = new Agenda({ db: { address: "mongodb://51.83.131.118:27020/valveSchedule" } });

agenda.define("cropID", async (job) => {
    console.log("1231231312")
});

(async function () {
    const job = agenda.create('cropID323', {valve:1});
	await job.repeatEvery('0 0 20 3-7 3 2023').save();
    await agenda.start();

})();