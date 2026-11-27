
/* =================================
   MELORA - SHOPPING CART & CHECKOUT
================================= */

// =========================
// 1. INITIAL CART
// =========================

// Mengambil data keranjang dari localStorage
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("meloraCart")) || [];
} catch (error) {
    cart = [];
}

// Nomor WhatsApp sementara.
// Ganti dengan nomor WhatsApp toko MELORA.
const WHATSAPP_NUMBER = "6285133227786";


// =========================
// 2. SAVE CART
// =========================

function saveCart() {
    localStorage.setItem("meloraCart", JSON.stringify(cart));
}



// =========================
// 3. ADD PRODUCT TO CART
// =========================

function addToCart(name, price) {

    const existingProduct = cart.find(
        item => item.name === name
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    updateCart();

    showToast(name);
}


// =========================
// 4. TOAST NOTIFICATION
// =========================

function showToast(productName) {

    let toast = document.getElementById("meloraToast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "meloraToast";
        toast.className = "melora-toast";

        document.body.appendChild(toast);

    }

    toast.innerHTML = `
        <span class="toast-icon">✓</span>
        <div class="toast-content">
            <strong>Added to your bag!</strong>
            <span>${productName} has been added to your bag.</span>
        </div>
    `;

    toast.classList.add("show");

    clearTimeout(window.meloraToastTimer);

    window.meloraToastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


// =========================
// 4. UPDATE CART
// =========================

function updateCart() {

    saveCart();

    const cartCount = document.getElementById("cartCount");

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    renderCart();
}


// =========================
// 5. RENDER CART ITEMS
// =========================

function renderCart() {

    const cartItems = document.getElementById("cartItems");
    const cartEmpty = document.getElementById("cartEmpty");
    const cartFooter = document.getElementById("cartFooter");
    const cartTotal = document.getElementById("cartTotal");

    // Jika bukan halaman homepage, hentikan fungsi
    if (!cartItems || !cartEmpty || !cartFooter || !cartTotal) {
        return;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartEmpty.style.display = "block";
        cartFooter.style.display = "none";

        return;
    }

    cartEmpty.style.display = "none";
    cartFooter.style.display = "block";

    let total = 0;

    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>
                    Rp${item.price.toLocaleString("id-ID")}
                </p>

                <div class="cart-quantity">

                    <button
                        type="button"
                        onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        type="button"
                        onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>

            </div>

            <div class="cart-item-right">

                <strong>
                    Rp${subtotal.toLocaleString("id-ID")}
                </strong>

                <button
                    type="button"
                    class="remove-item"
                    onclick="removeItem(${index})">
                    Remove
                </button>

            </div>

        `;

        cartItems.appendChild(cartItem);

    });

    cartTotal.textContent =
        "Rp" + total.toLocaleString("id-ID");
}


// =========================
// 6. CHANGE QUANTITY
// =========================

function changeQuantity(index, amount) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}



// =========================
// 7. REMOVE PRODUCT
// =========================

let pendingRemoveIndex = null;

function removeItem(index) {

    if (!cart[index]) {
        return;
    }

    pendingRemoveIndex = index;

    const modal = document.getElementById("removeModal");
    const productName = document.getElementById("removeProductName");

    productName.textContent = cart[index].name;

    modal.classList.add("active");
}


// =========================
// 8. CLOSE REMOVE MODAL
// =========================

function closeRemoveModal() {

    const modal = document.getElementById("removeModal");

    modal.classList.remove("active");

    pendingRemoveIndex = null;
}


// =========================
// 9. CONFIRM REMOVE PRODUCT
// =========================

function confirmRemoveItem() {

    if (
        pendingRemoveIndex === null ||
        !cart[pendingRemoveIndex]
    ) {
        closeRemoveModal();
        return;
    }

    const productName = cart[pendingRemoveIndex].name;

    cart.splice(pendingRemoveIndex, 1);

    updateCart();

    closeRemoveModal();

    showToast(`${productName} removed from your bag.`);
}


// =========================
// 8. SHOW CART
// =========================

function showCart() {

    const overlay = document.getElementById("cartOverlay");

    if (!overlay) {
        return;
    }

    overlay.classList.add("active");

    renderCart();
}


// =========================
// 9. CLOSE CART
// =========================

function closeCart() {

    const overlay = document.getElementById("cartOverlay");

    if (overlay) {
        overlay.classList.remove("active");
    }
}


// =========================
// 10. OPEN CHECKOUT PAGE
// =========================

function openCheckout() {

    if (cart.length === 0) {

        alert("Keranjang kamu masih kosong.");

        return;
    }

    // Simpan keranjang sebelum berpindah halaman
    saveCart();

    // Buka halaman checkout
    window.location.href = "checkout.html";
}


// =========================
// 11. RENDER CHECKOUT
// =========================

function renderCheckout() {

    const checkoutItems = document.getElementById("checkoutItems");
    const checkoutTotal = document.getElementById("checkoutTotal");

    // Fungsi hanya berjalan di halaman checkout
    if (!checkoutItems || !checkoutTotal) {
        return;
    }

    checkoutItems.innerHTML = "";

    if (cart.length === 0) {

        checkoutItems.innerHTML = `
            <p>Keranjang kamu masih kosong.</p>
            <a href="index.html">Kembali ke menu MELORA</a>
        `;

        checkoutTotal.textContent = "Rp0";

        return;
    }

    let total = 0;

    cart.forEach(item => {

        const subtotal = item.price * item.quantity;

        total += subtotal;

        const checkoutItem = document.createElement("div");

        checkoutItem.className = "checkout-item";

        const productName = document.createElement("span");

        productName.textContent =
            `${item.name} x ${item.quantity}`;

        const productPrice = document.createElement("strong");

        productPrice.textContent =
            "Rp" + subtotal.toLocaleString("id-ID");

        checkoutItem.appendChild(productName);
        checkoutItem.appendChild(productPrice);

        checkoutItems.appendChild(checkoutItem);

    });

    checkoutTotal.textContent =
        "Rp" + total.toLocaleString("id-ID");
}


// =========================
// MELORA PREMIUM ALERT MODAL
// =========================

function showAlertModal(title, message) {

    const modal = document.getElementById("alertModal");

    if (!modal) {
        alert(message);
        return;
    }

    const modalTitle = document.getElementById("alertTitle");
    const modalMessage = document.getElementById("alertMessage");
    const modalIcon = modal.querySelector(".alert-modal-icon");

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    if (title === "Your Bag Is Empty") {
        modalIcon.textContent = "♡";
    } else if (title === "Invalid WhatsApp Number") {
        modalIcon.textContent = "!";
    } else {
        modalIcon.textContent = "✦";
    }

    modal.classList.add("active");
}

// =========================
// CLOSE ALERT MODAL
// =========================

function closeAlertModal() {

    const modal = document.getElementById("alertModal");

    if (modal) {
        modal.classList.remove("active");
    }

}


// =========================
// 12. SEND ORDER TO WHATSAPP
// =========================

function sendOrderToWhatsApp(event) {

    event.preventDefault();

    if (cart.length === 0) {

        showAlertModal(
            "Your Bag Is Empty",
            "Please add some delicious treats to your bag before checkout."
        );

        return;
    }

    const customerName =
        document.getElementById("customerName").value.trim();

    const customerPhone =
        document.getElementById("customerPhone").value.trim();

    const customerAddress =
        document.getElementById("customerAddress").value.trim();

    const customerNote =
        document.getElementById("customerNote").value.trim();

    if (!customerName || !customerPhone || !customerAddress) {

        showAlertModal(
            "Incomplete Information",
            "Please fill in your name, WhatsApp number, and delivery address."
        );

        return;
    }

    const cleanPhone = customerPhone.replace(/[\s\-+()]/g, "");

    if (!/^(08\d{8,11}|628\d{8,11})$/.test(cleanPhone)) {

        showAlertModal(
            "Invalid WhatsApp Number",
            "Please enter a valid Indonesian WhatsApp number."
        );

        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
    );

    let message = `*MELORA - NEW ORDER*\n`;
    message += `========================\n\n`;

    message += `*CUSTOMER DETAILS*\n`;
    message += `Nama: ${customerName}\n`;
    message += `WhatsApp: ${customerPhone}\n`;
    message += `Alamat: ${customerAddress}\n\n`;

    message += `*ORDER DETAILS*\n`;

    cart.forEach((item, index) => {

        const subtotal = item.price * item.quantity;

        message += `${index + 1}. ${item.name}\n`;
        message += `${item.quantity} x Rp${item.price.toLocaleString("id-ID")}\n`;
        message += `Subtotal: Rp${subtotal.toLocaleString("id-ID")}\n\n`;

    });

    message += `========================\n`;
    message += `*TOTAL: Rp${total.toLocaleString("id-ID")}*\n`;
    message += `========================\n\n`;

    if (customerNote) {
        message += `Catatan: ${customerNote}\n\n`;
    }

    message += `Terima kasih telah memilih MELORA!`;

    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

    sessionStorage.setItem("meloraPendingOrder", "true");

window.open(whatsappURL, "_blank");

}


// =========================
// 13. CATEGORY FILTER
// =========================

function setupCategoryFilter() {

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const productCards =
        document.querySelectorAll(".product-card");

    filterButtons.forEach(button => {

        button.addEventListener("click", function() {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            this.classList.add("active");

            const selectedCategory = this.dataset.filter;

            productCards.forEach(card => {

                const category = card.dataset.category;

                if (
                    selectedCategory === "all" ||
                    category === selectedCategory
                ) {

                    card.style.display = "";

                } else {

                    card.style.display = "none";

                }

            });

        });

    });

}


// =========================
// 14. MOBILE NAVIGATION
// =========================

function toggleMenu() {

    const navMenu = document.getElementById("navMenu");

    if (navMenu) {
        navMenu.classList.toggle("show");
    }

}


// =========================
// 15. INITIALIZE WEBSITE
// =========================

document.addEventListener("DOMContentLoaded", function() {

    // Close Shopping Bag
    const closeButton =
        document.getElementById("closeCart");

    if (closeButton) {

        closeButton.addEventListener("click", closeCart);

    }


    // Click outside Shopping Bag
    const cartOverlay =
        document.getElementById("cartOverlay");

    if (cartOverlay) {

        cartOverlay.addEventListener("click", function(event) {

            if (event.target === cartOverlay) {
                closeCart();
            }

        });

    }


    // Close Shopping Bag with Escape
    document.addEventListener("keydown", function(event) {

        if (event.key === "Escape") {
            closeCart();
        }

    });


    // Category Filter
    setupCategoryFilter();


    // Close mobile navigation after selecting a link
    const navLinks =
        document.querySelectorAll(".nav-menu a");

    navLinks.forEach(link => {

        link.addEventListener("click", function() {

            const navMenu =
                document.getElementById("navMenu");

            if (navMenu) {
                navMenu.classList.remove("show");
            }

        });

    });


    // Submit Checkout Form
    const checkoutForm =
        document.getElementById("checkoutForm");

    if (checkoutForm) {

        checkoutForm.addEventListener(
            "submit",
            sendOrderToWhatsApp
        );

    }


    // Update Cart Count and Homepage Cart
    updateCart();


    // Render Order Summary on Checkout Page
    renderCheckout();


    console.log("MELORA berhasil dijalankan!");

});

 
// =========================
// 16. ORDER SENT CONFIRMATION
// =========================

function showOrderSentConfirmation() {

    const pendingOrder =
        sessionStorage.getItem("meloraPendingOrder");

    const modal =
        document.getElementById("orderSentModal");

    if (
        pendingOrder === "true" &&
        modal &&
        document.visibilityState === "visible"
    ) {

        sessionStorage.removeItem("meloraPendingOrder");

        modal.classList.add("active");

    }

}


// =========================
// 17. CLOSE ORDER CONFIRMATION
// =========================

function closeOrderSentModal() {

    const modal =
        document.getElementById("orderSentModal");

    if (modal) {
        modal.classList.remove("active");
    }

}


// =========================
// 18. CONFIRM ORDER SENT
// =========================


function confirmOrderSent() {

    // Kosongkan keranjang
    cart = [];

    // Perbarui localStorage dan tampilan keranjang
    updateCart();

    // Tutup modal konfirmasi
    closeOrderSentModal();

    // Kembali ke halaman utama MELORA
    window.location.href = "index.html";

}


// =========================
// 19. DETECT RETURN FROM WHATSAPP
// =========================

document.addEventListener("visibilitychange", function() {

    if (document.visibilityState === "visible") {
        showOrderSentConfirmation();
    }

});
// =========================
// 20. ACTIVE NAVIGATION
// =========================

const navItems = document.querySelectorAll(".nav-menu a");

navItems.forEach(link => {

    link.addEventListener("click", function() {

        navItems.forEach(item => {
            item.classList.remove("active");
        });

        this.classList.add("active");

    });

});