const PUMP_API='192.168.1.11';
const DB_SERVER='192.168.1.3';
const express = require("express"),
  app = express();


const cors = require("cors");
const bodyParser = require("body-parser");
const Gpio = require("orange-pi-gpio");
const axios = require("axios");
const { body, validationResult } = require("express-validator");
const moment = require("moment");
const Agenda = require("agenda");
const agenda = new Agenda({
  db: { address: `mongodb://${DB_SERVER}:27017/valveSchedule` }, //lan address of server
});

agenda.define("wateringschedule", async (job,done) => {
  const data = job.attrs.data;
  await runValveScheduled(data.valve, data.duration, done);
});
agenda.start();



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.options("*", cors()); // include before other routes

function motorON(channel) {
  console.log("ON", channel);
  channel.write(0);
}

function motorOFF(channel, res) {
  axios
    .get(`http://${PUMP_API}/cm?cmnd=Power%20off`)
    .then((response) => {
      console.log("PUMP OFF");
      setTimeout(() => {
        console.log("OFF", channel);
        channel.write(1);
      }, 4000);
      res.json({ success: true, msg: "WATERING COMPLETED" });
    })
    .catch((error) => {
      res.json({
        success: false,
        msg: "CANT POWER OFF PUMP BUT WATERING COMPLETED",
      });
    });
}

function motorOFFScheduled(channel,done) {
  axios
    .get(`http://${PUMP_API}/cm?cmnd=Power%20off`)
    .then((response) => {
      console.log("PUMP OFF");
      setTimeout(() => {
        console.log("OFF", channel);
        channel.write(1);
        done();
      }, 2000);
      console.log("WATERING COMPLETED");
    })
    .catch((error) => {
      console.log("CANT POWER OFF PUMP BUT WATERING COMPLETED");
    });
}

function runValve(req, res) {
  const duration = Number(req.body.duration);
  const valveNumber = Number(req.body.valve);
  let valve;
  console.log(duration,valveNumber);
  switch (valveNumber) {
    case 1:
      valve = new Gpio({ pin: 22, mode: "out" });
      break;
    case 2:
      valve = new Gpio({ pin: 23, mode: "out" });
      break;
    case 3:
      valve = new Gpio({ pin: 24, mode: "out" });
      break;
    case 4:
      valve = new Gpio({ pin: 25, mode: "out" });
      break;
  }
if (valveNumber <= 2) {
  console.log("STARTING WATERING: ", valveNumber);
  axios.get(`http://${PUMP_API}/cm?cmnd=Power%20on`)
    .then((response) => {
      if (response.data.POWER === "ON") {
        console.log("PUMP ON");
        setTimeout(() => {
          motorON(valve);
          setTimeout(() => motorOFF(valve, res), duration * 1000);
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(error);
      res.json({ success: false, msg: "CANT POWER ON PUMP" });
    });
  } else {
    motorON(valve);
    setTimeout(() => motorOFF(valve, res), duration * 1000);
  }
}

function runValveScheduled(valve, duration,done) {
  const valveNumber = Number(valve);
  switch (valveNumber) {
    case 1:
      valve = new Gpio({ pin: 22, mode: "out" });
      break;
    case 2:
      valve = new Gpio({ pin: 23, mode: "out" });
      break;
    case 3:
      valve = new Gpio({ pin: 24, mode: "out" });
      break;
    case 4:
      valve = new Gpio({ pin: 25, mode: "out" });
      break;
  }

  console.log("STARTING WATERING: ", valveNumber);

  axios
    .get(`http://${PUMP_API}/cm?cmnd=Power%20on`)
    .then((response) => {
      if (response.data.POWER === "ON") {
        setTimeout(() => {
          motorON(valve);
          setTimeout(() => motorOFFScheduled(valve,done), duration * 1000);
        }, 2000);
      }
    })
    .catch((error) => {
      console.log("CANT POWER ON PUMP", error);
      /*  res.json({ success: false, msg: "CANT POWER ON PUMP" }); */
    });
}

async function scheduleWatering(req, res) {
  const valve = Number(req.body.valve);
  const crop = Number(req.body.crop);
  const start = moment(req.body.start);
  const stop = moment(req.body.stop);
  const duration = Number(req.body.duration);

  let minute;
  switch (valve) { //testing agenda!!!!!!!!!!! change times later!
    case 1:
      minute = 10;
      break;
    case 2:
      minute = 12;
      break;
    case 3:
      minute = 14;
      break;
    case 4:
      minute = 16;
      break;
  }
  console.log(req.body);
  console.log("SCHEDULING...");

  if (start.month() !== stop.month()) {     //we gotta make 2 cron jobs!
    startJobEnd = start.daysInMonth();
    const job = agenda.create("wateringschedule", {
      valve: valve,
      duration: duration,
      crop: crop
    });
    console.log("XD AGENDA")
    await agenda.start();
    await job.repeatEvery(
      `${minute} 10 ${start.date()}-${startJobEnd} ${start.month() + 1} *`,
      {
        timezone: "Europe/Warsaw",
      }
    );
    await job.repeatEvery(
      `${minute} 10 1-${stop.date()} ${stop.month() + 1} *`,
      {
        timezone: "Europe/Warsaw",
      }
    );
    await job.save();
    console.log("SCHEDULING COMPLETED");
    res.json({ success: true, msg: "WATERING SCHEDULED" });
  } else {
    const job = agenda.create("wateringschedule", {
      valve: valve,
      duration: duration,
      crop: crop,
    });
    await agenda.start();
    const days =
      req.body.start === req.body.stop
        ? start.date()
        : `${start.date()}-${stop.date()}`;
    await job.repeatEvery(`${minute} 10 ${days} ${stop.month() + 1} *`, {
      timezone: "Europe/Warsaw",
    });
    await job.save();
    console.log("SCHEDULING COMPLETED");
    res.json({ success: true, msg: "WATERING SCHEDULED" });
  }
}

async function deleteSchedule(req, res) {
  const crop = Number(req.body.crop);
  console.log(crop);
  const test = await agenda.cancel({ "data.crop": crop });
  res.json({ success: true, msg: "SCHEDULE CANCELED" });
}

app.post("/runvalve", runValve);
app.post("/deleteschedule", deleteSchedule);

app.post("/schedule", scheduleWatering);

app.listen("3051", () => {
  console.log("VALVE API RUNNING");
});

module.exports = app;