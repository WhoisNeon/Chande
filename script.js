const apiUrl = 'https://raw.githubusercontent.com/CertMusashi/Chand-api/refs/heads/main/arz.json?' + new Date().getTime();
let userCurrencies = JSON.parse(localStorage.getItem('userCurrencies')) || ["usd", "eur", "18ayar"];

function createCard(currency) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = currency.code;

    const currencyInfo = document.createElement('div');
    currencyInfo.classList.add('currency-info');

    const flag = document.createElement('img');
    flag.classList.add('flag');
    flag.src = currency.icon;

    const nameAndCode = document.createElement('div');
    nameAndCode.classList.add('name-and-code');

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = currency.en;

    const code = document.createElement('p');
    code.classList.add('code');
    code.textContent = currency.code.toUpperCase();

    nameAndCode.appendChild(name);
    nameAndCode.appendChild(code);
    currencyInfo.appendChild(flag);
    currencyInfo.appendChild(nameAndCode);

    const priceInfo = document.createElement('div');
    priceInfo.classList.add('price-info');

    const change = document.createElement('p');
    change.classList.add('change');

    const price = document.createElement('p');
    price.classList.add('price');

    priceInfo.appendChild(change);
    priceInfo.appendChild(price);
    card.appendChild(currencyInfo);
    card.appendChild(priceInfo);

    return card;
}

function openCurrencySelector() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const title = document.createElement('h2');
    title.textContent = 'Currencies';

    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.currencies.forEach(currency => {
                const currencyItem = document.createElement('div');
                currencyItem.classList.add('currency-item');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = currency.code;
                checkbox.checked = userCurrencies.includes(currency.code);
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        userCurrencies.push(currency.code);
                    } else {
                        userCurrencies = userCurrencies.filter(code => code !== currency.code);
                    }
                    localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
                    updateCurrencyData();
                });

                const label = document.createElement('label');
                label.htmlFor = currency.code;
                label.textContent = `${currency.name} (${currency.code})`;

                currencyItem.appendChild(checkbox);
                currencyItem.appendChild(label);
                modalContent.appendChild(currencyItem);
            });
        });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function createAddCard() {
    const addCard = document.createElement('div');
    addCard.classList.add('card', 'add-card');
    addCard.textContent = '+';
    addCard.addEventListener('click', openCurrencySelector);
    return addCard;
}

async function fetchCurrencyData() {
    try {
        const response = await fetch(apiUrl);
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function calculatePriceChange(currentPrice, previousPrice) {
    return previousPrice ? (currentPrice - previousPrice).toFixed(2) : 0;
}

function saveLastSeenPrice(currencyCode, price) {
    localStorage.setItem(`lastSeenPrice_${currencyCode}`, price);
}

function getLastSeenPrice(currencyCode) {
    return parseFloat(localStorage.getItem(`lastSeenPrice_${currencyCode}`)) || 0;
}

function formatPrice(price) {
    return price >= 1000000 ? `${(price / 1000000).toLocaleString('en-US', { maximumFractionDigits: 3 })}M` : price.toLocaleString('en-US');
}

async function updateCurrencyData() {
    const grid = document.getElementById('currency-grid');
    const fragment = document.createDocumentFragment();

    const data = await fetchCurrencyData();
    if (!data) return;

    const dateElement = document.getElementById('datetime');
    dateElement.textContent = `${data.date}`;

    const requests = userCurrencies.map(code => data.currencies.find(c => c.code === code));
    
    requests.forEach(currency => {
        if (currency) {
            const card = createCard(currency);

            const priceElement = card.querySelector('.price');
            const changeElement = card.querySelector('.change');

            let currentPrice = currency.price;

            // دریافت قیمت قبلی از localStorage (خام)
            const lastSeenPrice = getLastSeenPrice(currency.code);

            // محاسبه تغییرات قیمت
            const priceChange = Math.floor(calculatePriceChange(currentPrice, lastSeenPrice));

            // نمایش تغییرات قیمت
            if (priceChange > 0) {
                changeElement.textContent = `↑ ${priceChange}`;
                changeElement.style.color = '#2ecc71';
            } else if (priceChange < 0) {
                changeElement.textContent = `↓ ${Math.abs(priceChange)}`;
                changeElement.style.color = '#e74c3c';
            } else {
                changeElement.textContent = '';
            }

            // ذخیره قیمت جدید در localStorage به صورت خام
            saveLastSeenPrice(currency.code, currentPrice);

            // نمایش قیمت با فرمت
            priceElement.textContent = formatPrice(currentPrice);

            fragment.appendChild(card);
        }
    });

    fragment.appendChild(createAddCard());
    grid.replaceChildren(fragment);
}

// دریافت داده‌ها هنگام لود صفحه
updateCurrencyData();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('src/service-worker.js')
            .then(registration => console.log('Service Worker registered:', registration.scope))
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}
