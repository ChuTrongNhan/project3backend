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

const crawl = async () => {
  const URL = "https://pokemondb.net/pokedex/game/diamond-pearl";
  const html = await fetchHTML(URL);
  const $ = cheerio.load(html);
  return $(
    "#main > div.infocard-list.infocard-list-pkmn-lg > div > span.infocard-lg-data.text-muted > a"
  )
    .toArray()
    .map((x) => {
      return $(x).text();
    });
};

module.exports.crawl = crawl;

// const treeToStr = () => {
//   let str = "";
//   selectorTree.forEach((selector) => {
//     str = selector.tag || "";
//     if (selector.attr) {
//       str +=
//         (selector.attrType === "id"
//           ? "#"
//           : selector.attrType === "class"
//           ? ""
//           : ":nth-child(") +
//         (selector.attrType === "id"
//           ? selector.attr.id
//           : selector.attrType === "class"
//           ? selector.attr.class.split(" ").join(".")
//           : selector.attr.nthChild + ")");
//     }
//     str += " > ";
//   });
//   return str.slice(0, str.length - 3);
// };
