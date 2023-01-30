const express = require('express'),
    app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const Gpio=require('orange-pi-gpio');
const { body, validationResult } = require('express-validator');

const firstValve=new Gpio({pin:22,mode:'out'});
const secondValve=new Gpio({pin:23,mode:'out'});
const thirdValve=new Gpio({pin:24,mode:'out'});
const fourthValve=new Gpio({pin:25,mode:'out'});

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
    }

function runValve(req, res){
const valveNumber=req.body.valve;
let valve;
switch (valveNumber){
 case 1: 
    valve=firstValve;
 case 2: 
 valve=secondValve;
 case 3:
    valve=thirdValve;
    case 4: valve=fourthValve;
}
//const startLight=req.body.startLight;
//const harvest=req.body.harvest;
console.log("STARTING WATERING: ", valveNumber);

motorON(valve);
setTimeout(()=>motorOFF(valve,5000));


/*
motorON(thirdValve);
setTimeout(()=>motorOFF(thirdValve),10000);

motorON(fourthValve);
setTimeout(()=>motorOFF(fourthValve),5000);*/
}

/*
app.post('/addmicrogreens', [
    body('nameEN').isString().withMessage("Not a string!").isLength({max:60}).withMessage("Too long value!"),
    body('gramsTray').isInt().withMessage("Not integer!"),
    body('topWater').isInt({max:1000}).withMessage("Not integer or too high value!"),
],db.addMicrogreens);
 */


app.post('/runvalve',runValve);


app.listen('3051', () => {console.log('NODEJS RUNNING')})
//http.listen(port);
//console.log('Server running on http://%s:%s', ip,port);
module.exports = app;