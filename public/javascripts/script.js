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
    let quantityElement = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(quantityElement.value);

    // Allow sending request to backend even if quantity is 1 and count is -1
    $.ajax({
        url: '/change-product-quantity',
        method: 'POST',
        data: {
            productId,
            userId,
            count
        },
        success: (response) => {
            if (response.status) {
                if (response.removeProduct) {
                    alert("Product removed from cart.");
                    location.reload();
                } else {
                    quantityElement.value = currentQuantity + count;


                }

            }
        }
    });
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
}



