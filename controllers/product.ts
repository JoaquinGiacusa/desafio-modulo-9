import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFromReq } from "lib/requests";

export async function searchProducts(limit, offset, query) {
  const { finalLimit, finalOffset } = getOffsetAndLimitFromReq(limit, offset);

  const results = await productsIndex.search(query, {
    offset: finalOffset,
    length: finalLimit,
  });

  if (results)
    return {
      results: results.hits,
      pagination: {
        offset: finalOffset,
        limit: finalLimit,
        total: results.nbHits,
      },
    };
}

export async function getProductById(productId) {
  const prod = await productsIndex.getObject(productId);
  if (prod) {
    return prod;
  }
}
