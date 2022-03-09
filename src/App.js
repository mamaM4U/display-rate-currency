import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currencies, setCurrencies] = useState([]);

  const countBuyRate = (exchangeRate) => parseFloat(exchangeRate) + (exchangeRate * 5 / 100)

  const countSellRate = (exchangeRate) => parseFloat(exchangeRate) - (exchangeRate * 5 / 100)

  const formatDecimal = (decimalnNumber) => decimalnNumber.toFixed(4);

  const formatCurrencies = (rawCurrencies) => {
    const targetCurrencies = ['CAD', 'EUR', 'IDR', 'JPY', 'CHF', 'GBP']

    const rawCurrencyKeys = Object.keys(rawCurrencies).filter((key) => targetCurrencies.includes(key))

    const formattedCurrencies = rawCurrencyKeys.map((key) => {
      const formattedCurrency = {}
      formattedCurrency.currencyName = key
      formattedCurrency.exchangeRate = parseFloat(rawCurrencies[key])
      formattedCurrency.buyRate = countBuyRate(formattedCurrency.exchangeRate)
      formattedCurrency.sellRate = countSellRate(formattedCurrency.exchangeRate)
      return formattedCurrency
    })

    return formattedCurrencies
  }


  useEffect(() => {
    setIsLoading(true)
    fetch(
      'https://api.currencyfreaks.com/latest?apikey=6186b29285e54035a2a810873e92d7fd'
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data.rates)
        setCurrencies(formatCurrencies(data.rates))
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false))
  }, [])


  return (
    <div className="App">
      {isLoading ? (<h1>Sedang Loading...</h1>) :
        (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>We Buy</th>
                  <th>Exchange Rate</th>
                  <th>We Sell</th>

                </tr>
              </thead>
              <tbody>
                {currencies.map((currency) => {
                  return <tr key={currency.currencyName}>
                    <td>{currency.currencyName}</td>
                    <td>{formatDecimal(currency.buyRate)}</td>
                    <td>{formatDecimal(currency.exchangeRate)}</td>
                    <td>{formatDecimal(currency.sellRate)}</td>
                  </tr>
                })}
              </tbody>
            </table>
            <p>
              Rates are based from 1 USD. <br></br>
              This application uses API from https://api.currencyfreaks.com
            </p>
          </div>
        )
      }
    </div>
  );
}

export default App;
