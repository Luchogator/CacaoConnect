// js/register-parcel.js
// Handle parcel registration form, save to localStorage

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('parcelForm');
  if (!form) return;

  // --- Initialize Leaflet map for drawing ---
  const mapEl = document.getElementById('drawMap');
  if (mapEl && typeof L !== 'undefined') {
    const initialLatLng = [-6.48, -75.828];
    const map = L.map('drawMap', {
      center: initialLatLng,
      zoom: 15,
      preferCanvas: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Feature group to store drawn layer
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    // Draw control (polygon only)
    const drawControl = new L.Control.Draw({
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: { color: '#1e88e5' },
        },
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
        edit: true,
        remove: true,
      },
    });
    map.addControl(drawControl);

    // Helper to write coords to textarea
    const coordsTextarea = document.getElementById('coords');
    const updateCoords = (layer) => {
      const latlngs = layer.getLatLngs()[0] || [];
      const coordStr = latlngs.map(latlng => `${latlng.lat.toFixed(6)},${latlng.lng.toFixed(6)}`).join('; ');
      coordsTextarea.value = coordStr;
    };

    // Handle create/edit/delete
    map.on(L.Draw.Event.CREATED, (e) => {
      drawnItems.clearLayers(); // keep only one polygon
      drawnItems.addLayer(e.layer);
      updateCoords(e.layer);
    });
    map.on(L.Draw.Event.EDITED, (e) => {
      const layers = e.layers;
      layers.eachLayer(layer => updateCoords(layer));
    });
    map.on(L.Draw.Event.DELETED, () => {
      coordsTextarea.value = '';
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Build parcel object with extra attributes
    const imageFile = document.getElementById('image').files[0];
    let imgDataUrl = '';

    const parcel = {
      name: formData.get('name').trim(),
      owner: formData.get('owner').trim(),
      area: `${parseFloat(formData.get('area')).toFixed(2)} ha`,
      production: `${parseInt(formData.get('production'), 10)} kg/year`,
      variety: formData.get('variety').trim(),
      certifications: formData.get('certifications').trim(),
      color: '#1e88e5',
      fillColor: '#bbdefb',
      image: imgDataUrl,
      myParcel: true,
    };

    // Parse coordinates (expects lat,lng; lat,lng ...)
    const coordsRaw = formData.get('coords').split(';').map(c => c.trim()).filter(Boolean);
    const coords = coordsRaw.map(pair => {
      const [latStr, lngStr] = pair.split(',');
      return [parseFloat(latStr), parseFloat(lngStr)];
    }).filter(arr => arr.length === 2 && !arr.some(isNaN));

    if (coords.length < 3) {
      alert('Please provide at least three coordinate pairs to form a polygon.');
      return;
    }

    parcel.coords = coords;

    // Handle image conversion if selected
    if (imageFile) {
      try {
        imgDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        parcel.image = imgDataUrl;
      } catch (err) {
        console.warn('Image load error', err);
      }
    }

    // Retrieve existing user parcels from localStorage
    const existingStr = localStorage.getItem('userParcels');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    existing.push(parcel);
    localStorage.setItem('userParcels', JSON.stringify(existing));

    // Redirect back to My Parcels page
    alert('Parcel saved!');
    window.location.href = 'parcels.html';
  });
});
