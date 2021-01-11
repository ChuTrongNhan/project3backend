const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const jsonParser = bodyParser.json();

const port = 8000;

const crawlCtrl = require("./controller/crawlCtrl");
const dataCrawler = require("../data/crawler");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.route("/crawl").get(async (req, res) => {
  const data = await crawlCtrl.crawl();
  res.json(data);
});

app
  .route("/crawler")
  .get(async (req, res) => {
    const response = await dataCrawler.getCrawler(req.query.id);
    if (response.status === 200) res.status(200).json(response.data);
    else res.status(404).send("Cannot get data");
  })
  .post(jsonParser, async (req, res) => {
    const response = await dataCrawler.addCrawler(req.body);
    if (response.status === 200) res.status(200).json(response.data);
  });

app.route("/updatecrawler").post(jsonParser, async (req, res) => {
  await dataCrawler.updateCrawler(req.body.id, req.body.crawler);
  res.sendStatus(200);
});

app.route("/deletecrawler").post(jsonParser, async (req, res) => {
  await dataCrawler.deleteCrawler(req.body.id);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
