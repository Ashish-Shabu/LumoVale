function addToCart(productId) {
    $.ajax({
        url: "/add-to-cart/" + productId,
        method: "GET",
        success: (response) => {
            if (response.status) {
                alert("Product added to cart successfully!");
                document.getElementById("cart-count").innerText = `${response.cartCount}`;
            } else {
                alert("Failed to add product to cart.");
            }
        }
    });
}


function changeQuantity(productId, userId, count) {
    let quantityInput = document.getElementById(`quantity-${productId}`);
    let currentQty = parseInt(quantityInput.value);

    $.ajax({
        url: '/change-product-quantity',
        method: 'POST',
        data: {
            productId,
            userId,
            count
        },
        success: (response) => {
            if (response.removeProduct) {
                location.reload(); // if quantity is 0, remove the item
            } else {
                // Update the quantity input value
                quantityInput.value = currentQty + count;

                // Update the subtotal for this product
                const unitPrice = parseFloat(document.querySelector(`tr[data-product-id="${productId}"] .unit-price`).innerText);
                const newQty = parseInt(document.getElementById(`quantity-${productId}`).value);
                const newSubtotal = unitPrice * newQty;

                // Update subtotal in cart view
                document.getElementById(`subtotal-${productId}`).innerText = newSubtotal.toFixed(2);

                // Update subtotal on card body as well
                const subtotalDisplay = document.querySelector(`#quantity-${productId}`).closest('.row').querySelector('h5.mb-0');
                if (subtotalDisplay) {
                    subtotalDisplay.innerText = '₹' + newSubtotal.toFixed(2);
                }

                // Update overall total
                updateCartTotal();
            }
        }
    });
}

function updateCartTotal() {
    let total = 0;
    document.querySelectorAll('.subtotal').forEach((el) => {
        total += parseFloat(el.innerText);
    });
    document.getElementById('order-summary-total').innerText = total.toFixed(2);
}

function populateOrderSummary() {
    let total = 0;

    document.querySelectorAll("#order-summary-body tr").forEach(row => {
        const productId = row.getAttribute("data-product-id");
        const qty = parseInt(document.getElementById(`quantity-${productId}`).value);
        const unitPrice = parseFloat(row.querySelector(".unit-price").innerText);
        const subtotal = qty * unitPrice;

        row.querySelector(`#summary-qty-${productId}`).innerText = qty;
        row.querySelector(`#subtotal-${productId}`).innerText = subtotal;

        total += subtotal;
    });

    document.getElementById("order-summary-total").innerText = total;
    updateCartTotal();
}



