// js/parcels-page.js
// Dynamically render parcel cards on My Parcels page based on localStorage + demo

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.parcels-grid');
  if (!grid) return;

  // Fallback images (if parcel.image absent)
  const fallbackImages = [
    'images/iStock-92396322.jpg',
    'images/images.jpg',
    'images/intercropping-coconut-cocoa-integrated-farming-600nw-1475363993.webp'
  ];

  // Demo personal parcels already hard-coded
  const demoMyParcels = [
    {
      name: 'Main Cacao Plantation',
      area: '4.2 ha',
      image: '',
      location: 'Huimbayoc, San Martin',
      health: '85%'
    },
    {
      name: 'El Dorado Plantation',
      area: '3.5 ha',
      image: '',
      location: 'Tarapoto, San Martin',
      health: '72%'
    }
  ];

  let parcels = [...demoMyParcels];
  try {
    const userParcelsStr = localStorage.getItem('userParcels');
    if (userParcelsStr) {
      const userParcels = JSON.parse(userParcelsStr);
      if (Array.isArray(userParcels)) {
        parcels = parcels.concat(userParcels);
      }
    }
  } catch (e) {
    console.error('Error reading userParcels', e);
  }

  // Clear existing static cards
  grid.innerHTML = '';

  const createCard = (parcel) => {
    const card = document.createElement('div');
    card.className = 'parcel-card';

    // Image section with status overlay
    const imgDiv = document.createElement('div');
    imgDiv.className = 'parcel-image';
    if (parcel.image) {
      imgDiv.style.backgroundImage = `url(${parcel.image})`;
      imgDiv.style.backgroundSize = 'cover';
      imgDiv.style.backgroundPosition = 'center';
    }

    const statusSpan = document.createElement('span');
    statusSpan.className = `parcel-status ${parcel.status === 'inactive' ? 'status-inactive' : 'status-active'}`;
    statusSpan.innerHTML = `<i class="fas fa-circle"></i> ${parcel.status === 'inactive' ? 'Inactive' : 'Active'}`;
    imgDiv.appendChild(statusSpan);
    card.appendChild(imgDiv);

    // Details
    const details = document.createElement('div');
    details.className = 'parcel-details';

    const title = document.createElement('h3');
    title.className = 'parcel-title';
    title.textContent = parcel.name;

    const locationDiv = document.createElement('div');
    locationDiv.className = 'parcel-location';
    locationDiv.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${parcel.location || ''}`;

    // Stats
    const statsDiv = document.createElement('div');
    statsDiv.className = 'parcel-stats';

    const sizeStat = document.createElement('div');
    sizeStat.className = 'stat';
    sizeStat.innerHTML = `<div class="stat-value">${parcel.area || '-'}</div><div class="stat-label">Size</div>`;

    const plantsStat = document.createElement('div');
    plantsStat.className = 'stat';
    plantsStat.innerHTML = `<span class="stat-value">${parcel.plants || '-'}</span><span class="stat-label">Plants</span>`;

    const healthStat = document.createElement('div');
    healthStat.className = 'stat';
    healthStat.innerHTML = `<span class="stat-value">${parcel.health || '-'}</span><span class="stat-label">Health</span>`;

    statsDiv.appendChild(sizeStat);
    statsDiv.appendChild(plantsStat);
    statsDiv.appendChild(healthStat);

    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'parcel-actions';
    actionsDiv.innerHTML = `<a href="parcel-detail.html" class="btn btn-outline">View Details</a>
                            <a href="#" class="btn btn-primary">View Stats</a>`;

    // Build hierarchy
    details.appendChild(title);
    if (parcel.location) details.appendChild(locationDiv);
    details.appendChild(statsDiv);
    details.appendChild(actionsDiv);

    card.appendChild(details);
    return card;
  };

  let imgIndex = 0;
  parcels.forEach(parcel => {
    if(!parcel.image){
      parcel.image = fallbackImages[imgIndex % fallbackImages.length];
      imgIndex++;
    }
    const card = createCard(parcel);
    grid.appendChild(card);
  });
});
