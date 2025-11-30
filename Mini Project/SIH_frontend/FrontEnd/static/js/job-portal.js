// Initialize the map centered on India
var map = L.map('map').setView([20.5937, 78.9629], 5); // Coordinates for the center of India

// Load the tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add markers for major tech hubs in India
const techHubs = [
    { name: "Bangalore", coords: [12.9716, 77.5946], jobs: 120 },
    { name: "Mumbai", coords: [19.0760, 72.8777], jobs: 85 },
    { name: "Delhi NCR", coords: [28.6139, 77.2090], jobs: 95 },
    { name: "Hyderabad", coords: [17.3850, 78.4867], jobs: 78 },
    { name: "Pune", coords: [18.5204, 73.8567], jobs: 65 },
    { name: "Chennai", coords: [13.0827, 80.2707], jobs: 52 }
];

// Add markers to the map
techHubs.forEach(hub => {
    L.marker(hub.coords).addTo(map)
        .bindPopup(`<b>${hub.name}</b><br>${hub.jobs} open positions`)
        .on('mouseover', function (e) {
            this.openPopup();
        });
});

// Back to top button functionality
document.addEventListener('DOMContentLoaded', function() {
    const backToTopButton = document.getElementById('back-to-top');
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Load more jobs button functionality
    const loadMoreButton = document.querySelector('.load-more button');
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            // This would typically fetch more jobs from an API
            // For now, we'll just show an alert
            alert('More jobs would be loaded here from the server.');
        });
    }
    
    // Filter functionality
    const filters = document.querySelectorAll('.filter select');
    filters.forEach(filter => {
        filter.addEventListener('change', function() {
            // This would typically filter the jobs based on selection
            // For now, we'll just log the selected filters
            console.log(`Filter ${this.name} changed to ${this.value}`);
        });
    });
});