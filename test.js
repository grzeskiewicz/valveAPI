var scheduler = require('nodejs-persistable-scheduler');
var q = require('q');
var methodArr = [];
/***************************
 ***************************
  DONT CHANGE THE ORDER of mehtodArr!!!!
  JUST PUSH THE NEW ADDED ONES AT THE TAIL!!!
  **************************
  **************************/
method1 = function(param) {
  var defer = Q.defer();
  //functional codes for method1...
  console.log("JESTEM TU")
  return defer.promise;
};

methodArr.push({name:'METHOD1',method1});

method2 = function(param) {
  var defer = Q.defer();
  //functional codes for method2...
  return defer.promise;
};
methodArr.push({name:'METHOD2',method2});

initialTask = function() {
  var defer = Q.defer();
  var AM = new Date();
  AM.setHours(0,33,0);
  scheduler.registerTask("daily",AM,'METHOD1',null,null).then(function(ID) {
    if (ID)
    {
      defer.resolve(true);
    }
  },function(err) {
    defer.reject(err);
  });
  return defer.promise;
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