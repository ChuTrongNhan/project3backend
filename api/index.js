const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const jsonParser = bodyParser.json();

const port = 8000;
const data = require("../data");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app
  .route("/crawler")
  .get(async (req, res) => {
    const response = await data.getCrawler(req.query.id);
    if (response.status === 200) res.status(200).json(response.data);
    else res.status(404).send("Cannot get data");
  })
  .post(jsonParser, async (req, res) => {
    const response = await data.addCrawler(req.body);
    if (response.status === 200) res.status(200).json(response.data);
  });

app.route("/updatecrawler").post(jsonParser, async (req, res) => {
  await data.updateCrawler(req.body.id, req.body.crawler);
  res.sendStatus(200);
});

app.route("/deletecrawler").post(jsonParser, async (req, res) => {
  await data.deleteCrawler(req.body.id);
  res.sendStatus(200);
});

app.route("/crawl").post(jsonParser, async (req, res) => {
  const response = await data.addResult(req.body.id);
  res.sendStatus(response.status);
});

app.route("/export").post(jsonParser, async (req, res) => {
  const response = await data.exportsheet(req.body.title, req.body.id);
  res.status(200).json(response.data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
