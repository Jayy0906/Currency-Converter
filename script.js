const API_URL = "https://api.exchangerate-api.com/v4/latest/";

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const resultBox = document.getElementById("result-box");
const convertedAmount = document.getElementById("converted-amount");
const swapBtn = document.getElementById("swap-btn");
const currencyForm = document.getElementById("currency-form");

async function fetchCurrencies() {
  try {
    const response = await fetch(`${API_URL}USD`);
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    populateCurrencyDropdowns(Object.keys(data.rates));
  } catch (error) {
    alert("Error fetching currency data: " + error.message);
  }
}

function populateCurrencyDropdowns(currencies) {
  currencies.forEach((currency) => {
    const option = new Option(currency, currency);
    fromCurrency.add(option.cloneNode(true));
    toCurrency.add(option.cloneNode(true));
  });
  fromCurrency.value = "USD";
  toCurrency.value = "INR";
}

async function convertCurrency(event) {
  event.preventDefault();

  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}${from}`);
    if (!response.ok) throw new Error("Failed to fetch data");

    const data = await response.json();
    const rate = data.rates[to];

    if (!rate) {
      alert("Conversion rate not available for selected currencies.");
      return;
    }

    const converted = (amount * rate).toFixed(2);

    convertedAmount.textContent = `${amount} ${from} = ${converted} ${to}`;
    resultBox.style.display = "block";
  } catch (error) {
    alert("Error during conversion: " + error.message);
  }
}

function swapCurrencies() {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
}

swapBtn.addEventListener("click", swapCurrencies);
currencyForm.addEventListener("submit", convertCurrency);

fetchCurrencies();
