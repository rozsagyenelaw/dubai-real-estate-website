// Completed properties data
const completedProperties = [
    {
        id: 1,
        image: 'media/eleganz/images/exterior/Full Building.png',
        price: 0, // Contact for pricing
        type: 'apartment',
        location: 'jvc',
        locationName: 'Jumeirah Village Circle',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 0, // Varies
        badge: 'Completed',
        developer: 'Ready to Move In',
        detailPage: 'property-eleganz.html',
        title: 'Eleganz',
        status: 'Completed'
    }
];

function displayProperties(properties) {
    const grid = document.getElementById('propertiesGrid');
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) resultsCount.textContent = properties.length;
    if (!grid) return;
    if (properties.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; grid-column: 1/-1; padding: 4rem;">
                <i class="fas fa-building" style="font-size: 4rem; color: var(--medium-gray); margin-bottom: 1.5rem;"></i>
                <h2 style="color: var(--primary-navy); margin-bottom: 1rem;">No Completed Projects Available</h2>
                <p style="color: var(--text-gray); font-size: 1.1rem; margin-bottom: 2rem;">
                    We currently don't have any completed projects listed. Check out our exciting off-plan properties with flexible payment plans.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <a href="off-plan.html" class="btn-primary">View Off-Plan Properties</a>
                    <a href="properties.html" class="btn-secondary">View All Properties</a>
                </div>
            </div>
        `;
        return;
    }
    grid.innerHTML = properties.map(p => `
        <div class="property-card">
            <div class="property-image">
                <img src="${p.image}" alt="${p.title || p.type} in ${p.locationName}" loading="lazy">
                <span class="property-badge" style="background: green;">${p.badge}</span>
            </div>
            <div class="property-info">
                ${p.title ? `<div style="font-weight: 600; color: var(--primary-navy); margin-bottom: 0.5rem;">${p.title}</div>` : ''}
                <div class="property-price">Contact for Pricing</div>
                <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${p.locationName}</div>
                <div style="color: green; font-size: 0.9rem; margin: 0.5rem 0;">
                    <i class="fas fa-check-circle"></i> Ready to Move In
                </div>
                <div class="property-features">
                    <div class="feature"><i class="fas fa-bed"></i> 1-4 Beds</div>
                    <div class="feature"><i class="fas fa-home"></i> Multiple Types</div>
                    <div class="feature"><i class="fas fa-star"></i> Premium</div>
                </div>
                <div class="property-footer">
                    <span class="property-type">Completed Project</span>
                    <a href="${p.detailPage || '#'}" class="view-details">View Details <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

if (document.getElementById('propertiesGrid')) {
    displayProperties(completedProperties);
}
