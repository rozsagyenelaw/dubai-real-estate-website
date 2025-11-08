// Sample property data
const propertiesData = [
    { id: 16, image: 'media/diamondz/images/exterior/Exterior.jpg', price: 1130000, purpose: 'buy', type: 'apartment', location: 'jlt', locationName: 'Jumeirah Lake Towers', bedrooms: 0, bathrooms: 1, sqft: 407, badge: 'Ultra Luxury', developer: 'Danube Properties', detailPage: 'property-diamondz.html', title: 'Diamondz' },
    { id: 15, image: 'media/timez/images/exterior/Danube_Timez_Hero1.jpg', price: 650000, purpose: 'buy', type: 'apartment', location: 'silicon-oasis', locationName: 'Dubai Silicon Oasis', bedrooms: 0, bathrooms: 1, sqft: 450, badge: 'Convertible Apartments', developer: 'Danube Properties', detailPage: 'property-timez.html', title: 'Timez' },
    { id: 14, image: 'media/fashionz/images/exterior/DAY-VIEW.jpg', price: 850000, purpose: 'buy', type: 'apartment', location: 'jvt', locationName: 'Jumeirah Village Triangle', bedrooms: 0, bathrooms: 1, sqft: 520, badge: 'FashionTV Branded', developer: 'Danube Properties', detailPage: 'property-fashionz.html', title: 'Fashionz' },
    { id: 13, image: 'media/bayz-102/images/exterior/Bayz 102 View1_Day_Final.jpg', price: 1200000, purpose: 'buy', type: 'apartment', location: 'business-bay', locationName: 'Business Bay', bedrooms: 0, bathrooms: 1, sqft: 500, badge: 'New Launch', developer: 'Danube Properties', detailPage: 'property-bayz-102.html', title: 'BAYZ 102' },
    { id: 12, image: 'media/bayz/images/exterior/entrance_day_v6.jpg', price: 1175000, purpose: 'buy', type: 'apartment', location: 'business-bay', locationName: 'Business Bay', bedrooms: 0, bathrooms: 1, sqft: 500, badge: 'New Launch', developer: 'Danube Properties', detailPage: 'property-bayz.html', title: 'BAYZ 101' },
    { id: 11, image: 'media/danube/oceanz-tower-2/images/exterior/Oceanz3_exterior_newsky.jpg', price: 1138000, purpose: 'buy', type: 'apartment', location: 'maritime-city', locationName: 'Dubai Maritime City', bedrooms: 1, bathrooms: 1, sqft: 746, badge: 'Featured', developer: 'Danube Properties', detailPage: 'property-oceanz-tower-2.html', title: 'Oceanz Tower 2' }
];

let filteredProperties = [...propertiesData];

function displayProperties(properties) {
    const grid = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) resultsCount.textContent = properties.length;
    if (!grid) return;
    if (properties.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; padding: 4rem;">No properties found matching your criteria.</p>';
        return;
    }
    grid.innerHTML = properties.map(p => `
        <div class="property-card">
            <div class="property-image">
                <img src="${p.image}" alt="${p.title || p.type} in ${p.locationName}" loading="lazy">
                <span class="property-badge">${p.badge}</span>
                ${p.developer ? `<span class="property-badge" style="top: 3rem; background: var(--primary-navy);">${p.developer}</span>` : ''}
            </div>
            <div class="property-info">
                ${p.title ? `<div style="font-weight: 600; color: var(--primary-navy); margin-bottom: 0.5rem;">${p.title}</div>` : ''}
                <div class="property-price">AED ${p.price.toLocaleString()}</div>
                <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${p.locationName}</div>
                <div class="property-features">
                    <div class="feature"><i class="fas fa-bed"></i> ${p.bedrooms === 0 ? 'Studio' : p.bedrooms + ' Bed' + (p.bedrooms !== 1 ? 's' : '')}</div>
                    <div class="feature"><i class="fas fa-bath"></i> ${p.bathrooms} Bath${p.bathrooms !== 1 ? 's' : ''}</div>
                    <div class="feature"><i class="fas fa-ruler-combined"></i> ${p.sqft.toLocaleString()} sqft</div>
                </div>
                <div class="property-footer">
                    <span class="property-type">${p.type.charAt(0).toUpperCase() + p.type.slice(1)}</span>
                    <a href="${p.detailPage || '#'}" class="view-details">View Details <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

function filterProperties() {
    const purpose = document.querySelector('input[name="purpose"]:checked')?.value || 'buy';
    const propertyType = document.querySelector('select[name="propertyType"]')?.value || '';
    const location = document.querySelector('select[name="location"]')?.value || '';
    const priceRange = document.querySelector('select[name="priceRange"]')?.value || '';
    const bedrooms = document.querySelector('select[name="bedrooms"]')?.value || '';

    filteredProperties = propertiesData.filter(p => {
        if (p.purpose !== purpose) return false;
        if (propertyType && p.type !== propertyType) return false;
        if (location && p.location !== location) return false;
        if (bedrooms) {
            if (bedrooms === 'studio' && p.bedrooms !== 0) return false;
            if (bedrooms === '5+' && p.bedrooms < 5) return false;
            if (bedrooms !== 'studio' && bedrooms !== '5+' && p.bedrooms !== parseInt(bedrooms)) return false;
        }
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(pr => parseInt(pr.replace('+', '')));
            if (max && (p.price < min || p.price > max)) return false;
            if (!max && p.price < min) return false;
        }
        return true;
    });
    displayProperties(filteredProperties);
}

function sortProperties(sortBy) {
    switch(sortBy) {
        case 'price-low': filteredProperties.sort((a, b) => a.price - b.price); break;
        case 'price-high': filteredProperties.sort((a, b) => b.price - a.price); break;
        case 'bedrooms': filteredProperties.sort((a, b) => b.bedrooms - a.bedrooms); break;
        default: filteredProperties.sort((a, b) => b.id - a.id);
    }
    displayProperties(filteredProperties);
}

const propertyFilters = document.getElementById('propertyFilters');
if (propertyFilters) {
    propertyFilters.addEventListener('submit', (e) => { e.preventDefault(); filterProperties(); });
    propertyFilters.addEventListener('reset', () => { setTimeout(() => { filteredProperties = [...propertiesData]; displayProperties(filteredProperties); }, 100); });

    // Add change event listeners to all filter inputs for automatic filtering
    const filterInputs = propertyFilters.querySelectorAll('select, input[type="radio"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', () => filterProperties());
    });
}

const sortBy = document.getElementById('sortBy');
if (sortBy) sortBy.addEventListener('change', (e) => sortProperties(e.target.value));

// Apply URL parameters on page load
function applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);

    // Set location filter
    const locationParam = urlParams.get('location');
    if (locationParam) {
        const locationSelect = document.querySelector('select[name="location"]');
        if (locationSelect) {
            locationSelect.value = locationParam;
        }
    }

    // Set price filter
    const priceParam = urlParams.get('priceRange');
    if (priceParam) {
        const priceSelect = document.querySelector('select[name="priceRange"]');
        if (priceSelect) {
            priceSelect.value = priceParam;
        }
    }

    // Set bedrooms filter
    const bedroomsParam = urlParams.get('bedrooms');
    if (bedroomsParam) {
        const bedroomsSelect = document.querySelector('select[name="bedrooms"]');
        if (bedroomsSelect) {
            bedroomsSelect.value = bedroomsParam;
        }
    }

    // Apply filters if any URL params exist
    if (locationParam || priceParam || bedroomsParam) {
        filterProperties();
    }
}

if (document.getElementById('propertiesGrid')) {
    displayProperties(filteredProperties);
    applyUrlFilters();
}
