const fs = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

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
  const newCrawler = crawlerDb.doc(id);
  await newCrawler
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

module.exports = { addCrawler, updateCrawler, deleteCrawler, getCrawler };
