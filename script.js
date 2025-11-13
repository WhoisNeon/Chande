const apiUrl = 'https://raw.githubusercontent.com/CertMusashi/Chande-api/refs/heads/main/arz.json?' + new Date().getTime();
let userCurrencies = JSON.parse(localStorage.getItem('userCurrencies')) || ["usd", "eur", "18ayar", "btc"];

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

    card.addEventListener('click', () => openPriceModal(currency, card.querySelector('.change').textContent, card.querySelector('.change').classList.contains('positive')));

    return card;
}

function openCurrencySelector() {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'currency-selector');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '<i class="ph ph-x"></i>';
    closeButton.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const leftColumn = document.createElement('div');
    leftColumn.classList.add('modal-column', 'modal-section');

    const rightColumn = document.createElement('div');
    rightColumn.classList.add('modal-column', 'modal-section');

    const leftTitle = document.createElement('h3');
    leftTitle.classList.add('modal-title');
    leftTitle.innerHTML = '<i class="ph ph-list"></i> Available Currencies';
    const leftSearchBox = document.createElement('input');
    leftSearchBox.type = 'text';
    leftSearchBox.placeholder = 'Search';
    leftSearchBox.classList.add('currency-search-box');
    leftSearchBox.addEventListener('input', renderLists);

    const rightTitle = document.createElement('h3');
    rightTitle.classList.add('modal-title', 'modal-title-right');
    rightTitle.innerHTML = '<i class="ph ph-list-checks"></i> Selected Currencies';
    const rightSearchBox = document.createElement('input');
    rightSearchBox.type = 'text';
    rightSearchBox.placeholder = 'Search';
    rightSearchBox.classList.add('currency-search-box');
    rightSearchBox.addEventListener('input', renderLists);

    const leftList = document.createElement('div');
    leftList.classList.add('currency-list');

    const rightList = document.createElement('div');
    rightList.classList.add('currency-list');

    leftColumn.appendChild(leftTitle);
    leftColumn.appendChild(leftSearchBox);
    leftColumn.appendChild(leftList);
    rightColumn.appendChild(rightTitle);
    rightColumn.appendChild(rightSearchBox);
    rightColumn.appendChild(rightList);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(leftColumn);
    modalContent.appendChild(rightColumn);

            let allCurrencies = [];

            function isTouchDevice() {
                return ('ontouchstart' in window) ||
                    (navigator.maxTouchPoints > 0) ||
                    (navigator.msMaxTouchPoints > 0);
            }

            function renderLists() {
                leftList.innerHTML = '';
                rightList.innerHTML = '';

                const leftSearchTerm = leftSearchBox.value.toLowerCase();
                const rightSearchTerm = rightSearchBox.value.toLowerCase();

                const selectedCurrencies = userCurrencies
                    .map(code => allCurrencies.find(c => c.code === code))
                    .filter(c => c && (c.en.toLowerCase().includes(rightSearchTerm) || c.code.toLowerCase().includes(rightSearchTerm)));

                const availableCurrencies = allCurrencies.filter(c => !userCurrencies.includes(c.code) &&
                    (c.en.toLowerCase().includes(leftSearchTerm) || c.code.toLowerCase().includes(leftSearchTerm)));

                if (availableCurrencies.length === 0) {
                    const message = document.createElement('p');
                    message.classList.add('no-currencies-message');
                    message.textContent = leftSearchTerm ? "No matching currencies found." : "All currencies selected.";
                    leftList.appendChild(message);
                } else {
                    availableCurrencies.forEach(currency => {
                        const item = createCurrencyItem(currency, 'add', null, null, renderLists);
                        leftList.appendChild(item);
                    });
                }

                if (selectedCurrencies.length === 0) {
                    const message = document.createElement('p');
                    message.classList.add('no-currencies-message');
                    message.textContent = rightSearchTerm ? "No matching currencies found." : "No currencies selected.";
                    rightList.appendChild(message);
                } else {
                    selectedCurrencies.forEach((currency, index) => {
                        const item = createCurrencyItem(currency, 'remove', index, selectedCurrencies.length, renderLists);
                        rightList.appendChild(item);
                    });
                }
            }

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    allCurrencies = data.currencies;
                    renderLists();

                    if (!isTouchDevice()) {
                        new Sortable(leftList, {
                            group: 'currencies',
                            animation: 150,
                            sort: false,
                        });

                        new Sortable(rightList, {
                            group: 'currencies',
                            animation: 150,
                            onAdd: function (evt) {
                                const code = evt.item.dataset.code;
                                userCurrencies.splice(evt.newIndex, 0, code);
                                localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
                                updateCurrencyData();
                                renderLists();
                            },
                            onRemove: function (evt) {
                                const code = evt.item.dataset.code;
                                userCurrencies = userCurrencies.filter(c => c !== code);
                                localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
                                updateCurrencyData();
                                renderLists();
                            },
                            onUpdate: function (evt) {
                                const code = evt.item.dataset.code;
                                const oldIndex = evt.oldIndex;
                                const newIndex = evt.newIndex;

                                const [removed] = userCurrencies.splice(oldIndex, 1);
                                userCurrencies.splice(newIndex, 0, removed);

                                localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
                                updateCurrencyData();
                                renderLists();
                            }
                        });
                    }
                });

            modal.appendChild(modalContent);
            document.body.appendChild(modal);
        }

        function createCurrencyItem(currency, type, index, totalSelected, renderLists) {
            const item = document.createElement('div');
            item.classList.add('currency-item');
            item.dataset.code = currency.code;
            if (type === 'add') {
                item.addEventListener('click', () => {
                    userCurrencies.push(currency.code);
                    localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
                    updateCurrencyData();
                    renderLists();
                });
            }

    const flag = document.createElement('img');
    flag.classList.add('flag');
    flag.src = currency.icon;

    const label = document.createElement('label');
    label.textContent = `${currency.en} (${currency.code.toUpperCase()})`;

    const currencyInfo = document.createElement('div');
    currencyInfo.classList.add('currency-info-item');

    currencyInfo.appendChild(flag);
    currencyInfo.appendChild(label);
    item.appendChild(currencyInfo);

    const controls = document.createElement('div');
    controls.classList.add('controls');

    if (type === 'add') {
        const addButton = document.createElement('button');
        addButton.innerHTML = '<i class="ph ph-arrow-right"></i>';
        addButton.classList.add('reorder-btn');
        controls.appendChild(addButton);
    } else {
        if (index > 0) {
            const upButton = document.createElement('button');
            upButton.innerHTML = '<i class="ph ph-arrow-up"></i>';
            upButton.classList.add('reorder-btn');
            upButton.addEventListener('click', (e) => {
                e.stopPropagation();
                [userCurrencies[index], userCurrencies[index - 1]] = [userCurrencies[index - 1], userCurrencies[index]];
                localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
                updateCurrencyData();
                renderLists();
            });
            controls.appendChild(upButton);
        }

        if (index < totalSelected - 1) {
            const downButton = document.createElement('button');
            downButton.innerHTML = '<i class="ph ph-arrow-down"></i>';
            downButton.classList.add('reorder-btn');
            downButton.addEventListener('click', (e) => {
                e.stopPropagation();
                [userCurrencies[index], userCurrencies[index + 1]] = [userCurrencies[index + 1], userCurrencies[index]];
                localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
                updateCurrencyData();
                renderLists();
            });
            controls.appendChild(downButton);
        }

        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="ph ph-trash"></i>';
        removeButton.classList.add('reorder-btn', 'remove-btn');
        removeButton.addEventListener('click', () => {
            userCurrencies = userCurrencies.filter(code => code !== currency.code);
            localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
            updateCurrencyData();
            renderLists();
        });
        controls.appendChild(removeButton);
    }

    item.appendChild(controls);
    return item;
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    updateThemeToggleButton();
}

function updateThemeToggleButton() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggleButton.innerHTML = isDarkMode ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('settings-btn').addEventListener('click', openCurrencySelector);

    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggleButton();
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
        message.classList.add('no-currencies-message');
        message.textContent = "Updating, we'll be back soon :)";

        grid.replaceChildren(message);
        return;
    }

    const requests = userCurrencies.map(code => data.currencies.find(c => c.code === code));

    if (requests.length === 0) {
        const message = document.createElement('p');
        message.classList.add('no-currencies-message');
        message.textContent = "No currencies selected. Go to settings to add some.";
        grid.replaceChildren(message);
        return;
    }

    requests.forEach(currency => {
        if (currency) {
            const card = createCard(currency);

            const priceElement = card.querySelector('.price');
            const changeElement = card.querySelector('.change');

            let currentPrice = currency.price;

            const lastSeenPrice = getLastSeenPrice(currency.code);

            const priceChange = Math.floor(calculatePriceChange(currentPrice, lastSeenPrice));

            if (priceChange > 0) {
                changeElement.textContent = `↑ ${priceChange.toLocaleString('en-US')}`;
                changeElement.classList.add('positive');
            } else if (priceChange < 0) {
                changeElement.textContent = `↓ ${Math.abs(priceChange).toLocaleString('en-US')}`;
            } else {
                changeElement.textContent = '';
            }

            saveLastSeenPrice(currency.code, currentPrice);

            priceElement.textContent = formatPrice(currentPrice);

            fragment.appendChild(card);
        }
    });

    grid.replaceChildren(fragment);
}

updateCurrencyData();

function openPriceModal(currency, changeText, isPositive) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'price-modal');

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.innerHTML = '<i class="ph ph-x"></i>';
    closeButton.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    const icon = document.createElement('img');
    icon.src = currency.icon;

    const name = document.createElement('h2');
    name.textContent = currency.en;

    const code = document.createElement('p');
    code.classList.add('code');
    code.textContent = currency.code.toUpperCase();

    const change = document.createElement('p');
    change.classList.add('change');
    change.textContent = changeText;
    if (isPositive) {
        change.classList.add('positive');
    }

    const priceContainer = document.createElement('div');
    priceContainer.id = 'price-container';

    const price = document.createElement('p');
    price.textContent = formatPrice(currency.price);
    price.id = 'modal-currency-price';

    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-btn');
    copyButton.innerHTML = '<i class="ph ph-copy"></i>';
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(currency.price.toString());
            copyButton.innerHTML = '<i class="ph ph-check"></i>';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="ph ph-copy"></i>';
            }, 1500);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    });

    priceContainer.appendChild(price);
    priceContainer.appendChild(copyButton);

    modalContent.appendChild(closeButton);
    modalContent.appendChild(icon);
    modalContent.appendChild(name);
    modalContent.appendChild(code);
    modalContent.appendChild(change);
    modalContent.appendChild(priceContainer);

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('src/service-worker.js')
            .then(registration => console.log('Service Worker registered:', registration.scope))
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}
