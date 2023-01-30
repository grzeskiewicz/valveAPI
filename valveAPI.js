const Gpio=require('orange-pi-gpio');
const firstValve=new Gpio({pin:22,mode:'out'});
const secondValve=new Gpio({pin:23,mode:'out'});
const thirdValve=new Gpio({pin:24,mode:'out'});
const fourthValve=new Gpio({pin:25,mode:'out'});

function motorON(channel){
console.log('ON',channel)
channel.write(0);
}

function motorOFF(channel){
console.log('OFF',channel)
channel.write(1);
}

console.log("STARTING ALL PUMPS: ")

motorON(firstValve);
setTimeout(()=>motorOFF(firstValve),20000);

motorON(secondValve);
setTimeout(()=>motorOFF(secondValve),15000);

motorON(thirdValve);
setTimeout(()=>motorOFF(thirdValve),10000);

motorON(fourthValve);
setTimeout(()=>motorOFF(fourthValve),5000);

