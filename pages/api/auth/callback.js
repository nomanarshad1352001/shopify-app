import { Shopify } from "@shopify/shopify-api"

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET, SCOPES, HOST } = process.env

export default async function handler(req, res) {
  try {
    const session = await Shopify.Auth.validateAuthCallback(req, res, req.query)
    // session.accessToken contains store access token
    console.log("Access token:", session.accessToken)

    // Redirect to app inside iframe
    const redirectUrl = `/?shop=${session.shop}&host=${req.query.host}`
    res.redirect(redirectUrl)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}
