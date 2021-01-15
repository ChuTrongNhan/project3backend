const cheerio = require("cheerio");
const axios = require("axios");

const fetchHTML = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch {
    console.error(
      `ERROR: An error occurred while trying to fetch the URL: ${url}`
    );
  }
};

const crawl = async (crawler) => {
  const html = await fetchHTML(crawler.url);
  const $ = cheerio.load(html);
  return $(crawler.selector)
    .toArray()
    .map((x) => {
      let result = {};
      for (extract of crawler.extract) {
        result[extract.name] =
          extract.extract.type === "text"
            ? $(x).find(extract.selector).text()
            : JSON.stringify(
                $(x)
                  .find(extract.selector)
                  .attr(extract.extract.attr || "")
              );
      }
      return result;
    });
};

module.exports.crawl = crawl;
