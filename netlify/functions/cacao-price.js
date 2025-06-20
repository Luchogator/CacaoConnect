// netlify/functions/cacao-price.js
// Netlify Function: Proxy para obtener el precio del cacao desde la API de FRED (Federal Reserve)

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  try {
    // Endpoint FRED para el precio global del cacao (usando tu API key personalizada)
    const url = 'https://api.stlouisfed.org/fred/series/observations?series_id=PCOCOUSDM&api_key=895d602ab48b216a6992fd41f3cb03c9&file_type=json';
    const response = await fetch(url);
    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'No error body';
      }
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error fetching data from FRED API', details: errorText })
      };
    }
    const data = await response.json();
    if (!data.observations || !Array.isArray(data.observations)) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Unexpected FRED API response', details: data })
      };
    }
    // Buscar el valor más reciente disponible (último con valor válido)
    const validObservations = data.observations.filter(obs => obs.value && obs.value !== '.' && obs.value !== null);
    if (!validObservations.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'No cocoa price found in FRED API' })
      };
    }
    // Último valor para el display principal
    const last = validObservations[validObservations.length - 1];
    // Historial: últimos 30 valores (o menos si no hay tantos)
    const history = validObservations.slice(-30).map(obs => ({
      date: obs.date,
      price: parseFloat(obs.value) / 1000 // USD/kg
    }));
    // Convertir el precio de USD/ton a USD/kg y formatear a dos decimales
    const pricePerTon = parseFloat(last.value);
    const pricePerKg = pricePerTon / 1000;
    const priceFormatted = pricePerKg.toFixed(2);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: last.date,
        price: priceFormatted,
        name: data.seriess && data.seriess[0] ? data.seriess[0].title : 'Cocoa Price (FRED)',
        history: history
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
