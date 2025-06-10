// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // ===== MOBILE MENU TOGGLE =====
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when a nav link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== ACTIVE NAVIGATION HIGHLIGHTING =====
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.querySelector('header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });
    
    // ===== ABOUT TABS =====
    function openTab(tabName) {
        // Hide all tab contents
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active-tab');
        });
        
        // Remove active class from all tab links
        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Show the selected tab content and add active class to the clicked tab link
        document.getElementById(tabName).classList.add('active-tab');
        document.querySelector(`.tab-link[onclick="openTab('${tabName}')"]`).classList.add('active');
    }
    
    // Make openTab function globally accessible
    window.openTab = openTab;
    
    // ===== FORM VALIDATION =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form inputs
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            
            // Get error elements
            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const subjectError = document.getElementById('subjectError');
            const messageError = document.getElementById('messageError');
            
            // Reset error messages
            nameError.textContent = '';
            emailError.textContent = '';
            subjectError.textContent = '';
            messageError.textContent = '';
            
            // Validate name
            if (name.value.trim() === '') {
                nameError.textContent = 'Name is required';
                name.focus();
                return false;
            }
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.value.trim() === '') {
                emailError.textContent = 'Email is required';
                email.focus();
                return false;
            } else if (!emailRegex.test(email.value.trim())) {
                emailError.textContent = 'Please enter a valid email address';
                email.focus();
                return false;
            }
            
            // Validate subject
            if (subject.value.trim() === '') {
                subjectError.textContent = 'Subject is required';
                subject.focus();
                return false;
            }
            
            // Validate message
            if (message.value.trim() === '') {
                messageError.textContent = 'Message is required';
                message.focus();
                return false;
            }
            
            // If all validations pass, show success message
            alert('Your message has been sent successfully!');
            contactForm.reset();
        });
    }
    
    // ===== PROJECT MODALS =====
    // This is an optional feature that could be implemented
    // to show project details in a modal when clicked
    
    // Get all project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const projectImage = card.querySelector('.project-image img');
        const projectTitle = card.querySelector('.project-info h3').textContent;
        
        // Add click event to view project link
        const viewLinks = card.querySelectorAll('.project-link');
        viewLinks.forEach(link => {
            if (link.innerHTML.includes('View')) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    // Here you could implement a modal to show project details
                    // For now, we'll just log to console
                    console.log(`Viewing project: ${projectTitle}`);
                });
            }
        });
    });
});