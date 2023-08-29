$(document).ready(function() {
    const cart = [];

    $(".add-to-cart-btn").click(function() {
        const productName = $(this).data("product-name");
        const productPrice = parseFloat($(this).data("product-price"));

        const existingProduct = cart.find(item => item.name === productName);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: 1 });
        }

        updateCartUI();
    });

    function updateCartUI() {
        const cartItemsList = $("#cart-items");
        const cartTotal = $("#cart-total");

        cartItemsList.empty();
        let total = 0;

        cart.forEach(item => {
            const li = `<li>${item.name} - Qty: ${item.quantity} - Rs. ${(item.price * item.quantity).toFixed(2)} <button class="increase-qty-btn" data-product-name="${item.name}">+</button> <button class="decrease-qty-btn" data-product-name="${item.name}">-</button> <button class="remove-item-btn" data-product-name="${item.name}">Remove</button></li>`;
            cartItemsList.append(li);
            total += item.price * item.quantity;
        });

        cartTotal.text(`Total: Rs. ${total.toFixed(2)}`);
    }

    $("#checkout-button").click(function() {
        const queryString = cart.map(item => `name=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}`).join('&');
        const checkoutUrl = `/checkout?${queryString}`;
        window.location.href = checkoutUrl;
    });

    $("#clear-cart-button").click(function() {
        cart.length = 0;
        updateCartUI();
    });

    $(document).on("click", ".increase-qty-btn", function() {
        const productName = $(this).data("product-name");

        for (const item of cart) {
            if (item.name === productName) {
                item.quantity += 1;
                updateCartUI();
                break;
            }
        }
    });

    $(document).on("click", ".decrease-qty-btn", function() {
        const productName = $(this).data("product-name");

        for (const item of cart) {
            if (item.name === productName) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                    updateCartUI();
                }
                break;
            }
        }
    });

    $(document).on("click", ".remove-item-btn", function() {
        const productName = $(this).data("product-name");
        const index = cart.findIndex(item => item.name === productName);
        
        if (index !== -1) {
            cart.splice(index, 1);
            updateCartUI();
        }
    });
});
