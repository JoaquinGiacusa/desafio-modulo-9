import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFromReq } from "lib/requests";
import { airtableBase } from "lib/airtable";

export async function searchProducts(limit, offset, query) {
  const { finalLimit, finalOffset } = getOffsetAndLimitFromReq(limit, offset);

  try {
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
  } catch (error) {
    return error;
  }
}

export async function getProductById(productId) {
  try {
    const prod = await productsIndex.getObject(productId);
    if (prod) {
      return prod;
    }
  } catch {
    return { message: "el producto no existe" };
  }
}

export async function syncProducts() {
  airtableBase("Furniture")
    //trae 10 por pagina en cada pasada hasta terminar desde airtable
    .select({ pageSize: 10 })
    .eachPage(
      async function page(records, fetchNextPage) {
        //los record que recibo vienen de airtable de la BD
        // y lo hago un map para devovler un array de esos objetos filtrados
        const objects = records.map((r) => {
          return {
            objectID: r.id,
            ...r.fields,
          };
        });

        //despues agrego esos objetos a algolia(tiene la "S" el saveOvjects)
        await productsIndex.saveObjects(objects);

        //como vienen de a diez items nomas por pagina por el pageSize,
        //esta funcion hace que se ejecute todod e nuevo hasta terminar con todos los items
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  return "finish sync";
}
