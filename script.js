const apiUrl = 'https://btime.mastkhiar.xyz/v2/arz/';
let allCurrencies = [];

// خواندن لیست ارزها از فایل JSON
async function fetchCurrencies() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/CertMusashi/Chand/refs/heads/main/currencies.json');
        allCurrencies = await response.json();
        loadUserCurrencies();
    } catch (error) {
        console.error('خطا در دریافت لیست ارزها:', error);
    }
}

// خواندن ارزهای انتخابی از localStorage
let userCurrencies = [];

function loadUserCurrencies() {
    userCurrencies = JSON.parse(localStorage.getItem('userCurrencies')) || [
        allCurrencies.find(c => c.code === 'USD'),
        allCurrencies.find(c => c.code === 'EUR'),
        allCurrencies.find(c => c.code === 'GRAM')
    ];
    updateCurrencyData();
}

function createCard(currency) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.id = currency.code;

    const currencyInfo = document.createElement('div');
    currencyInfo.classList.add('currency-info');

    const flag = document.createElement('img');
    flag.classList.add('flag');

    const nameAndCode = document.createElement('div');
    nameAndCode.classList.add('name-and-code');

    const name = document.createElement('p');
    name.classList.add('name');
    name.textContent = currency.en;

    const code = document.createElement('p');
    code.classList.add('code');
    code.textContent = currency.code;

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

    allCurrencies.forEach(currency => {
        const currencyItem = document.createElement('div');
        currencyItem.classList.add('currency-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = currency.code;
        checkbox.checked = userCurrencies.some(uc => uc.code === currency.code);
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                userCurrencies.push(currency);
            } else {
                userCurrencies = userCurrencies.filter(uc => uc.code !== currency.code);
            }
            localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
            updateCurrencyData();
        });

        const label = document.createElement('label');
        label.htmlFor = currency.code;
        label.textContent = `${currency.fa} (${currency.code})`;

        currencyItem.appendChild(checkbox);
        currencyItem.appendChild(label);
        modalContent.appendChild(currencyItem);
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

async function fetchCurrencyData(currencyCode) {
    try {
        const response = await fetch(`${apiUrl}${currencyCode}`);
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
    return price >= 10000000
        ? `${(price / 10000000).toLocaleString('en-US', { maximumFractionDigits: 3 })}M`
        : price.toLocaleString('en-US');
}

async function updateCurrencyData() {
    const grid = document.getElementById('currency-grid');
    const fragment = document.createDocumentFragment(); // کاهش reflow

    const cryptoCurrencies = new Set(["Bitcoin", "Ethereum", "Dogecoin", "Binance Coin"]);
    const requests = userCurrencies.map(currency => fetchCurrencyData(currency.code));
    const responses = await Promise.allSettled(requests); // هم‌زمان درخواست‌ها را ارسال کن

    responses.forEach((result, index) => {
        const currency = userCurrencies[index];
        if (result.status === "fulfilled" && result.value) {
            const data = result.value;
            const card = createCard(currency);

            const flag = card.querySelector('.flag');
            const priceElement = card.querySelector('.price');
            const changeElement = card.querySelector('.change');

            flag.src = data.icon;

            let currentPrice = cryptoCurrencies.has(currency.en) ? data.price : data.rialPrice;
            priceElement.textContent = cryptoCurrencies.has(currency.en) ? `$${data.price}` : formatPrice(data.rialPrice);

            const lastSeenPrice = getLastSeenPrice(currency.code) || currentPrice;
            const priceChange = calculatePriceChange(currentPrice, lastSeenPrice);

            if (priceChange > 0) {
                changeElement.textContent = `↑ ${priceChange}`;
                changeElement.style.color = '#2ecc71';
            } else if (priceChange < 0) {
                changeElement.textContent = `↓ ${Math.abs(priceChange)}`;
                changeElement.style.color = '#e74c3c';
            } else {
                changeElement.textContent = '';
            }

            saveLastSeenPrice(currency.code, currentPrice);
            fragment.appendChild(card);
        }
    });

    fragment.appendChild(createAddCard());
    grid.replaceChildren(fragment); // جایگزینی بهتر برای تغییرات DOM
}

function updateDateTime() {
    const datetimeElement = document.getElementById('datetime');
    function tick() {
        const now = new Date();
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', numberingSystem: 'latn' };
        datetimeElement.textContent = now.toLocaleDateString('fa-IR-u-nu-latn', options);
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// دریافت لیست ارزها از JSON و بارگذاری داده‌ها
fetchCurrencies();
updateDateTime();

// به‌روزرسانی داده‌ها هر 5 دقیقه
setInterval(updateCurrencyData, 300000);

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('src/service-worker.js')
            .then(registration => console.log('Service Worker registered:', registration.scope))
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}