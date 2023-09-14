import axios from "axios";
import cheerio from "cheerio";

interface Item {
  buy_price: number;
  sell_price: number;
  source: string;
}

interface AverageDataType {
  average_buy_price: number;
  average_sell_price: number;
}

async function fetchAndParseData(source: string): Promise<Item | undefined> {
  const response = await axios.get(source,{ timeout: 10000 });
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
  }

  if (!isNaN(buyPrice) || !isNaN(sellPrice)) {
    return {
      buy_price: buyPrice,
      sell_price: sellPrice,
      source: source,
    };
  }
  return ; 
}

export const qoutes = async (): Promise<Item[]> => {
  const sources = [
    "https://www.ambito.com/contenidos/dolar.html",
    "https://www.dolarhoy.com",
    "https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB",
  ];

  const quotes: Item[] = [];
  const promises = sources.map(async (source) => {
    const quote = await fetchAndParseData(source);
    if (quote) {
      quotes.push(quote);
    }
  });

  await Promise.all(promises);

  return quotes;
};

export const average = (results: Item[]) => {
  let sumBuyPrice = 0;
  let sumSellPrice = 0;
  let count = 0;

  results.forEach((item: Item) => {
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

export const slippage = (data: Item[], average: AverageDataType) => {
  const averageBuyPrice = average.average_buy_price;
  const averageSellPrice = average.average_sell_price;
  const slippage = data.map((item: Item) => {
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
