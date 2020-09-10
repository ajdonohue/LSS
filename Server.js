require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const app = express();
const port = 5000;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(pino);




const client = require('twilio') (
  'ACa19ca232635c5a6d3a01693653a7a90e',
  'deb0c3a0ef3e499b44e49b88d84863a1'
)

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.post('/SMS', (req, res) => {
  res.header('Content-Type', 'application/json');
  client.messages
    .create({
      from: '+15872063607',
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
});
   
 
  