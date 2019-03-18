import * as rq from 'request-promise';

const getExchangeRate = async (fromCurrency, toCurrency) => {
  return await rq
    .get({
      uri: `http://apilayer.net/api/live?access_key=cbf4ee44c8116134950139f8a4d6a89b&currencies=${fromCurrency},${toCurrency}&format=1`,
      json: true
    })
    .then(response => {
      return (
        (1 / response.quotes[`${response.source}${fromCurrency}`]) *
        response.quotes[`${response.source}${toCurrency}`]
      );
    })
    .catch(error => {
      throw new Error(
        `Unable to get currency ${fromCurrency} and ${toCurrency}`
      );
    });
};

const getCountries = async currencyCode => {
  return await rq
    .get({
      uri: `https://restcountries.eu/rest/v2/currency/${currencyCode}`,
      json: true
    })
    .then(response => {
      if (Array.isArray(response)) return response.map(country => country.name);
    })
    .catch(error => {
      throw new Error(`Unable to get countries that use ${currencyCode}`);
    });
};

const convert = async (fromCurrency, toCurrency, amount) => {
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const countries = await getCountries(toCurrency);
  const convertedAmount = (amount * exchangeRate).toFixed(2);

  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}.
  You can spend these in the following countries: ${countries}`;
};

convert('PEN', 'COP', 10)
  .then(message => {
    console.log(message);
  })
  .catch(error => {
    console.log(error.message);
  });
