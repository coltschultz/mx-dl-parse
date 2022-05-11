const express = require("express");
const fs = require("fs");
const pdf = require("pdf-parse");
const formidable = require("formidable");
const path = require("path");
var http = require("http");

const PORT = process.env.PORT || 3011;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Front End
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
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



http
  .createServer(function (req, res) {
    if (req.url == "/fileupload") {

      // Get the Data
      function getEntirePage(file) {
        let dataBuffer = fs.readFileSync(file);
      
        pdf(dataBuffer).then(function (data) {
          var string = data.text;
          var curp = string.search(/CURP:/);
          var licenseFirst = string.search(/Número de Licencia:/);
          var marker = string.search(/DIGITAL DE CONDUCTOR/) + 18;
          var fecha = string.search(/Fecha y hora/);
          var nameIndex = marker + 1;
          var nameLast = fecha;
          var licenseIndex = licenseFirst + 19;
          var licenseLast = curp;
          var antig = string.search(/Antigüedad:/);
          var dateIndex = antig + 11;
          var lastCharacter = dateIndex + 11;
          var name = string.substring(nameIndex, nameLast);
          var license = string.substring(licenseIndex, licenseLast);
          var date = string.substring(dateIndex, lastCharacter);
          var dd = date.substring(1, 3);
          var mm = date.substring(4, 6);
          var yyyy = date.substring(7, 11);
          const issueDate = mm + "/" + dd + "/" + yyyy;
          const d = new Date().toLocaleDateString();
          const date1 = new Date(issueDate);
          const date2 = new Date(d);
          const diffTime = Math.abs(date2 - date1);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const diffYears = Math.ceil(diffDays / 365);
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(`Name: ${name}`);
          res.write("<br>");
          res.write(`License Number: ${license}`);
          res.write("<br>");
          res.write(`Date Issued: ${issueDate}`);
          res.write("<br>");
          res.write(`Experience Shown: ${diffYears} years`);
        });
      }
      
        var form = new formidable.IncomingForm();

        form.parse(req, function (err, fields, files) {
          var oldpath = files.filetoupload.filepath;
          newpath = files.filetoupload.originalFilename;
          globalpath = newpath.toString();
          
          fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            res.end();
          });
          getEntirePage(newpath);
          fs.unlink(newpath);
        });
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(
        '<form action="fileupload" method="post" enctype="multipart/form-data">'
      );
      res.write('<input type="file" name="filetoupload"><br>');
      res.write('<input type="submit">');
      res.write("</form>");
      return res.end();
    }
  })
  .listen(PORT);
