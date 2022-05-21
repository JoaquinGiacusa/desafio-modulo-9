import algoliasearch from "algoliasearch";

const client = algoliasearch("9YTG2OFFSP", "e9b753e31e21c487452052140bfc4a9a");
const productsIndex = client.initIndex("products");

export { productsIndex };
