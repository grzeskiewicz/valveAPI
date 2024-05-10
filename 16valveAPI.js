const PUMP_API = "192.168.2.11";
const DB_SERVER = "192.168.2.3";
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

agenda.define("wateringschedule", async (job, done) => {
  const data = job.attrs.data;
  await runValveScheduled(data.valve, data.duration, data.cropData, done);
});
agenda.start();
/*
const firstValve=new Gpio({pin:22,mode:'out'});
const secondValve=new Gpio({pin:23,mode:'out'});
const thirdValve=new Gpio({pin:24,mode:'out'});
const fourthValve=new Gpio({pin:25,mode:'out'});*/

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

function motorOFFScheduled(channel, done) {
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
  console.log(duration, valveNumber);
  switch (valveNumber) {
    //OUT
    case 9:
      valve = new Gpio({ pin: 13, mode: "out" });
      break;
    case 10:
      valve = new Gpio({ pin: 15, mode: "out" });
      break;
    case 11:
      valve = new Gpio({ pin: 16, mode: "out" });
      break;
    case 12:
      valve = new Gpio({ pin: 18, mode: "out" });
      break;
    case 13:
      valve = new Gpio({ pin: 21, mode: "out" });
      break;
    case 14:
      valve = new Gpio({ pin: 24, mode: "out" });
      break;
    case 15:
      valve = new Gpio({ pin: 26, mode: "out" });
      break;
    case 16:
      valve = new Gpio({ pin: 27, mode: "out" });
      break;
    /*========================================================*/
    //IN PMP
    case 1:
      valve = new Gpio({ pin: 25, mode: "out" });
      break;
    case 2:
      valve = new Gpio({ pin: 23, mode: "out" });
      break;
    case 3:
      valve = new Gpio({ pin: 22, mode: "out" });
      break;
    case 4:
      valve = new Gpio({ pin: 20, mode: "out" });
      break;
    case 5:
      valve = new Gpio({ pin: 12, mode: "out" });
      break;
    case 6:
      valve = new Gpio({ pin: 11, mode: "out" });
      break;
    case 7:
      valve = new Gpio({ pin: 7, mode: "out" });
      break;
    case 8:
      valve = new Gpio({ pin: 5, mode: "out" });
      break;
  }
  if (valveNumber > 8) {
    console.log("STARTING WATERING: ", valveNumber);
    axios
      .get(`http://${PUMP_API}/cm?cmnd=Power%20on`)
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

function runValveScheduled(valve, duration, cropData, done) {
  const valveNumber = Number(valve);
  //console.log(cropData);
  switch (valveNumber) {
    //OUT
    case 9:
      valve = new Gpio({ pin: 13, mode: "out" });
      break;
    case 10:
      valve = new Gpio({ pin: 15, mode: "out" });
      break;
    case 11:
      valve = new Gpio({ pin: 16, mode: "out" });
      break;
    case 12:
      valve = new Gpio({ pin: 18, mode: "out" });
      break;
    case 13:
      valve = new Gpio({ pin: 21, mode: "out" });
      break;
    case 14:
      valve = new Gpio({ pin: 24, mode: "out" });
      break;
    case 15:
      valve = new Gpio({ pin: 26, mode: "out" });
      break;
    case 16:
      valve = new Gpio({ pin: 27, mode: "out" });
      break;
    /*========================================================*/
    //IN PMP
    case 1:
      valve = new Gpio({ pin: 25, mode: "out" });
      break;
    case 2:
      valve = new Gpio({ pin: 23, mode: "out" });
      break;
    case 3:
      valve = new Gpio({ pin: 22, mode: "out" });
      break;
    case 4:
      valve = new Gpio({ pin: 20, mode: "out" });
      break;
    case 5:
      valve = new Gpio({ pin: 12, mode: "out" });
      break;
    case 6:
      valve = new Gpio({ pin: 11, mode: "out" });
      break;
    case 7:
      valve = new Gpio({ pin: 7, mode: "out" });
      break;
    case 8:
      valve = new Gpio({ pin: 5, mode: "out" });
      break;
  }

  console.log("STARTING WATERING: ", valveNumber);
  if (valveNumber > 8) {
    axios
      .get(`http://${PUMP_API}/cm?cmnd=Power%20on`)
      .then((response) => {
        if (response.data.POWER === "ON") {
          setTimeout(() => {
            motorON(valve);
            setTimeout(() => motorOFFScheduled(valve, done), duration * 1000);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log("CANT POWER ON PUMP", error);
        /*  res.json({ success: false, msg: "CANT POWER ON PUMP" }); */
      });
  } else {
    motorON(valve);
    setTimeout(() => motorOFF(valve, res), duration * 1000);
  }
}

async function scheduleWatering(req, res) {
  const schedule = req.body.schedule
  console.log("SCHEDULING...");
  for (const dayGrp of schedule) {
    for (const fnd of dayGrp) {
      if (fnd !== undefined && fnd!==null) {
        const valve = fnd[0].fndtray_id;
        const cropData = fnd[0].cropData;
        let minute, duration;
        switch (valve) {
          case 1:
            minute = 4;
            duration = 60;
            break;
          case 2:
            minute = 6;
            duration = 60;
            break;
          case 3:
            minute = 8;
            duration = 50;
            break;
          case 4:
            minute = 10;
            duration = 50;
            break;
          case 5:
            minute = 12;
            duration = 40;
            break;
          case 6:
            minute = 14;
            duration = 40;
            break;
          case 7:
            minute = 16;
            duration = 30;
            break;
          case 8:
            minute = 18;
            duration = 30;
            break;
        }

        const date = moment(fnd[0].date).set({ hour: 10, minute: minute });
        console.log(date,moment())
        if (date.isAfter(moment())){ //zabezpieczenie przed odpalaniem przeszłych tasków
          const job = agenda.create("wateringschedule", {
            valve: valve,
            duration: duration,
            cropData: cropData,
          });
  
  console.log('xD')
          await agenda.start();
          await job.schedule(date, { timezone: "Europe/Warsaw", });
          await job.save();
        }


      }
    }
  }
  console.log("SCHEDULING COMPLETED");
  res.json({ success: true, msg: "WATERING SCHEDULED" });

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
