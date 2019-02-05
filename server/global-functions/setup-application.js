//Initialize Express app.
const express = require("express");
const app = express();

const CronJob = require('cron').CronJob

//Set how request body's are parsed.
app.bodyParser = require('body-parser')
app.use(app.bodyParser.json())
app.use(app.bodyParser.urlencoded({
  extended: true
}));

app.db = require('../db/createDB')()

//set up cron job to do this every day
// new CronJob('0 8 * * *', () => {
//   app.wordsOfTheDay = require('../wordlist/GenerateWordsOfTheDay')(app.wordlist)
// }, null, true, 'America/Los_Angeles')

//Set Port information
app.set("port", process.env.PORT || 3001);

//Make sure we only serve static assets in production.
// if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
// }

//Set defaults for error handling.
process.on('unhandledRejection', error => {
  // Will print "unhandledRejection err is not defined"
  console.log('unhandledRejection', error);
});

module.exports = app;
