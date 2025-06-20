// js/market-prices.js
// Obtiene precios de cacao desde la función serverless de Netlify (Banco Mundial) y los muestra en Market Prices

async function renderCacaoChart(history) {
    if (!history || !Array.isArray(history) || !history.length) return;
    const ctx = document.getElementById('cacaoPriceChart').getContext('2d');
    const labels = history.map(item => item.date);
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
                x: { display: true, title: { display: true, text: 'Fecha' } },
                y: { display: true, title: { display: true, text: 'USD/kg' } }
            }
        }
    });
}

async function fetchCacaoPrice() {
    try {
        // Llama a la función serverless de Netlify
        const url = '/.netlify/functions/cacao-price';
        const response = await fetch(url);
        const data = await response.json();
        if (data.price && data.date) {
            document.getElementById('cacao-price').textContent = `$${data.price}`;
            document.getElementById('cacao-date').textContent = data.date;
        } else {
            document.getElementById('cacao-price').textContent = 'N/A';
        }
        // Renderiza el gráfico si hay historial
        if (data.history) {
            renderCacaoChart(data.history);
        }
    } catch (e) {
        document.getElementById('cacao-price').textContent = 'Error';
    }
}

document.addEventListener('DOMContentLoaded', fetchCacaoPrice);
