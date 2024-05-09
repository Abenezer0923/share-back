var cron = require("node-cron");
const axios = require("axios");
const currencyModel = require("../models/currencyModel");

const update_currency_rate = cron.schedule("0 0 */12 * * *", async () => {
  await fetchCurrency();
});

async function fetchCurrency() {
  try {
    const response = await axios.get(
      "https://www.combanketh.et/cbeapi/daily-exchange-rates?_limit=1&_sort=Date%3ADESC"
    );
    console.log(response.data[0].ExchangeRate[0].currency.CurrencyCode);
    console.log(response.data[0].ExchangeRate[1].currency.CurrencyCode);
    console.log(response.data[0].ExchangeRate[0].cashBuying);
    var currency_rate1 = {
      name: "USD",
      value: response.data[0].ExchangeRate[0].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "USD" }, currency_rate1, {
      useFindAndModify: false,
    });
    var currency_rate2 = {
      name: "GBP",
      value: response.data[0].ExchangeRate[1].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "GBP" }, currency_rate2, {
      useFindAndModify: false,
    });
    var currency_rate3 = {
      name: "EUR",
      value: response.data[0].ExchangeRate[2].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "EUR" }, currency_rate3, {
      useFindAndModify: false,
    });
    var currency_rate4 = {
      name: "AED",
      value: response.data[0].ExchangeRate[11].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "AED" }, currency_rate4, {
      useFindAndModify: false,
    });
    var currency_rate5 = {
      name: "SAR",
      value: response.data[0].ExchangeRate[10].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "SAR" }, currency_rate5, {
      useFindAndModify: false,
    });
    var currency_ratec = {
      name: "CAD",
      value: response.data[0].ExchangeRate[9].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "CAD" }, currency_ratec, {
      useFindAndModify: false,
    });
    var currency_rate6 = {
      name: "SEK",
      value: response.data[0].ExchangeRate[4].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "SEK" }, currency_rate6, {
      useFindAndModify: false,
    });
    var currency_rate7 = {
      name: "NOK",
      value: response.data[0].ExchangeRate[5].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "NOK" }, currency_rate7, {
      useFindAndModify: false,
    });
    var currency_rate8 = {
      name: "DKK",
      value: response.data[0].ExchangeRate[6].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "DKK" }, currency_rate8, {
      useFindAndModify: false,
    });
    var currency_rate9 = {
      name: "CNY",
      value: response.data[0].ExchangeRate[18].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "CNY" }, currency_rate9, {
      useFindAndModify: false,
    });
    var currency_rate10 = {
      name: "KWD",
      value: response.data[0].ExchangeRate[19].cashBuying,
    };

    await currencyModel.findOneAndUpdate({ name: "KWD" }, currency_rate10, {
      useFindAndModify: false,
    });
  } catch (error) {
    console.error(error);
  }
}

// fetchCurrency()

module.exports = update_currency_rate;
