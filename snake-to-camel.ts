const util = require("util");
/**
 * Dives into an array searching children
 * @param a the origin array
 */
function _dive(a: Array<unknown>) {
  return a.map((item) =>
    Array.isArray(item)
      ? _dive(item)
      : typeof item === "object"
      ? snakeToCamel(item)
      : item
  );
}

function snakeToCamel<T>(snaked: Object | Array<unknown>): T {
  let camel: any = {};

  if (Array.isArray(snaked)) return _dive(snaked);

  for (let [key, item] of Object.entries(snaked)) {
    let value = item;

    if (typeof item === "object") value = snakeToCamel(item);

    const parts = key.split("_");
    if (parts.length > 1) {
      let parsedKey = parts.shift() ?? "";
      parts.forEach((part) => {
        part = part.toLowerCase();
        parsedKey += part.charAt(0).toUpperCase() + part.substr(1, part.length);
      });
      camel[parsedKey] = value;
    } else camel[key] = value;
  }
  return camel as T;
}

const snakeCaseObj = [
  "name",
  {
    prop_snaked: [
      "prop snaked",
      {
        prop_1_snaked: 1,
        prop_2_snaked: 2,
      },
    ],
  },
];

console.log(util.inspect(snakeToCamel(snakeCaseObj), false, null, true));
