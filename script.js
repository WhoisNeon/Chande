const apiUrl = 'https://raw.githubusercontent.com/CertMusashi/Chande-api/refs/heads/main/arz.json?' + new Date().getTime();
let userCurrencies = JSON.parse(localStorage.getItem('userCurrencies')) || ["usd", "eur", "18ayar","btc"];

//.

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

function openSettings() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => modal.remove());

    // بخش بالا: دارک مود و دکمه Manage Cards کنار هم
    const topSection = document.createElement('div');
    topSection.classList.add('settings-top');
    topSection.style.display = 'flex';
    topSection.style.justifyContent = 'space-between';
    topSection.style.alignItems = 'center';
    topSection.style.gap = '20px';

    // دارک مود
    const darkModeSection = document.createElement('div');
    darkModeSection.classList.add('settings-section');
    const darkModeLabel = document.createElement('label');
    const darkModeToggle = document.createElement('input');
    darkModeToggle.type = 'checkbox';
    darkModeToggle.checked = document.body.classList.contains('dark-mode');
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', darkModeToggle.checked);
        localStorage.setItem('darkMode', darkModeToggle.checked);
    });
    darkModeLabel.textContent = ' Dark Mode ';
    darkModeLabel.prepend(darkModeToggle);
    darkModeSection.appendChild(darkModeLabel);

    // دکمه Manage Cards
    const cardSection = document.createElement('div');
    cardSection.classList.add('settings-section');
    const cardBtn = document.createElement('button');
    cardBtn.textContent = 'Manage Cards';
    cardBtn.classList.add('card-btn');
    cardBtn.addEventListener('click', () => {
        modal.remove();
        openCurrencySelector();
    });
    cardSection.appendChild(cardBtn);

    // گذاشتن دوتا آیتم کنار هم
    topSection.appendChild(darkModeSection);
    topSection.appendChild(cardSection);

    // بخش تغییر اندازه Grid
    const gridSection = document.createElement('div');
    gridSection.classList.add('settings-section');
    const gridLabel = document.createElement('label');
    gridLabel.textContent = 'Cards Size: ';
    const gridInput = document.createElement('input');
    gridInput.type = 'number';
    gridInput.classList.add('grid-Input');
    gridInput.value = localStorage.getItem('gridSize') || 155;
    gridInput.addEventListener('input', () => {
        const size = gridInput.value || 155;
        document.documentElement.style.setProperty('--grid-size', size + 'px');
        localStorage.setItem('gridSize', size);
    });
    gridLabel.appendChild(gridInput);
    gridSection.appendChild(gridLabel);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(topSection); // دارک مود و دکمه Manage Cards کنار هم
    modalContent.appendChild(gridSection);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// اجرای تنظیمات در لود صفحه
document.addEventListener('DOMContentLoaded', () => {
    // دکمه تنظیمات
    document.getElementById('settings-btn').addEventListener('click', openSettings);

    // دارک مود ذخیره‌شده
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // اندازه grid ذخیره‌شده
    const gridSize = localStorage.getItem('gridSize') || 155;
    document.documentElement.style.setProperty('--grid-size', gridSize + 'px');
});


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
    if (price >= 1000000) {
        return `${(price / 1000000).toLocaleString('en-US', { maximumFractionDigits: 3 })}M`;
    } else if (price >= 1) {
        return price.toLocaleString('en-US');
    } else if (price > 0) {
        return price.toExponential(3); 
    } else {
        return "0";
    }
}

async function updateCurrencyData() {
    const grid = document.getElementById('currency-grid');
    const fragment = document.createDocumentFragment();

    const data = await fetchCurrencyData();
    if (!data) return;

    const dateElement = document.getElementById('datetime');
    dateElement.textContent = `${data.date}`;

    if (!data.currencies) {
        const message = document.createElement('p');
        message.textContent = "Updating, we'll be back soon :)";
        message.style.textAlign = 'center';
        message.style.fontSize = '1.2rem';
        message.style.marginTop = '20px';

        grid.replaceChildren(message);
        return;
    }

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
                changeElement.textContent = `↑ ${priceChange.toLocaleString('en-US')}`;
                changeElement.style.color = '#2ecc71';
            } else if (priceChange < 0) {
                changeElement.textContent = `↓ ${Math.abs(priceChange).toLocaleString('en-US')}`;
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