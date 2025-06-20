// Smooth page transitions
document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const main = document.querySelector('main');
    
    // Add page enter animation
    body.classList.add('page-transition-enter');
    
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't interfere with same-page links
            if (href === window.location.pathname.split('/').pop() || 
                (href === 'index.html' && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')))) {
                return;
            }
            
            e.preventDefault();
            
            // Add exit animation
            body.classList.add('page-transition-exit');
            
            // Navigate after animation
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });
    
    // Smooth scroll for any internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add smooth fade-in for dynamic content
function fadeInElement(element, duration = 600) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
    
    requestAnimationFrame(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });
}
