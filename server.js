const express = require('express');
const fs = require('fs');
const pdf = require('pdf-parse');


const PORT = process.env.PORT || 3010;
const app = express();

// pdf-parse package code here

// API
    // app.???('/api/submit', (req, res) => {
    //   let results = driverInfo;
    //   if (req.query) {
    //     results = filterByQuery(req.query, results);
    //   }
    //   res.json(results);
    // });


// Start the server
app.listen(PORT, () => {
  console.log(`Server now listening on port ${PORT}!`);
});
