// js/market-prices.js
// Obtiene precios de cacao desde la función serverless de Netlify (Banco Mundial) y los muestra en Market Prices

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
    } catch (e) {
        document.getElementById('cacao-price').textContent = 'Error';
    }
}

document.addEventListener('DOMContentLoaded', fetchCacaoPrice);
