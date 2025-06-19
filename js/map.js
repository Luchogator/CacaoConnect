// Prevent multiple map initializations
if (typeof window.mapInitialized === 'undefined') {
    window.mapInitialized = false;
}

function initMap() {
    // Check if map is already initialized
    if (window.mapInitialized) {
        console.log('Map already initialized');
        return;
    }


    // Check if the map container exists
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map container not found');
        return;
    }

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet is not loaded');
        return;
    }


    try {
        // Clear any existing map instance
        if (mapElement._leaflet_id) {
            console.log('Removing existing map instance');
            L.DomEvent.off(mapElement);
            mapElement._leaflet_id = null;
            delete mapElement._leaflet_id;
        }

        // Coordinates for south of Pucalpillo, Huimbayoc, San Martin (rural area)
        const initialLat = -6.479760;
        const initialLng = -75.828237;
        const initialZoom = 15;

        // Initialize the map with explicit options
        const map = L.map('map', {
            center: [initialLat, initialLng],
            zoom: initialZoom,
            zoomControl: false, // We'll add it manually later
            preferCanvas: false, // Changed to false to help with rendering
            renderer: L.svg(), // Changed to SVG renderer
            attributionControl: true,
            fadeAnimation: true,
            markerZoomAnimation: true,
            zoomAnimation: true
        });

        // Add OpenStreetMap base layer
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            minZoom: 2,
            tileSize: 256,
            zoomOffset: 0,
            errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRA==',
            crossOrigin: true,
            detectRetina: false,
            updateWhenIdle: true,
            reuseTiles: true
        });

        // Add ESRI World Imagery (satellite) base layer
        const esriSatLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        });

        // Add the default layer to the map
        esriSatLayer.addTo(map);

        // Add layer control to switch between base maps
        const baseMaps = {
            "Map": osmLayer,
            "Satellite": esriSatLayer
        };
        L.control.layers(baseMaps, null, { position: 'topright', collapsed: false }).addTo(map);

        // Add zoom control with a different position
        L.control.zoom({
            position: 'topright'
        }).addTo(map);

        // Add scale control
        L.control.scale({
            imperial: false,
            metric: true,
            position: 'bottomright'
        }).addTo(map);

        // Add marker at the new location
        L.marker([initialLat, initialLng])
            .addTo(map)
            .bindPopup('CacaoConnect<br>Huimbayoc, San Martin, Peru')
            .openPopup();

        // Parcels with English details, now with irregular shapes (pentagons, hexagons, etc.) and not overlapping
        const parcels = [
            {
                name: "Parcel 1",
                coords: [
                    [initialLat + 0.001, initialLng + 0.001],
                    [initialLat + 0.0012, initialLng + 0.0007],
                    [initialLat + 0.0007, initialLng + 0.0005],
                    [initialLat + 0.0005, initialLng + 0.001],
                    [initialLat + 0.0008, initialLng + 0.0013]
                ],
                color: '#e53935', // red
                fillColor: '#ffcdd2',
                owner: "Maria Lopez",
                area: "2.5 ha",
                production: "1200 kg/year",
                certifications: "Organic, Fair Trade"
            },
            {
                name: "Parcel 2",
                coords: [
                    [initialLat + 0.0015, initialLng + 0.0015],
                    [initialLat + 0.0017, initialLng + 0.0012],
                    [initialLat + 0.0015, initialLng + 0.0008],
                    [initialLat + 0.0012, initialLng + 0.001],
                    [initialLat + 0.0013, initialLng + 0.0014],
                    [initialLat + 0.0014, initialLng + 0.0016]
                ],
                color: '#3949ab', // blue
                fillColor: '#c5cae9',
                owner: "Carlos Jimenez",
                area: "3.1 ha",
                production: "1500 kg/year",
                certifications: "Rainforest Alliance"
            },
            {
                name: "Parcel 3",
                coords: [
                    [initialLat - 0.001, initialLng + 0.0015],
                    [initialLat - 0.0012, initialLng + 0.0012],
                    [initialLat - 0.0013, initialLng + 0.0015],
                    [initialLat - 0.0011, initialLng + 0.0017],
                    [initialLat - 0.0008, initialLng + 0.0016]
                ],
                color: '#43a047', // green
                fillColor: '#a5d6a7',
                owner: "Ana Torres",
                area: "1.8 ha",
                production: "900 kg/year",
                certifications: "Organic"
            },
            {
                name: "Parcel 4",
                coords: [
                    [initialLat - 0.0015, initialLng - 0.001],
                    [initialLat - 0.0017, initialLng - 0.0013],
                    [initialLat - 0.0018, initialLng - 0.001],
                    [initialLat - 0.0016, initialLng - 0.0007],
                    [initialLat - 0.0013, initialLng - 0.0008]
                ],
                color: '#fbc02d', // yellow
                fillColor: '#fff9c4',
                owner: "Luis Fernandez",
                area: "2.9 ha",
                production: "1100 kg/year",
                certifications: "Fair Trade"
            },
            {
                name: "Parcel 5",
                coords: [
                    [initialLat + 0.0005, initialLng - 0.002],
                    [initialLat + 0.0008, initialLng - 0.0023],
                    [initialLat + 0.0007, initialLng - 0.0026],
                    [initialLat + 0.0004, initialLng - 0.0025],
                    [initialLat + 0.0003, initialLng - 0.0022]
                ],
                color: '#8e24aa', // purple
                fillColor: '#e1bee7',
                owner: "Sofia Ramirez",
                area: "2.2 ha",
                production: "1000 kg/year",
                certifications: "Rainforest Alliance, Organic"
            },
            {
                name: "Parcel 6",
                coords: [
                    [initialLat - 0.002, initialLng + 0.002],
                    [initialLat - 0.0023, initialLng + 0.0017],
                    [initialLat - 0.0025, initialLng + 0.002],
                    [initialLat - 0.0022, initialLng + 0.0023],
                    [initialLat - 0.0019, initialLng + 0.0021]
                ],
                color: '#00bcd4', // cyan
                fillColor: '#b2ebf2',
                owner: "Pedro Salazar",
                area: "2.7 ha",
                production: "1300 kg/year",
                certifications: "Organic"
            },
            {
                name: "Parcel 7",
                coords: [
                    [initialLat + 0.002, initialLng - 0.001],
                    [initialLat + 0.0023, initialLng - 0.0013],
                    [initialLat + 0.0025, initialLng - 0.001],
                    [initialLat + 0.0022, initialLng - 0.0007],
                    [initialLat + 0.0019, initialLng - 0.0008]
                ],
                color: '#ff9800', // orange
                fillColor: '#ffe0b2',
                owner: "Lucia Vargas",
                area: "2.3 ha",
                production: "1050 kg/year",
                certifications: "Fair Trade"
            },
            {
                name: "Parcel 8",
                coords: [
                    [initialLat - 0.002, initialLng - 0.002],
                    [initialLat - 0.0023, initialLng - 0.0023],
                    [initialLat - 0.0025, initialLng - 0.002],
                    [initialLat - 0.0022, initialLng - 0.0017],
                    [initialLat - 0.0019, initialLng - 0.0019]
                ],
                color: '#607d8b', // blue grey
                fillColor: '#cfd8dc',
                owner: "Miguel Rojas",
                area: "2.0 ha",
                production: "980 kg/year",
                certifications: "Organic, Fair Trade"
            },
            {
                name: "Parcel 9",
                coords: [
                    [initialLat + 0.002, initialLng + 0.002],
                    [initialLat + 0.0023, initialLng + 0.0017],
                    [initialLat + 0.0025, initialLng + 0.002],
                    [initialLat + 0.0022, initialLng + 0.0023],
                    [initialLat + 0.0019, initialLng + 0.0021]
                ],
                color: '#9c27b0', // deep purple
                fillColor: '#e1bee7',
                owner: "Elena Castillo",
                area: "2.6 ha",
                production: "1250 kg/year",
                certifications: "Rainforest Alliance"
            },
            {
                name: "Parcel 10",
                coords: [
                    [initialLat - 0.0025, initialLng + 0.0005],
                    [initialLat - 0.0028, initialLng + 0.0002],
                    [initialLat - 0.003, initialLng + 0.0005],
                    [initialLat - 0.0027, initialLng + 0.0008],
                    [initialLat - 0.0024, initialLng + 0.0006]
                ],
                color: '#4caf50', // green
                fillColor: '#c8e6c9',
                owner: "Jorge Medina",
                area: "2.4 ha",
                production: "1120 kg/year",
                certifications: "Organic"
            }
        ];

        // Draw polygons and bind popups with details in English
        parcels.forEach(parcel => {
            L.polygon(parcel.coords, {
                color: parcel.color,
                fillColor: parcel.fillColor,
                fillOpacity: 0.5,
                weight: 2
            })
            .addTo(map)
            .bindPopup(
                `<b>${parcel.name}</b><br>` +
                `<b>Owner:</b> ${parcel.owner}<br>` +
                `<b>Area:</b> ${parcel.area}<br>` +
                `<b>Estimated Production:</b> ${parcel.production}<br>` +
                `<b>Certifications/Quality:</b> ${parcel.certifications}`
            );
        });

        // Add cacao buyers in Pucallpa with high-contrast icons
        const buyers = [
            {
                name: "Cacao Trading Co.",
                lat: -6.452618,
                lng: -75.844240,
                years: 12,
                price: "$2.10/kg",
                reputation: "4.7/5 (Fair, reliable)",
                reviews: "Always pays on time, fair prices."
            },
            {
                name: "Pucallpa Beans Export",
                lat: -6.452818,
                lng: -75.844540,
                years: 8,
                price: "$2.05/kg",
                reputation: "4.5/5 (Friendly, honest)",
                reviews: "Good communication, helpful staff."
            },
            {
                name: "Selva Cacao Buyer",
                lat: -6.452418,
                lng: -75.843940,
                years: 5,
                price: "$2.00/kg",
                reputation: "4.2/5 (Honest)",
                reviews: "Pays quickly, but negotiates hard."
            }
        ];
        buyers.forEach(buyer => {
            const icon = L.divIcon({
                html: '<i class="fas fa-user" style="color:#fff700;background:#222;border:2px solid #222;border-radius:50%;padding:4px;font-size:1.5rem;"></i>',
                iconSize: [34, 34],
                className: 'buyer-icon'
            });
            L.marker([buyer.lat, buyer.lng], { icon })
                .addTo(map)
                .bindPopup(
                    `<b>${buyer.name}</b><br>` +
                    `<b>Years in market:</b> ${buyer.years}<br>` +
                    `<b>Price per kg:</b> ${buyer.price}<br>` +
                    `<b>Reputation:</b> ${buyer.reputation}<br>` +
                    `<b>Reviews:</b> ${buyer.reviews}`
                );
        });

        // Debug logging
        console.log('Map initialized successfully');
        console.log('Map container size:', mapElement.offsetWidth, 'x', mapElement.offsetHeight);
        
        // Handle window resize with debounce
        let resizeTimer;
        const handleResize = function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                console.log('Resizing map...');
                map.invalidateSize();
            }, 100);
        };

        window.addEventListener('resize', handleResize);

        // Mark as initialized
        window.mapInitialized = true;
        
        // Cleanup function
        return function cleanup() {
            window.removeEventListener('resize', handleResize);
            if (map) {
                map.remove();
                window.mapInitialized = false;
            }
        };

    } catch (error) {
        console.error('Error initializing map:', error);
        if (mapElement) {
            mapElement.innerHTML = 
                '<div style="padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">' +
                '<h3>Error al cargar el mapa</h3>' +
                '<p>No se pudo cargar el mapa. Por favor, recarga la página o inténtalo de nuevo más tarde.</p>' +
                (error ? '<p>Detalles: ' + error.message + '</p>' : '') +
                '</div>';
        }
        return null;
    }
}

// Wait for all resources to be loaded before initializing the map
function initializeMapWhenReady() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.log('Leaflet not loaded yet, waiting...');
        setTimeout(initializeMapWhenReady, 100);
        return;
    }

    // Check if map container exists
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Map container not found');
        return;
    }

    // Initialize the map
    initMap();
}

// Start initialization process
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // If the document is already loaded, initialize immediately
    setTimeout(initializeMapWhenReady, 0);
} else {
    // Otherwise, wait for the document to be fully loaded
    window.addEventListener('load', initializeMapWhenReady);
}

// Also try to initialize if the page takes too long to load
setTimeout(initializeMapWhenReady, 1000);
