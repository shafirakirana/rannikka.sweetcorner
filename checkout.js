const cartData = JSON.parse(localStorage.getItem('rannikka_cart')) || [];
const summaryList = document.getElementById('summary-list');
const summaryTotal = document.getElementById('summary-total');

let totalBayar = 0;

if (cartData.length === 0) {
    summaryList.innerHTML = '<p style="color:#aaa;">No orders found in your history.</p>';
} else {
    cartData.forEach(item => {
        let subtotal = item.price * item.qty;
        totalBayar += subtotal;

        let itemRow = document.createElement('div');
        itemRow.className = 'order-item';
        itemRow.innerHTML = `
            <span>${item.name} (x${item.qty})</span>
            <span>IDR ${subtotal.toLocaleString('id-ID')}</span>
        `;
        summaryList.appendChild(itemRow);
    });
    
    summaryTotal.innerText = `Total: IDR ${totalBayar.toLocaleString('id-ID')}`;
}


document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();

    if (cartData.length === 0) {
        Swal.fire({
            title: 'Oops!',
            text: 'No item found in your cart!',
            icon: 'error',
            confirmButtonColor: '#6C5141',
            background: '#111111',
            color: '#fff'
        });
        return;
    }


    const nama = document.getElementById('nama').value;
    const hp = document.getElementById('hp').value;
    const reservationInput = document.getElementById('reservation-date').value;
    const pembayaran = document.getElementById('pembayaran').value;
    
    const dateObject = new Date(reservationInput);
    const opsiFormat = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const reservationWaktu = dateObject.toLocaleDateString('id-ID', opsiFormat);

    document.getElementById('reservation-date-formatted').value = reservationWaktu;

    let teksMenuEmail = "";
    cartData.forEach((item, index) => {
        teksMenuEmail += `${index + 1}. ${item.name} x${item.qty} (IDR ${(item.price * item.qty).toLocaleString('id-ID')})\n`;
    });
    
    document.getElementById('hidden-cart-items').value = teksMenuEmail;
    document.getElementById('hidden-total-pay').value = `IDR ${totalBayar.toLocaleString('id-ID')}`;
    const formIni = this; 

    
    Swal.fire({
        title: 'Thank you!',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#6C5141', 
        background: '#111111',          
        color: '#D8CFBC',              
        iconColor: '#D8CFBC'           
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('rannikka_cart');
            formIni.submit();
        }
    });
});
