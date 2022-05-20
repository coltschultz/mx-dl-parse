const express = require("express");
const fs = require("fs");
const pdf = require("pdf-parse");
const formidable = require("formidable");
const path = require("path");
const https = require("https");
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

// @TODO - add formidable 
app.post("/fileurl", async (req, res) => {
  return new Promise((resolve) => {
    const file = fs.createWriteStream("files/newLicense.pdf");
    const request = https.get(
      "https://southernstarmga.com/sample.pdf",
      function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
          resolve(request.response);
          file.close();
          console.log("Download Complete");
        });
      }
    );
  }).then(async (results) => {
    async function getEntirePage(file) {
      let dataBuffer = fs.readFileSync(file);

      return await pdf(dataBuffer).then((data) => parser.parsePdf(data));
    }

    pdfData = await getEntirePage("files/newLicense.pdf");
    await writeLicenseDetails(pdfData, req, res);
    return res.end();
  });
});

// API Route to get file from URL
app.post("/api/fileurl", async (req, res) => {
  return new Promise((resolve) => {
    const URL = req.params.URL;
    const file = fs.createWriteStream("files/newLicense.pdf");
    const request = https.get(
      "https://southernstarmga.com/sample.pdf",
      function (response) {
        response.pipe(file);

        // after download completed close filestream
        file.on("finish", () => {
          resolve(request.response);
          file.close();
          console.log("Download Complete");
        });
      }
    );
  }).then(async (results) => {
    async function getEntirePage(file) {
      let dataBuffer = fs.readFileSync(file);

      return await pdf(dataBuffer).then((data) => parser.parsePdf(data));
    }

    pdfData = await getEntirePage("files/newLicense.pdf");
    await writeLicenseDetails(pdfData, req, res);
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

app.listen(PORT);
