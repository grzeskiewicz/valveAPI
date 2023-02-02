var scheduler = require('nodejs-persistable-scheduler');

initialTask = function() {
  var AM = new Date();
  AM.setHours(0,10,0);
  scheduler.registerTask("daily",AM,'METHOD1',null,null).then(function(ID) {
    if (ID)
    {
console.log("KURWA",ID)   
 }
  },function(err) {
console.log(err);
  });
};

var schedulerConfig = {
  initFunc: initialTask, 
  scanInterval: 24*60*60*1000//scan interval time, in MS
};

var initialConfig = {
  db:
  {
    host: 'localhost',
    user: 'ben',
    password: 'JaPierdole1!',
    database:'scheduler',
    port: 3306
  },//DB config
  methods:methodArr,
  scheduler:schedulerConfig
};

scheduler.initialize(initialConfig);