const express = require("express");
const fs = require("fs");
const pdf = require("pdf-parse");
const formidable = require("formidable");
const path = require("path");
const http = require("http");
const logger = require("pino")({ level: "debug" });

const parser = require("./parser");

const PORT = process.env.PORT || 3011;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  logger.debug({ method: req.method, url: req.url });
  return next();
});

// Front End
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./public/index.html"));
// });

app.post("/fileupload", async (req, res) => {
  logger.debug("got file upload");
  async function getEntirePage(file) {
    let dataBuffer = fs.readFileSync(file);

    return await pdf(dataBuffer).then((data) => parser.parsePdf(data));
  }

  const form = new formidable.IncomingForm();

  return form.parse(req, async (err, fields, files) => {
    for (file in files) {
      pdfData = await getEntirePage(files[file].filepath);
      await writeLicenseDetails(pdfData, req, res);
    }

    return res.end();
  });
});

function writeLicenseDetails(data, req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(`Name: ${data.name}`);
  res.write("<br>");
  res.write(`License Number: ${data.license}`);
  res.write("<br>");
  res.write(`Date Issued: ${data.issueDate}`);
  res.write("<br>");
  res.write(`Experience Shown: ${data.diffYears} years`);
}

// @TODO remove
function renderUploadForm(req, res) {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write(
    '<form action="fileupload" method="post" enctype="multipart/form-data">'
  );
  res.write('<input type="file" name="filetoupload"><br>');
  res.write('<input type="submit">');
  res.write("</form>");
  return res.end();
}

app.listen(PORT);
