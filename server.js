const express = require('express');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const formidable = require('formidable');
const path = require('path');
var http = require('http');


const PORT = process.env.PORT || 3010;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// pdf-parse package code here

function getEntirePage(file) {
  let dataBuffer = fs.readFileSync(file);
  
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

// getEntirePage();

// Front End
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


// API
    // app.???('/api/submit', (req, res) => {
    //   let results = driverInfo;
    //   if (req.query) {
    //     results = filterByQuery(req.query, results);
    //   }
    //   res.json(results);
    // });


// Start the server
// app.listen(PORT, () => {
//   console.log(`Server now listening on port ${PORT}!`);
// });


http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.filepath;

      var myPath = files.filetoupload.filepath + '\\' + files.filetoupload.originalFilename;
      let regex = /\/\//g;
      var path = myPath.replace(regex, "/");
      getEntirePage(path);
      // var newpath = 'C:/' + files.filetoupload.originalFilename;
      // fs.rename(oldpath, newpath, function (err) {
      //   if (err) throw err;
      //   res.write('File uploaded and moved!');
      //   res.end();
      // });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(PORT);