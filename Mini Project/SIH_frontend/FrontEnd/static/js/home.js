// Main JavaScript for Alumni Connect Home Page

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        backToTopBtn.classList.add('visible');
      } else {
        navbar.classList.remove('scrolled');
        backToTopBtn.classList.remove('visible');
      }
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', function() {
        navbar.classList.toggle('mobile-menu-active');
      });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-items a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navbar.classList.remove('mobile-menu-active');
      });
    });
    
    // Back to top button functionality
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
    
    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonials-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    
    if (testimonialSlider && prevBtn && nextBtn) {
      let currentIndex = 0;
      
      // Function to update slider position
      function updateSlider() {
        testimonialSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
      
      // Next button click
      nextBtn.addEventListener('click', function() {
        if (currentIndex < testimonialCards.length - 1) {
          currentIndex++;
          updateSlider();
        } else {
          // Loop back to first slide
          currentIndex = 0;
          updateSlider();
        }
      });
      
      // Previous button click
      prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
          currentIndex--;
          updateSlider();
        } else {
          // Loop to last slide
          currentIndex = testimonialCards.length - 1;
          updateSlider();
        }
      });
      
      // Auto slide every 5 seconds
      setInterval(function() {
        if (currentIndex < testimonialCards.length - 1) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateSlider();
      }, 5000);
    }
    
    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
      const target = parseInt(element.getAttribute('data-count'));
      const suffix = element.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60fps
      let current = 0;
      
      const timer = setInterval(function() {
        current += step;
        
        if (current >= target) {
          element.textContent = target + suffix;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + suffix;
        }
      }, 16);
    }
    
    // Intersection Observer for counter animation
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      statNumbers.forEach(stat => {
        observer.observe(stat);
      });
    } else {
      // Fallback for browsers that don't support Intersection Observer
      statNumbers.forEach(stat => {
        animateCounter(stat);
      });
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(function() {
          submitBtn.textContent = 'Message Sent!';
          
          // Reset form
          contactForm.reset();
          
          // Reset button after 3 seconds
          setTimeout(function() {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 3000);
        }, 1500);
      });
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
      currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          window.scrollTo({
            top: targetElement.offsetTop - 70, // Adjust for navbar height
            behavior: 'smooth'
          });
        }
      });
    });
  });