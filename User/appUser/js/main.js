
// Cart state (using memory instead of localStorage for Claude.ai compatibility)
let cart = [];
let products = [];
let currentSlide = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    initCarousel();    
});

// API
async function loadProducts() {
    try {
        const response = await fetch('https://684981f845f4c0f5ee71c0a8.mockapi.io/khoHang');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Lỗi khi tải sản phẩm:', error);
        document.getElementById('productsGrid').innerHTML = '<div class="loading">Không thể tải sản phẩm</div>';
    }
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');

    if (products.length === 0) {
        grid.innerHTML = '<div class="loading">Không có sản phẩm nào</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.img}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x250?text=No+Image'">
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <p class="product-desc">${product.desc}</p>
                        <div class="product-specs">
                            <div><strong>Màn hình:</strong> ${product.screen}</div>
                            <div><strong>Camera sau:</strong> ${product.backCamera}</div>
                            <div><strong>Camera trước:</strong> ${product.frontCamera}</div>
                        </div>
                        <div class="product-price">${formatPrice(product.price)}</div>
                        <button class="add-to-cart-btn"  onclick="addToCart('${product.id}')">
                            🛒 Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            `).join('');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCartDisplay();

    // Show success animation
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '✅ Đã thêm!';
    button.style.background = '#27ae60';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Giỏ hàng trống</div>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.img}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
                        </div>
                        <div class="quantity-controls">
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                `).join('');
        checkoutBtn.disabled = false;
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Tổng: ${formatPrice(total)}`;
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

// Close cart when clicking outside
document.getElementById('cartModal').addEventListener('click', function (e) {
    if (e.target === this) {
        toggleCart();
    }
});

// Cart Action Functions
function continueShopping() {
    toggleCart();
    // Scroll to products section
    document.querySelector('.products-section').scrollIntoView({
        behavior: 'smooth'
    });
}

function checkout() {
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Alert Thông Báo Thanh Toán
    const orderSummary = cart.map(item =>
        `${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`
    ).join('\n');

    const confirmMessage = `🛒 XÁC NHẬN ĐẶT HÀNG\n\n` +
        `Sản phẩm:\n${orderSummary}\n\n` +
        `Tổng số lượng: ${totalItems} sản phẩm\n` +
        `Tổng tiền: ${formatPrice(total)}\n\n` +
        `Bạn có muốn tiến hành thanh toán không?`;

    if (confirm(confirmMessage)) {
        // Simulate payment process
        const checkoutBtn = document.getElementById('checkoutBtn');
        const originalText = checkoutBtn.textContent;

        checkoutBtn.textContent = '⏳ Đang xử lý...';
        checkoutBtn.disabled = true;

        setTimeout(() => {
            alert('🎉 Đặt hàng thành công!\n\nCảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ với bạn sớm nhất!');

            // Clear cart after successful checkout
            cart = [];
            updateCartDisplay();
            toggleCart();

            checkoutBtn.textContent = originalText;
        }, 2000);
    }
   
}

// Carousel Functions
function initCarousel() {
    const carousel = document.getElementById('carousel');
    const nav = document.getElementById('carouselNav');
    const slides = carousel.children;

    // Create navigation dots
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot';
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        nav.appendChild(dot);
    }

    // Auto-play carousel
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }, 4000);
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const carousel = document.getElementById('carousel');
    const dots = document.querySelectorAll('.carousel-dot');

    carousel.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}
