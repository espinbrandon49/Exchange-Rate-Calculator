const exchange1 = document.getElementById("exchange1");
const exchange2 = document.getElementById("exchange2")
const exchangeInput1 = document.getElementById("exchangeInput1")
const exchangeInput2 = document.getElementById("exchangeInput2")
const exchangeRate = document.getElementById("exchange-rate")
const swapBtn = document.getElementById("swap-btn");
let conversion_rate = 1;

// GET request to fetch country codes
function fetchCountryCodes() {
  const requestUrl = "https://open.er-api.com/v6/latest/USD";
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      Object.entries(data.rates).map(entry => {
        let key = entry[0];
        let country = document.createElement("option");
        country.id = key;
        country.innerText = key;
        exchange1.append(country);
      });

      Object.entries(data.rates).map(entry => {
        let key = entry[0];
        let country = document.createElement("option");
        country.id = key;
        country.innerText = key;
        exchange2.append(country);
      });
    });
};
fetchCountryCodes();

// GET request to fetch conversion rate between 2 currencies
function pairConversion(countryCodes) {
  let base_code = countryCodes[0]; target_code = countryCodes[1];
  const requestUrl = `https://open.er-api.com/v6/latest/${base_code}`;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      selectCodes(base_code, target_code);

      Array.from(exchange2)
        .filter(e => {
          if (e.selected == true) {
            Object.entries(data.rates).map(entry => {
              if (e.id == entry[0]) e.value = entry[1];
            });
            conversion_rate = e.value;
          }
        });

      exchangeRate.innerHTML = `1 ${base_code} = ${conversion_rate} ${target_code}`;

      updateValues();
    });
}

function getCountryCodes() {
  let base_codeOption = Array.from(exchange1).filter(e => e.selected == true)
  let target_codeOption = Array.from(exchange2).filter(e => e.selected == true)
  return [base_codeOption[0].id, target_codeOption[0].id]
}

function selectCodes(base, target) {
  let base_codeOption = Array.from(exchange1).filter(e => e.id == base)
  let target_codeOption = Array.from(exchange2).filter(e => e.id == target)
  base_codeOption[0].selected = true;
  target_codeOption[0].selected = true;
}

function swap() {
  const countryCodes = getCountryCodes();
  let base_code = countryCodes[1]; target_code = countryCodes[0];
  return [base_code, target_code];
}

function updateValues() {
  exchangeInput2.value = (exchangeInput1.value * conversion_rate).toFixed(2);
}

exchange1.addEventListener("click", () => pairConversion(getCountryCodes()));
exchange2.addEventListener("click", () => pairConversion(getCountryCodes()));
swapBtn.addEventListener("click", () => pairConversion(swap()));
exchangeInput1.addEventListener("change", updateValues);



