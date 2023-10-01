import axios from "axios";
import cheerio from "cheerio";
import { extractPrice } from "../utils";

export async function scrapeAmazonProduct(productUrl: string) {
  if (!productUrl) {
    return;
  }

  // BrightData proxy configuration

  //   curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_112d3423-zone-pricewise:35ifuv1g1q2e -k https://lumtest.com/myip.json
  const username = String(process.env.BRIGHTDATA_USERNAME);
  const password = String(process.env.BRIGHTDATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    host: "brd.superproxy.io",
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch the product page
    const response = await axios.get(productUrl, options);
    const $ = cheerio.load(response.data);

    // Extract the product title
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $("a.size.abse.a-color-price"),
      $(".a-button-selected .a-color-base"),
      $(".a-price.a-text-price")
    );

    console.log({ title, currentPrice });
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
