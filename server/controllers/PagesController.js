import { Shopify } from "@shopify/shopify-api";

class PagesController {

    //[GET] /pages
    async getAll(req,res) {
        try {
            const session = await Shopify.Utils.loadCurrentSession(req, res);
            const client = new Shopify.Clients.Rest(
              session.shop,
              session.accessToken
            );
            // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
            const products = await client.get({
              path: `pages`,
            });
            res.send(products);
          } catch (error) {
            console.log("error shop server:", error);
          }
    }

    // [GET] /pages/:id
    async getById(req,res) {
        try {
            const session = await Shopify.Utils.loadCurrentSession(req, res);
            const client = new Shopify.Clients.Rest(
              session.shop,
              session.accessToken
            );
            // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
            const products = await client.get({
              path: `pages/${req.params.id}`,
            });
            res.send(products);
          } catch (error) {
            console.log("error shop server:", error);
          }
    }
}

export default new PagesController();