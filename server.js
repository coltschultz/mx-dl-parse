const express = require('express');
const fs = require('fs');
const pdf = require('pdf-parse');


const PORT = process.env.PORT || 3010;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// pdf-parse package code here

function getEntirePage() {
  let dataBuffer = fs.readFileSync('sample-pdf.pdf');
  
  pdf(dataBuffer).then(function(data) {
  
      // number of pages
      console.log(data.numpages);
      // number of rendered pages
      console.log(data.numrender);
      // PDF info
      console.log(data.info);
      // PDF metadata
      console.log(data.metadata); 
      // PDF.js version
      // check https://mozilla.github.io/pdf.js/getting_started/
      console.log(data.version);
      // PDF text
      console.log(data.text); 

      console.log('=========================COLT======================');
      function getIssueDate() {
        var string = data.text;
        antig = string.search(/Antigüedad:/);
        dateIndex = (antig + 11);
        lastCharacter = (dateIndex + 11)
        date = string.substring(dateIndex, lastCharacter);
        console.log(antig);
        console.log(dateIndex);
        console.log(lastCharacter);
        console.log(date);
        
      }
      getIssueDate();
          
  });
}

getEntirePage();


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
