export default async function handler(req, res) {
  const { shop, accessToken } = req.body // Pass these from server-side session

  const response = await fetch(
    `https://${shop}/admin/api/2026-04/products.json`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  )

  const data = await response.json()
  res.status(200).json(data)
}
``