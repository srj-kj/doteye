import mongoose from "mongoose";
import axios from "axios";
import cheerio from "cheerio";

export const qoutes = async () => {
  const sources = [
    "https://www.ambito.com/contenidos/dolar.html",
    "https://www.dolarhoy.com",
    "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB",
  ];

  const quotes: any[] = [];

  for (const source of sources) {
    const response = await axios.get(source);
    const html = response.data;
    const $ = cheerio.load(html);

    let buyPrice = 0;
    let sellPrice = 0;

    if (source === "https://www.ambito.com/contenidos/dolar.html") {
      const newUrl = $(
        'a[title="ámbito.com | Cotización del Dólar Blue | Ámbito"]'
      ).attr("href");

      if (!newUrl) {
        throw new Error("Link to the new URL not found.");
      }

      const newResponse = await axios.get(newUrl);
      const newHtml = newResponse.data;

      const $new = cheerio.load(newHtml);

      const pricesContainer = $new(".variation-max-min__values-wrapper");

      const compraElement = pricesContainer.find(
        ".variation-max-min__value.data-compra"
      );
      const ventaElement = pricesContainer.find(
        ".variation-max-min__value.data-venta"
      );

      const rawBuyPrice = compraElement.text().trim();
      const rawSellPrice = ventaElement.text().trim();

      buyPrice = parseFloat(
        rawBuyPrice.replace(/[^0-9.]/g, "").replace(",", ".")
      );
      sellPrice = parseFloat(
        rawSellPrice.replace(/[^0-9.]/g, "").replace(",", ".")
      );

      // Check if prices are valid numbers
      // if (isNaN(buyPrice) || isNaN(sellPrice)) {
      //   throw new Error("Prices could not be parsed.");
      // }
    } else if (source === "https://www.dolarhoy.com") {
      const dolarBlueContainer = $(
        '.tile.is-child.only-mobile a.title:contains("Dólar blue")'
      ).closest(".tile.is-child.only-mobile");
      const compraElement = dolarBlueContainer.find(".compra .val");
      const ventaElement = dolarBlueContainer.find(".venta .val");

      const rawBuyPrice = compraElement.text().trim();
      const rawSellPrice = ventaElement.text().trim();

      buyPrice = parseFloat(
        rawBuyPrice.replace(/[^0-9.]/g, "").replace(",", ".")
      );
      sellPrice = parseFloat(
        rawSellPrice.replace(/[^0-9.]/g, "").replace(",", ".")
      );

      if (isNaN(buyPrice) || isNaN(sellPrice)) {
        const err = { message: "Prices could not be parsed.", statusCode: 400 };
        throw err;
      }
    } else if (
      source === "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB"
    ) {
      const buyValueElement = $(".buy-value");
      const sellValueElement = $(".sell-value");

      const rawBuyValue = buyValueElement.text().trim();
      const rawSellValue = sellValueElement.text().trim();

      buyPrice = parseFloat(
        rawBuyValue.replace(/[^0-9,]/g, "").replace(",", ".")
      );
      sellPrice = parseFloat(
        rawSellValue.replace(/[^0-9,]/g, "").replace(",", ".")
      );
      if (isNaN(buyPrice) || isNaN(sellPrice)) {
        const err = { message: "Prices could not be parsed.", statusCode: 400 };
        throw err;
      }
    }

    quotes.push({
      buy_price: buyPrice,
      sell_price: sellPrice,
      source: source,
    });
  }

  return quotes;
};

export const average = async (results: any) => {
  let sumBuyPrice = 0;
  let sumSellPrice = 0;
  let count = 0;

  await results.forEach((item: any) => {
    if (item.buy_price > 0 && item.sell_price > 0) {
      sumBuyPrice += item.buy_price;
      sumSellPrice += item.sell_price;
      count++;
    }
  });

  const averageBuyPrice = count > 0 ? sumBuyPrice / count : 0;
  const averageSellPrice = count > 0 ? sumSellPrice / count : 0;

  const data = {
    average_buy_price: averageBuyPrice,
    average_sell_price: averageSellPrice,
  };
  return data;
};

export const slippage = (data: any, avaerage: any) => {
  const averageBuyPrice = avaerage.average_buy_price;
  const averageSellPrice = avaerage.average_sell_price;
  const slippage = data.map((item: any) => {
    const buy_price_slippage =
      item.buy_price > 0
        ? ((item.buy_price - averageBuyPrice) / averageBuyPrice) * 100
        : 0;
    const sell_price_slippage =
      item.sell_price > 0
        ? ((item.sell_price - averageSellPrice) / averageSellPrice) * 100
        : 0;

    return {
      buy_price_slippage: parseFloat(buy_price_slippage.toFixed(2)),
      sell_price_slippage: parseFloat(sell_price_slippage.toFixed(2)),
      source: item.source,
    };
  });

  return slippage;
};
