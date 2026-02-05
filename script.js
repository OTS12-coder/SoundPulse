// Product Data with Images
const products = [
    {
        id: 1,
        name: 'Pulse Pro',
        description: 'Premium wireless earbuds with advanced features for everyday listening',
        price: 149,
        image: 'Assets/Images/1.jpg',
        badge: 'Best Seller',
        specs: [
            { icon: 'battery-three-quarters', text: '30h Battery' },
            { icon: 'shield-halved', text: '35dB ANC' },
            { icon: 'water', text: 'IPX5' }
        ],
        fullSpecs: {
            battery: '30 hours',
            anc: '35dB',
            waterResistance: 'IPX5',
            spatialAudio: true,
            wirelessCharging: false,
            driverSize: '10mm',
            transparencyMode: true
        }
    },
    {
        id: 2,
        name: 'Pulse Elite',
        description: 'Enhanced audio experience with superior noise cancellation',
        price: 199,
        image: 'Assets/Images/2.jpg',
        badge: 'Popular',
        specs: [
            { icon: 'battery-full', text: '35h Battery' },
            { icon: 'shield-halved', text: '40dB ANC' },
            { icon: 'water', text: 'IPX6' }
        ],
        fullSpecs: {
            battery: '35 hours',
            anc: '40dB',
            waterResistance: 'IPX6',
            spatialAudio: true,
            wirelessCharging: true,
            driverSize: '11mm',
            transparencyMode: true
        }
    },
    {
        id: 3,
        name: 'Pulse Max',
        description: 'Ultimate flagship model with cutting-edge technology',
        price: 249,
        image: 'Assets/Images/3.jpg',
        badge: 'Premium',
        specs: [
            { icon: 'battery-full', text: '40h Battery' },
            { icon: 'shield-halved', text: '45dB ANC' },
            { icon: 'water', text: 'IPX7' }
        ],
        fullSpecs: {
            battery: '40 hours',
            anc: '45dB',
            waterResistance: 'IPX7',
            spatialAudio: true,
            wirelessCharging: true,
            driverSize: '12mm',
            transparencyMode: true
        }
    }
];

// Shopping Cart
let cart = [];
let selectedProducts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    setupEventListeners();
    initTheme();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.className = savedTheme + '-mode';
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.className = newTheme + '-mode';
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#themeToggle i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 0.1}s`;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-specs">
                    ${product.specs.map(spec => `
                        <span class="spec-badge">
                            <i class="fas fa-${spec.icon}"></i>
                            ${spec.text}
                        </span>
                    `).join('')}
                </div>
            </div>
            <div class="product-footer">
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                    <i class="fas fa-shopping-bag"></i>
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification('Added to cart!', 'success');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Removed from cart', 'info');
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = `$${total}`;
}

// Product Comparison System
function toggleProductSelection(productId) {
    const card = document.querySelector(`.selector-card[data-product="${productId}"]`);
    
    if (selectedProducts.includes(productId)) {
        selectedProducts = selectedProducts.filter(id => id !== productId);
        card.classList.remove('selected');
    } else {
        if (selectedProducts.length < 3) {
            selectedProducts.push(productId);
            card.classList.add('selected');
        } else {
            showNotification('You can only compare up to 3 products', 'warning');
        }
    }
    
    updateComparison();
}

function updateComparison() {
    const comparisonResult = document.getElementById('comparisonResult');
    
    if (selectedProducts.length < 2) {
        comparisonResult.innerHTML = `
            <p class="comparison-hint">Select 2 or 3 products to compare</p>
        `;
        return;
    }
    
    const selectedProductsData = products.filter(p => 
        selectedProducts.includes(p.id === 1 ? 'pro' : p.id === 2 ? 'elite' : 'max')
    );
    
    const specs = [
        { label: 'Price', key: 'price', format: (v) => `$${v}` },
        { label: 'Battery Life', key: 'battery' },
        { label: 'ANC Level', key: 'anc' },
        { label: 'Spatial Audio', key: 'spatialAudio', format: (v) => v ? '<i class="fas fa-check check-icon"></i>' : '<i class="fas fa-xmark x-icon"></i>' },
        { label: 'Water Resistance', key: 'waterResistance' },
        { label: 'Wireless Charging', key: 'wirelessCharging', format: (v) => v ? '<i class="fas fa-check check-icon"></i>' : '<i class="fas fa-xmark x-icon"></i>' },
        { label: 'Driver Size', key: 'driverSize' },
        { label: 'Transparency Mode', key: 'transparencyMode', format: (v) => v ? '<i class="fas fa-check check-icon"></i>' : '<i class="fas fa-xmark x-icon"></i>' }
    ];
    
    let tableHTML = `
        <div class="compare-table-wrapper">
            <table class="compare-table">
                <thead>
                    <tr>
                        <th>Specification</th>
                        ${selectedProductsData.map(p => `
                            <th>
                                <div class="model-header">
                                    <img src="${p.image}" alt="${p.name}">
                                    <span>${p.name}</span>
                                </div>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${specs.map(spec => `
                        <tr>
                            <td><strong>${spec.label}</strong></td>
                            ${selectedProductsData.map(p => {
                                const value = spec.key === 'price' ? p[spec.key] : p.fullSpecs[spec.key];
                                return `<td>${spec.format ? spec.format(value) : value}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    comparisonResult.innerHTML = tableHTML;
}

// Checkout Modal
function openCheckoutModal() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('modalOverlay');
    const invoiceDetails = document.getElementById('invoiceDetails');
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    // Render invoice items
    invoiceDetails.innerHTML = cart.map(item => `
        <div class="invoice-item">
            <div class="invoice-item-details">
                <div class="invoice-item-name">${item.name}</div>
                <div class="invoice-item-qty">Quantity: ${item.quantity}</div>
            </div>
            <div class="invoice-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    // Update totals
    document.getElementById('invoiceSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('invoiceTax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('invoiceTotal').textContent = `$${total.toFixed(2)}`;
    
    modal.classList.add('active');
    overlay.classList.add('active');
    closeCartSidebar();
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const overlay = document.getElementById('modalOverlay');
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function confirmOrder() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.1;
    const finalTotal = total + tax;
    
    showNotification(`Order confirmed! Total: $${finalTotal.toFixed(2)}`, 'success');
    
    setTimeout(() => {
        cart = [];
        updateCartUI();
        closeCheckoutModal();
    }, 100);
}

// Setup Event Listeners
function setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCart = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const confirmOrderBtn = document.getElementById('confirmOrder');
    
    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);
    
    // Open cart
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
    });
    
    // Close cart
    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', () => {
        closeCartSidebar();
        closeCheckoutModal();
    });
    
    // Checkout
    checkoutBtn.addEventListener('click', openCheckoutModal);
    
    // Modal controls
    closeModal.addEventListener('click', closeCheckoutModal);
    modalOverlay.addEventListener('click', closeCheckoutModal);
    confirmOrderBtn.addEventListener('click', confirmOrder);
    
    // Comparison selector cards
    document.querySelectorAll('.selector-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.dataset.product;
            toggleProductSelection(productId);
        });
    });
    
    // Smooth scrolling
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
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// Close Cart Sidebar
function closeCartSidebar() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    let gradient = 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)';
    if (type === 'success') gradient = 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)';
    if (type === 'warning') gradient = 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${gradient};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        font-weight: 600;
        animation: slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);