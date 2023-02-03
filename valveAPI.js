const express = require('express'),
    app = express();
    const http = require('http');
    const querystring = require('querystring');
const cors = require('cors');
const bodyParser = require('body-parser');
const Gpio=require('orange-pi-gpio');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
/*
const firstValve=new Gpio({pin:22,mode:'out'});
const secondValve=new Gpio({pin:23,mode:'out'});
const thirdValve=new Gpio({pin:24,mode:'out'});
const fourthValve=new Gpio({pin:25,mode:'out'});*/

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies 
app.options('*', cors()) // include before other routes





function motorON(channel){
    console.log('ON',channel)
    channel.write(0);
    }
    
    function motorOFF(channel){
        console.log('OFF',channel)
        channel.write(1);
        axios.get('http://192.168.1.29:80/cm?cmnd=Power%20off')
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
      }

function runValve(req, res){
const valveNumber=Number(req.body.valve);
let valve;
switch (valveNumber){
 case 1: 
    valve=new Gpio({pin:22,mode:'out'});
    break;
 case 2: 
     valve=new Gpio({pin:23,mode:'out'});
     break;
 case 3:
    valve=new Gpio({pin:24,mode:'out'});
    break;
 case 4: 
    valve=new Gpio({pin:25,mode:'out'});
    break;
}

console.log("STARTING WATERING: ", valveNumber);


axios.get('http://192.168.1.29:80/cm?cmnd=Power%20on')
  .then(response => {
    console.log(response);
    motorON(valve);
    setTimeout(()=>motorOFF(valve),10000);   
  })
  .catch(error => {
    console.log(error);
  });


/*
motorON(thirdValve);
setTimeout(()=>motorOFF(thirdValve),10000);

motorON(fourthValve);
setTimeout(()=>motorOFF(fourthValve),5000);*/
}


app.post('/runvalve',runValve);


app.listen('3051', () => {console.log('NODEJS RUNNING')})
//http.listen(port);
//console.log('Server running on http://%s:%s', ip,port);
module.exports = app;