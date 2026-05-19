// script.js

document.addEventListener('DOMContentLoaded', () => {
  // FAQ accordion toggle
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      answer.classList.toggle('hidden');
      btn.querySelector('i').classList.toggle('fa-rotate-180');
    });
  });

  // Modal form open/close
  const orderModal = document.getElementById('orderModal');
  const buyNowBtn = document.getElementById('buyNowBtn');
  const bottomBuyBtn = document.getElementById('bottomBuy');
  const modalClose = document.getElementById('modalClose');

  buyNowBtn.addEventListener('click', () => orderModal.classList.remove('hidden'));
  bottomBuyBtn.addEventListener('click', () => orderModal.classList.remove('hidden'));
  modalClose.addEventListener('click', () => orderModal.classList.add('hidden'));

  // Quantity increment/decrement
  const qtyInput = document.getElementById('quantity');
  document.getElementById('increaseQty').addEventListener('click', () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
    updateTotal();
  });
document.getElementById('decreaseQty').addEventListener('click', () => {
    if (qtyInput.value > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    updateTotal();
  });

  // Shipping area change
  const shippingArea = document.getElementById('shippingArea');
  shippingArea.addEventListener('change', updateTotal);

  // Payment method toggle details
  const paymentRadios = document.getElementsByName('payment');
  const paymentDetails = document.getElementById('paymentDetails');
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if ((radio.value === 'Bkash' || radio.value === 'Nagad') && radio.checked) {
        paymentDetails.classList.remove('hidden');
      } else if (radio.value === 'COD' && radio.checked) {
        paymentDetails.classList.add('hidden');
      }
    });
  });

  // Calculate total amount (price 699 + shipping)
  function updateTotal() {
    const price = 699;
    const qty = parseInt(qtyInput.value);
    let subtotal = price * qty;
    const area = shippingArea.value;
    let shipping = 0;
    if (area === 'Inside Dhaka') shipping = 70;
    else if (area === 'Outside Dhaka') shipping = 130;
    const total = subtotal + shipping;
    document.getElementById('totalAmount').value = '৳' + total;
  }
  updateTotal();

  // Handle form submission to Telegram
  const form = document.getElementById('orderForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = form.customerName.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const area = form.shippingArea.value;
    const paymentMethod = form.payment.value;
    if (!name || !phone || !address || !area) {
      alert('Please fill all required fields.');
      return;
    }
    // Build Telegram message
    const product = form.product.value;
    const quantity = form.quantity.value;
    const color = form.color.value;
    const transaction = form.transactionId.value || 'N/A';
    const total = document.getElementById('totalAmount').value;
    let message = '<b>New Order 📦</b>\n';
    message += `<b>Product:</b> ${product}\n`;
    message += `<b>Quantity:</b> ${quantity}\n`;
    message += `<b>Color:</b> ${color}\n`;
    message += `<b>Name:</b> ${name}\n`;
    message += `<b>Phone:</b> ${phone}\n`;
    message += `<b>Address:</b> ${address}\n`;
    message += `<b>Area:</b> ${area}\n`;
    message += `<b>Payment:</b> ${paymentMethod}\n`;
    if (paymentMethod === 'Bkash' || paymentMethod === 'Nagad') {
      message += `<b>Trans ID:</b> ${transaction}\n`;
    }
    message += `<b>Total:</b> ${total}`;

    // Send via Telegram Bot API (GET request)【25†L214-L220】
    const token = '8707010960:AAHpfxcSPLNJevm3MEF6rERkngB7MN1d6Sg';
    const chatId = '8830497708';
    const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&parse_mode=HTML&text=` + encodeURIComponent(message);
    fetch(url)
      .then(response => {
        if (response.ok) {
          alert('Order placed successfully!');
          form.reset();
          updateTotal();
          paymentDetails.classList.add('hidden');
orderModal.classList.add('hidden');
        } else {
          alert('Error placing order. Please try again.');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error placing order.');
      });
  });

  // Scroll-to-top button logic
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) scrollTopBtn.classList.remove('hidden');
    else scrollTopBtn.classList.add('hidden');
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Fake live order notifications
  const liveOrderPopup = document.getElementById('liveOrderPopup');
  const liveOrderText = document.getElementById('liveOrderText');
  let orderCount = 1;
  setInterval(() => {
    liveOrderText.textContent = `Someone just placed an order ${orderCount} minutes ago!`;
    liveOrderPopup.classList.remove('hidden');
    setTimeout(() => liveOrderPopup.classList.add('hidden'), 5000);
    orderCount += Math.floor(Math.random() * 3) + 1;
  }, 30000);

  // Countdown timer (20-minute countdown example)
  let timeLeft = 20 * 60;
  const timerEl = document.getElementById('timer');
  setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const secs = String(timeLeft % 60).padStart(2, '0');
      timerEl.textContent = `00:${mins}:${secs}`;
    }
  }, 1000);
});
