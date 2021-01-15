const fs = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

const crawlCtrl = require("../api/controller/crawlCtrl");
const googlesheet = require("../api/googlesheet");

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});

const db = fs.firestore();
const crawlerDb = db.collection("crawlers");

const addCrawler = async (crawler) => {
  const response = { status: 400, err: "", data: {} };
  await crawlerDb
    .add(crawler)
    .then((result) => {
      response.status = 200;
      response.data = { id: result.id, ...crawler };
    })
    .catch((err) => {
      response.err = err;
    });
  return response;
};

const updateCrawler = async (id, crawler) => {
  const response = { status: 400, err: "", data: {} };
  const newCrawler = crawlerDb.doc(id);
  await newCrawler
    .update(crawler)
    .then((result) => {
      response.status = 200;
      response.data = result;
    })
    .catch((err) => {
      response.err = err;
    });
  return response;
};

const deleteCrawler = async (id) => {
  const response = { status: 400, err: "" };
  const crawler = crawlerDb.doc(id);
  const resultCrawler = crawler.collection("result").docs;
  if (resultCrawler)
    await resultCrawler.forEach((resultDoc) => {
      resultDoc.delete();
    });
  await crawler
    .delete()
    .then(() => {
      response.status = 200;
    })
    .catch((err) => {
      response.err = err;
    });
  return response;
};

const getCrawler = async (id) => {
  const response = { status: 404, data: {} };
  if (id) {
    const crawlerRef = crawlerDb.doc(id);
    await crawlerRef.get().then((doc) => {
      if (doc.exists) {
        response.status = 200;
        response.data = { id: id, ...doc.data() };
      }
    });
  } else {
    await crawlerDb.get().then((snapshot) => {
      response.status = 200;
      response.data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    });
  }
  return response;
};

const addResult = async (id) => {
  //Get crawler data
  const res = await getCrawler(id);
  if (res.status !== 200) return { status: 400 };
  //Start crawling
  const newResultRef = crawlerDb.doc(id).collection("result");
  const result = await crawlCtrl.crawl(res.data);
  result.forEach((value, index) => {
    newResultRef.doc(index.toString()).set(value);
  });
  return { status: 200 };
};

const getResult = async (id) => {
  const response = { status: 404, data: {} };
  const resultRef = crawlerDb.doc(id).collection("result");
  await resultRef.get().then((snapshot) => {
    response.status = 200;
    response.data = snapshot.docs.map((doc) => doc.data());
  });
  return response;
};

const exportsheet = async (title, id) => {
  const response = await getResult(id);
  if (response.status !== 200) return response;
  const headTable = Object.keys(response.data[0]);
  const bodyTable = response.data.map((rowObj, index) => [
    index,
    ...headTable.map((field) => rowObj[field]),
  ]);
  const sheetId = await googlesheet.write(title, [
    ["No.", ...headTable],
    ...bodyTable,
  ]);
  return { status: 200, data: sheetId };
};

module.exports = {
  addCrawler,
  updateCrawler,
  deleteCrawler,
  getCrawler,
  addResult,
  getResult,
  exportsheet,
};
