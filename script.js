// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const modal = document.getElementById('checkoutModal');
const closeModal = document.querySelector('.close');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutItems = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');

// Shopping Cart
let cart = [];

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Quick tabs functionality
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Shopping Cart Functions
function addToCart(item, price) {
    const existingItem = cart.find(cartItem => cartItem.name === item);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: item,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    updateCheckoutButton();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCheckoutButton();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCartDisplay();
        updateCheckoutButton();
    }
}

function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
    } else {
        let cartHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>€${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button onclick="updateQuantity(${index}, -1)" class="quantity-btn">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, 1)" class="quantity-btn">+</button>
                        <button onclick="removeFromCart(${index})" class="remove-btn">×</button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = cartHTML;
        cartTotal.textContent = total.toFixed(2);
    }
}

function updateCheckoutButton() {
    if (cart.length > 0) {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('disabled');
    } else {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('disabled');
    }
}

// Add to cart event listeners
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const item = button.getAttribute('data-item');
        const price = parseFloat(button.getAttribute('data-price'));
        
        if (item === 'cd') {
            addToCart('"Celebrating 45 Years" CD', price);
        } else if (item === 'usb') {
            addToCart('Short Film USB Stick', price);
        }
        
        // Show success message
        showNotification('Item added to cart!', 'success');
    });
});

// Checkout functionality
checkoutBtn.addEventListener('click', () => {
    if (cart.length > 0) {
        openCheckoutModal();
    }
});

function openCheckoutModal() {
    let checkoutHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        checkoutHTML += `
            <div class="checkout-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>€${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = checkoutHTML;
    checkoutTotal.textContent = total.toFixed(2);
    modal.style.display = 'block';
}

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Checkout form submission
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const checkoutData = {
        name: formData.get('checkoutName'),
        email: formData.get('checkoutEmail'),
        phone: formData.get('checkoutPhone'),
        address: formData.get('checkoutAddress'),
        items: cart,
        total: parseFloat(cartTotal.textContent)
    };
    
    // Simulate order processing
    showNotification('Processing your order...', 'info');
    
    setTimeout(() => {
        showNotification('Order placed successfully! We will contact you soon.', 'success');
        cart = [];
        updateCartDisplay();
        updateCheckoutButton();
        modal.style.display = 'none';
        e.target.reset();
    }, 2000);
});

// Booking form submission
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookingData = {
        name: formData.get('bookingName'),
        email: formData.get('bookingEmail'),
        phone: formData.get('bookingPhone'),
        date: formData.get('bookingDate'),
        time: formData.get('bookingTime'),
        purpose: formData.get('bookingPurpose'),
        guests: formData.get('bookingGuests'),
        message: formData.get('bookingMessage')
    };
    
    // Validate date
    const selectedDate = new Date(bookingData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Please select a future date.', 'error');
        return;
    }
    
    // Simulate booking submission
    showNotification('Submitting your booking request...', 'info');
    
    setTimeout(() => {
        showNotification('Booking request submitted successfully! We will contact you within 24 hours to confirm.', 'success');
        e.target.reset();
    }, 2000);
});

// Contact form submission
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const contactData = {
        name: formData.get('contactName'),
        email: formData.get('contactEmail'),
        phone: formData.get('contactPhone'),
        subject: formData.get('contactSubject'),
        message: formData.get('contactMessage')
    };
    
    // Simulate message sending
    showNotification('Sending your message...', 'info');
    
    setTimeout(() => {
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        e.target.reset();
    }, 2000);
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : '#17A2B8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .cart-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .cart-item:last-child {
        border-bottom: none;
    }
    
    .cart-item-details h4 {
        margin: 0;
        font-size: 1rem;
    }
    
    .cart-item-details p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .quantity-btn {
        background: var(--wine);
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .remove-btn {
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        cursor: pointer;
        font-size: 1.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .checkout-item {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .checkout-item:last-child {
        border-bottom: none;
    }
    
    .checkout-total {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 2px solid #eee;
        font-size: 1.2rem;
    }
`;
document.head.appendChild(style);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'var(--white)';
        navbar.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .team-member, .faq-item, .tab-card');
    animateElements.forEach(el => observer.observe(el));
});

// Initialize cart display
updateCartDisplay();
updateCheckoutButton();

// Set minimum date for booking form
const bookingDateInput = document.getElementById('bookingDate');
if (bookingDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.setAttribute('min', today);
}

console.log('Blarney Street Community Association website loaded successfully!');
