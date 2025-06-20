// js/market-prices.js
// Obtiene precios de cacao desde la función serverless de Netlify (Banco Mundial) y los muestra en Market Prices

async function renderCacaoChart(history) {
    if (!history || !Array.isArray(history) || !history.length) return;
    const ctx = document.getElementById('cacaoPriceChart').getContext('2d');
    const labels = history.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }));
    const prices = history.map(item => item.price.toFixed(2));
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'USD/kg',
                data: prices,
                borderColor: '#8d5524',
                backgroundColor: 'rgba(141,85,36,0.1)',
                fill: true,
                tension: 0.2,
                pointRadius: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true },
                title: { display: false }
            },
            scales: {
                x: { display: true, title: { display: true, text: 'Date' } },
                y: { display: true, title: { display: true, text: 'USD/kg' } }
            }
        }
    });
}

function calculateMarketData(history) {
    if (!history || history.length < 2) return {};
    // Último y penúltimo
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    // 24h change
    const change24h = ((last.price - prev.price) / prev.price) * 100;
    // 7d change
    const idx7d = history.length - 8 >= 0 ? history.length - 8 : 0;
    const prev7d = history[idx7d];
    const change7d = ((last.price - prev7d.price) / prev7d.price) * 100;
    // Proyección simple de volumen y market cap (ficticio, coherente con precio)
    const baseVolume = 1000000; // 1M
    const volume = (baseVolume * (last.price / 3)).toFixed(0); // escala con precio
    const marketCap = (volume * 365 * 10).toFixed(0); // ficticio, 10 años de volumen
    return {
        change24h: change24h.toFixed(2),
        change7d: change7d.toFixed(2),
        volume: `$${(volume/1e6).toFixed(2)}M`,
        marketCap: `$${(marketCap/1e9).toFixed(2)}B`
    };
}

function updateMarketTable(history) {
    if (!history || history.length < 5) return;
    for (let i = 0; i < 5; i++) {
        const curr = history[history.length - 1 - i];
        const prev = history[history.length - 2 - i] || curr;
        const change = ((curr.price - prev.price) / prev.price) * 100;
        const changeClass = change > 0 ? 'price-up' : (change < 0 ? 'price-down' : 'price-stable');
        const changeStr = change > 0 ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`;
        // Proyección ficticia de volumen
        const baseVolume = 1000000;
        const volume = `$${((baseVolume * (curr.price / 3))).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
        document.getElementById(`market-table-row-${i+1}`).innerHTML = `
            <td>${new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
            <td>$${curr.price.toFixed(2)}</td>
            <td class="${changeClass}">${changeStr}</td>
            <td>${volume}</td>
        `;
    }
}

async function fetchCacaoPrice() {
    try {
        // Llama a la función serverless de Netlify
        const url = '/.netlify/functions/cacao-price';
        const response = await fetch(url);
        const data = await response.json();
        if (data.price && data.date) {
            document.getElementById('cacao-price').textContent = `$${data.price}`;
            // Format date to US English
            const formattedDate = new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            document.getElementById('cacao-date').textContent = formattedDate;
        } else {
            document.getElementById('cacao-price').textContent = 'N/A';
        }
        // Renderiza el gráfico si hay historial
        if (data.history) {
            renderCacaoChart(data.history);
            // Actualiza Market Data
            const mkt = calculateMarketData(data.history);
            if (mkt) {
                document.getElementById('cacao-volume').textContent = mkt.volume;
                document.getElementById('cacao-marketcap').textContent = mkt.marketCap;
                document.getElementById('cacao-volume-change').innerHTML = mkt.change24h > 0 ? `<span class='price-up'><i class='fas fa-arrow-up'></i> ${mkt.change24h}%</span>` : `<span class='price-down'><i class='fas fa-arrow-down'></i> ${mkt.change24h}%</span>`;
                document.getElementById('cacao-marketcap-change').innerHTML = '';
                document.getElementById('cacao-change7d').textContent = `${mkt.change7d}%`;
                document.getElementById('cacao-change7d-label').innerHTML = mkt.change7d > 0 ? `<span class='price-up'><i class='fas fa-arrow-up'></i> Rising</span>` : (mkt.change7d < 0 ? `<span class='price-down'><i class='fas fa-arrow-down'></i> Falling</span>` : `<span class='price-stable'>Stable</span>`);
            }
            updateMarketTable(data.history);
        }
    } catch (e) {
        document.getElementById('cacao-price').textContent = 'Error';
    }
}

document.addEventListener('DOMContentLoaded', fetchCacaoPrice);
