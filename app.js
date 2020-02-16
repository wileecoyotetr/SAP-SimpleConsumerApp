const path = require('path'),
    express = require('express'),
    cfenv = require('cfenv'),
    appEnv = cfenv.getAppEnv();

var app = express();

app.use('/', express.static(path.join(__dirname, 'webapp')));

//which helps us to parse the payload of incoming request
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// new endpoint named /send and assign a callback function, which is invoked whenever a request is sent to this endpoint
const aHistory = [];
const sDefaultMessage = 'Hello Cloud Platform';
app.post('/send', function (oReq, oRes) {
  var oMessage = {
message: oReq.body.msg || sDefaultMessage
  }
  oRes.sendStatus(201);
  console.log(`Received message "${oMessage.message}" via HTTP`);
  aHistory.push(oMessage);
});

//a new endpoint named /outbox and assign a callback function
app.get('/outbox', function(oReq, oRes) {
    oRes.send(aHistory);
});

const iPort = appEnv.isLocal ? 3000: appEnv.port;
app.listen(iPort, function () {
    console.log(`Congrats, your producer app is listening on port ${iPort}!`);
});