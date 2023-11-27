// imports
const express = require('express');
const routes = require("./routes");
const db = require('./config/connection');

// set up express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3001;

// direct traffic along these routes
app.use(routes);

// once db is opened up, express starts listening
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}!`);
  });
});
