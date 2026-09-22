const fiatGoldApiUrl = 'https://api.x4d1udxvyt.workers.dev/bonbast';
const cryptoApiUrl = 'https://api.bitpin.org/api/v1/mkt/tickers/';

const DEFAULT_CURRENCIES = ["usd", "eur", "18ayar", "usdt", "btc"];

// Reads the stored selection defensively: older versions could persist corrupted
// entries (nulls, duplicates), which made reordering move the wrong items.
function loadStoredSelection() {
    let stored = null;
    try {
        stored = JSON.parse(localStorage.getItem('userCurrencies'));
    } catch (error) {
        stored = null;
    }
    if (!Array.isArray(stored)) return [...DEFAULT_CURRENCIES];

    const cleaned = [...new Set(stored.filter(code => typeof code === 'string' && code.length > 0))];
    if (cleaned.length > 0) return cleaned;

    // An intentionally emptied selection stays empty; anything else falls back to defaults.
    return stored.length === 0 ? [] : [...DEFAULT_CURRENCIES];
}

let userCurrencies = loadStoredSelection();
let currencyMeta = {};

function saveUserCurrencies() {
    localStorage.setItem('userCurrencies', JSON.stringify(userCurrencies));
}

// Swaps two codes in the selection and returns a new array (null when a code is unknown).
function swapSelectionCodes(selection, codeA, codeB) {
    const indexA = selection.indexOf(codeA);
    const indexB = selection.indexOf(codeB);
    if (indexA === -1 || indexB === -1 || indexA === indexB) return null;

    const next = [...selection];
    [next[indexA], next[indexB]] = [next[indexB], next[indexA]];
    return next;
}

// Rebuilds the selection so its visible entries match the order of the items currently
// rendered in the selected list. Entries hidden by an active search (or missing from the
// fetched currency data) keep their place, so drag & drop stays correct when filtered.
function alignSelectionToDom(selection, domCodes, excludeCode) {
    const visibleCodes = domCodes.filter(code => code !== excludeCode);
    const visibleSet = new Set(visibleCodes);

    const aligned = [];
    let next = 0;
    for (const code of selection) {
        if (visibleSet.has(code)) {
            aligned.push(next < visibleCodes.length ? visibleCodes[next++] : code);
        } else {
            aligned.push(code);
        }
    }
    while (next < visibleCodes.length) aligned.push(visibleCodes[next++]);
    return aligned;
}

// Currency codes of the items (not status messages) currently rendered in a list.
function getDomCodes(container) {
    return Array.from(container.children)
        .map(child => child.dataset && child.dataset.code)
        .filter(Boolean);
}

async function loadCurrencyMeta() {
    const response = await fetch('src/currency-meta.json');
    currencyMeta = await response.json();
}




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
    leftTitle.classList.add('modal-title', 'modal-title-left');
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

    const footer = document.createElement('div');
    footer.classList.add('modal-footer');
    footer.innerHTML = 'Made with <i class="ph-duotone ph-heart"></i> by <a href="https://github.com/WhoisNeon" target="_blank">WhoisNeon</a>';
    modalContent.appendChild(footer);

    let allCurrencies = [];

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
                const item = createCurrencyItem(currency, 'add', null, renderLists);
                leftList.appendChild(item);
            });
        }

        if (selectedCurrencies.length === 0) {
            const message = document.createElement('p');
            message.classList.add('no-currencies-message');
            message.textContent = rightSearchTerm ? "No matching currencies found." : "No currencies selected.";
            rightList.appendChild(message);
        } else {
            const visibleCodes = selectedCurrencies.map(c => c.code);
            selectedCurrencies.forEach(currency => {
                const item = createCurrencyItem(currency, 'remove', visibleCodes, renderLists);
                rightList.appendChild(item);
            });
        }
    }

    // Persists the current selection and refreshes the modal lists and the grid.
    // The re-render is deferred so Sortable can finish its own DOM work first;
    // otherwise wiping innerHTML mid-drop detaches nodes Sortable is still using.
    function commitSelectionChange(excludeCode) {
        userCurrencies = alignSelectionToDom(userCurrencies, getDomCodes(rightList), excludeCode);
        saveUserCurrencies();
        updateCurrencyData();
        setTimeout(renderLists, 0);
    }

    fetchCurrencyData().then(data => {
            if (!data) return;
            allCurrencies = data.currencies;
            renderLists();

            const sharedOptions = {
                group: { name: 'currencies', pull: true, put: true },
                animation: 150,
                handle: '.drag-handle',
                // Drag & drop works on touch devices too, but a short delay keeps
                // scrolling the lists usable alongside dragging.
                delay: 150,
                delayOnTouchOnly: true,
                touchStartThreshold: 10,
            };

            new Sortable(leftList, { ...sharedOptions, sort: false });

            new Sortable(rightList, {
                ...sharedOptions,
                onAdd: function (evt) {
                    const code = evt.item && evt.item.dataset ? evt.item.dataset.code : '';
                    if (!code) return;
                    if (!userCurrencies.includes(code)) {
                        userCurrencies = [...userCurrencies, code];
                    }
                    commitSelectionChange();
                },
                onRemove: function (evt) {
                    const code = evt.item && evt.item.dataset ? evt.item.dataset.code : '';
                    if (!code) return;
                    userCurrencies = userCurrencies.filter(c => c !== code);
                    commitSelectionChange(code);
                },
                onUpdate: function () {
                    commitSelectionChange();
                },
            });
        });

    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function createCurrencyItem(currency, type, visibleCodes, renderLists) {
    const item = document.createElement('div');
    item.classList.add('currency-item');
    item.dataset.code = currency.code;
    if (type === 'add') {
        item.addEventListener('click', () => {
            userCurrencies.push(currency.code);
            saveUserCurrencies();
            updateCurrencyData();
            renderLists();
        });
    }

    const dragHandle = document.createElement('span');
    dragHandle.classList.add('drag-handle');
    dragHandle.innerHTML = '<i class="ph ph-dots-six-vertical"></i>';

    const flag = document.createElement('img');
    flag.classList.add('flag');
    flag.src = currency.icon;

    const label = document.createElement('label');
    label.textContent = `${currency.en} (${currency.code.toUpperCase()})`;

    const currencyInfo = document.createElement('div');
    currencyInfo.classList.add('currency-info-item');

    currencyInfo.appendChild(dragHandle);
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
        // Move by currency codes, never by list indexes: the visible list can be
        // filtered by search or missing entries, so indexes no longer line up
        // with `userCurrencies` and index-based swaps moved the wrong item.
        const codes = Array.isArray(visibleCodes) ? visibleCodes : [currency.code];
        const index = codes.indexOf(currency.code);

        const move = (neighborCode) => {
            const swapped = swapSelectionCodes(userCurrencies, currency.code, neighborCode);
            if (!swapped) return;
            userCurrencies = swapped;
            saveUserCurrencies();
            updateCurrencyData();
            renderLists();
        };

        if (index > 0) {
            const upButton = document.createElement('button');
            upButton.innerHTML = '<i class="ph ph-arrow-up"></i>';
            upButton.classList.add('reorder-btn');
            upButton.addEventListener('click', (e) => {
                e.stopPropagation();
                move(codes[index - 1]);
            });
            controls.appendChild(upButton);
        }

        if (index > -1 && index < codes.length - 1) {
            const downButton = document.createElement('button');
            downButton.innerHTML = '<i class="ph ph-arrow-down"></i>';
            downButton.classList.add('reorder-btn');
            downButton.addEventListener('click', (e) => {
                e.stopPropagation();
                move(codes[index + 1]);
            });
            controls.appendChild(downButton);
        }

        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="ph ph-trash"></i>';
        removeButton.classList.add('reorder-btn', 'remove-btn');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userCurrencies = userCurrencies.filter(code => code !== currency.code);
            saveUserCurrencies();
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

document.addEventListener('DOMContentLoaded', async () => {
    await loadCurrencyMeta();

    document.getElementById('settings-btn').addEventListener('click', openCurrencySelector);

    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updateThemeToggleButton();

    updateCurrencyData();
});


async function fetchCurrencyData() {
    try {
        const [fiatGoldRes, cryptoRes] = await Promise.all([
            fetch(fiatGoldApiUrl),
            fetch(cryptoApiUrl)
        ]);
        const fiatGoldData = await fiatGoldRes.json();
        const cryptoData = await cryptoRes.json();

        const currencies = Object.entries(currencyMeta).map(([code, meta]) => {
            let price = null;
            if (meta.type === 'fiat' && fiatGoldData.fiat && fiatGoldData.fiat[meta.apiKey]) {
                price = fiatGoldData.fiat[meta.apiKey].sell;
            } else if (meta.type === 'gold' && fiatGoldData.gold) {
                const val = fiatGoldData.gold[meta.apiKey];
                if (val !== undefined) price = typeof val === 'object' ? val.sell : val;
            } else if (meta.type === 'crypto') {
                const ticker = cryptoData.find(t => t.symbol === meta.apiSymbol + (meta.apiSymbol === 'USDT' ? '_IRT' : '_USDT'));
                if (ticker && ticker.price) price = parseFloat(ticker.price);
            }
            if (price === null) return null;
            return { code, en: meta.en, icon: meta.icon, price };
        }).filter(Boolean);

        return { date: fiatGoldData.updated || '', currencies };
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
