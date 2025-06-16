// Configuración del mapa
document.addEventListener('DOMContentLoaded', function() {
    // Coordenadas iniciales (centro de América Latina)
    const initialLat = -8.7832;
    const initialLng = -55.4915;
    const initialZoom = 4;

    // Inicializar el mapa
    const map = L.map('map').setView([initialLat, initialLng], initialZoom);

    // Añadir capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Estilo para las parcelas
    const parcelStyle = {
        color: '#2E7D32', // Jungle Green
        weight: 2,
        opacity: 1,
        fillOpacity: 0.5,
        fillColor: '#2E7D32'
    };

    // Datos de ejemplo de parcelas (en producción, esto vendría de tu API)
    const parcelas = [
        {
            id: 1,
            nombre: 'Finca El Cacaotal',
            area: 5.2,
            ubicacion: 'Chiapas, México',
            variedad: 'Criollo',
            coordenadas: [
                [16.7569, -92.6375],
                [16.7569, -92.6275],
                [16.7469, -92.6275],
                [16.7469, -92.6375],
                [16.7569, -92.6375] // Cierra el polígono
            ]
        },
        {
            id: 2,
            nombre: 'Hacienda Cacao Real',
            area: 8.7,
            ubicacion: 'Tabasco, México',
            variedad: 'Forastero',
            coordenadas: [
                [17.9569, -92.9375],
                [17.9569, -92.9275],
                [17.9469, -92.9275],
                [17.9469, -92.9375],
                [17.9569, -92.9375]
            ]
        }
    ];

    // Añadir parcelas al mapa
    parcelas.forEach(parcela => {
        const polygon = L.polygon(parcela.coordenadas, parcelStyle).addTo(map);
        
        // Crear contenido del popup
        const popupContent = `
            <div class="parcel-popup">
                <h4 class="parcel-title">${parcela.nombre}</h4>
                <p><strong>Ubicación:</strong> ${parcela.ubicacion}</p>
                <p><strong>Área:</strong> ${parcela.area} ha</p>
                <p><strong>Variedad:</strong> ${parcela.variedad}</p>
                <div class="parcel-actions">
                    <button onclick="verDetalleParcela(${parcela.id})">Ver Detalles</button>
                    <button onclick="mostrarRuta(${parcela.id})">Cómo Llegar</button>
                </div>
            </div>
        `;
        
        // Añadir popup al polígono
        polygon.bindPopup(popupContent);
    });

    // Añadir controles de capas
    const baseLayers = {
        'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }),
        'Satélite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        })
    };

    // Añadir capas base al control de capas
    L.control.layers(baseLayers).addTo(map);

    // Añadir control de escala
    L.control.scale({
        imperial: false,
        metric: true
    }).addTo(map);

    // Añadir leyenda
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'legend');
        div.innerHTML += 
            '<h4>Leyenda</h4>' +
            '<i style="background: #2E7D32"></i> Parcelas de Cacao<br>';
        return div;
    };
    legend.addTo(map);
});

// Funciones globales para los botones del popup
function verDetalleParcela(id) {
    // Redirigir a la página de detalles de la parcela
    window.location.href = `parcel-detail.html?id=${id}`;
}

function mostrarRuta(id) {
    // Implementar lógica para mostrar ruta
    alert(`Mostrando ruta a la parcela ${id}`);
}
