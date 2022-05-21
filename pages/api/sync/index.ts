import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

//para mantener actualizazdo lo que esta en airtable con algolia
export default methods({
  get(req: NextApiRequest, res: NextApiResponse) {
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
          //console.log("sigiente pagina");
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          } else {
            res.send("finish sync");
          }
        }
      );
  },
});
