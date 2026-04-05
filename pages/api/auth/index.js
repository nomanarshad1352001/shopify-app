import { Shopify } from "@shopify/shopify-api"

const { HOST } = process.env

export default async function handler(req, res) {
  const { shop } = req.query
  if (!shop) return res.status(400).send("Missing shop query parameter")

  const redirectUri = `${HOST}/api/auth/callback`
  const installUrl = await Shopify.Auth.beginAuth(
    req,
    res,
    shop,
    redirectUri,
    false // online token
  )

  return res.redirect(installUrl)
}
