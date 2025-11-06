// Sample property data
const propertiesData = [
    { id: 11, image: 'media/danube/oceanz-tower-2/images/exterior/Oceanz3_exterior_newsky.jpg', price: 1138000, purpose: 'buy', type: 'apartment', location: 'maritime-city', locationName: 'Dubai Maritime City', bedrooms: 1, bathrooms: 1, sqft: 746, badge: 'New Launch', developer: 'Danube Properties', detailPage: 'property-oceanz-tower-2.html', title: 'Oceanz Tower 2' },
    { id: 1, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', price: 1850000, purpose: 'buy', type: 'apartment', location: 'downtown', locationName: 'Downtown Dubai', bedrooms: 2, bathrooms: 2, sqft: 1450, badge: 'Featured' },
    { id: 2, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', price: 4500000, purpose: 'buy', type: 'villa', location: 'arabian-ranches', locationName: 'Arabian Ranches', bedrooms: 5, bathrooms: 6, sqft: 5200, badge: 'Luxury' },
    { id: 3, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', price: 2200000, purpose: 'buy', type: 'penthouse', location: 'marina', locationName: 'Dubai Marina', bedrooms: 3, bathrooms: 3, sqft: 2100, badge: 'Premium' },
    { id: 4, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', price: 180000, purpose: 'rent', type: 'apartment', location: 'jbr', locationName: 'JBR', bedrooms: 2, bathrooms: 2, sqft: 1300, badge: 'Available' },
    { id: 5, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', price: 1450000, purpose: 'buy', type: 'apartment', location: 'business-bay', locationName: 'Business Bay', bedrooms: 2, bathrooms: 2, sqft: 1250, badge: 'New' },
    { id: 6, image: 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800', price: 3200000, purpose: 'buy', type: 'townhouse', location: 'dubai-hills', locationName: 'Dubai Hills Estate', bedrooms: 4, bathrooms: 4, sqft: 3000, badge: 'Hot Deal' },
    { id: 7, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', price: 6800000, purpose: 'buy', type: 'villa', location: 'palm', locationName: 'Palm Jumeirah', bedrooms: 6, bathrooms: 7, sqft: 7500, badge: 'Exclusive' },
    { id: 8, image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', price: 95000, purpose: 'rent', type: 'apartment', location: 'jlt', locationName: 'Jumeirah Lake Towers', bedrooms: 1, bathrooms: 1, sqft: 850, badge: 'Good Deal' },
    { id: 9, image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800', price: 2850000, purpose: 'buy', type: 'apartment', location: 'downtown', locationName: 'Downtown Dubai', bedrooms: 3, bathrooms: 3, sqft: 2200, badge: 'Prime Location' },
    { id: 10, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', price: 150000, purpose: 'rent', type: 'villa', location: 'arabian-ranches', locationName: 'Arabian Ranches', bedrooms: 4, bathrooms: 5, sqft: 4000, badge: 'Furnished' }
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
                    <div class="feature"><i class="fas fa-bed"></i> ${p.bedrooms} Bed${p.bedrooms !== 1 ? 's' : ''}</div>
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
}

const sortBy = document.getElementById('sortBy');
if (sortBy) sortBy.addEventListener('change', (e) => sortProperties(e.target.value));

if (document.getElementById('propertiesGrid')) displayProperties(filteredProperties);
