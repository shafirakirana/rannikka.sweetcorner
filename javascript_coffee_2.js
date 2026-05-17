document.addEventListener("DOMContentLoaded", () => {

    // ==================== 1. NAVBAR & SIDEBAR TOGGLE ====================
    const navbarNav = document.querySelector('.navbar-nav');
    document.querySelector('#hamburger-menu').onclick = () => {
        navbarNav.classList.toggle('active');
    };

    const searchForm = document.querySelector('.search-form');
    document.querySelector('#search').onclick = (e) => {
        e.preventDefault();
        searchForm.classList.toggle('active');
        navbarNav.classList.remove('active');
        shoppingCart.classList.remove('active');
    };

    const shoppingCart = document.querySelector('.shopping-cart');
    document.querySelector('#shopping-cart').onclick = (e) => {
        e.preventDefault();
        shoppingCart.classList.toggle('active');
        navbarNav.classList.remove('active');
        searchForm.classList.remove('active');
    };

    // Klik di luar sidebar untuk menutup
    const hamburger = document.querySelector('#hamburger-menu');
    document.addEventListener('click', function(e) { 
        if(!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
            navbarNav.classList.remove('active');
        }
        if(!document.querySelector('#search').contains(e.target) && !searchForm.contains(e.target)) {
            searchForm.classList.remove('active');
        }
        if(!document.querySelector('#shopping-cart').contains(e.target) && !shoppingCart.contains(e.target)) {
            shoppingCart.classList.remove('active');
        }
    });

    // ==================== 2. LOGIKA KERANJANG BELANJA (SHOPPING CART) ====================
    function updateTotal() {
      let items = document.querySelectorAll(".cart-item");
      let total = 0;

      items.forEach(item => {
        let price = item.querySelector(".price").dataset.price;
        let qty = item.querySelector(".count").innerText;
        total += price * qty;
      });

      const totalElement = document.getElementById("total");
      if(totalElement) {
         totalElement.innerText = total.toLocaleString('id-ID');
      }
    }

    window.increase = function(btn) {
      let item = btn.parentElement;
      let count = item.querySelector(".count");
      count.innerText = parseInt(count.innerText) + 1;
      updateTotal();
    }

    window.decrease = function(btn) {
      let item = btn.parentElement;
      let count = item.querySelector(".count");
      let value = parseInt(count.innerText);
      if (value > 0) {
        count.innerText = value - 1;
      }
      updateTotal();
    }

    updateTotal();

    // ==================== 3. LOGIKA FILTER KATEGORI & PENCARIAN PINTAR ====================
    const menuCards = document.querySelectorAll('.menu-card');
    const searchBox = document.querySelector('#search-box');
    const noResult = document.querySelector('#no-result');
    let currentCategory = 'fav'; // Menyimpan kategori yang sedang aktif

    // Tampilan Awal: Hanya munculkan 8 menu terpopuler (data-fav="true") saat web pertama dibuka
    menuCards.forEach(card => {
        if (card.dataset.fav !== 'true') {
            card.style.display = 'none';
        }
    });

    // Fungsi Filter Tombol Kategori
    window.filterMenu = function(category) {
        currentCategory = category;
        if (searchBox) searchBox.value = ""; // Bersihkan kolom search kalau ganti kategori
        if (noResult) noResult.style.display = 'none';

        // Atur style tombol aktif
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        if(event) {
            event.target.classList.add('active');
        }

        // Saring menu berdasarkan data-attribute HTML
        menuCards.forEach(card => {
            const isFav = card.dataset.fav === 'true';
            const cardCat = card.dataset.category;

            if (category === 'all') {
                card.style.display = 'block';
            } else if (category === 'fav') {
                card.style.display = isFav ? 'block' : 'none';
            } else {
                card.style.display = (cardCat === category) ? 'block' : 'none';
            }
        });
    };

    // Fungsi Pencarian Pintar (Menembus Semua Kategori menu)
    if (searchBox) {
        searchBox.addEventListener('keyup', function () {
            const keyword = searchBox.value.toLowerCase().trim();
            const menuSection = document.querySelector('#menu');
            let found = false;

            // Jika kolom pencarian dihapus/kosong, kembalikan tampilan sesuai kategori yang aktif sebelum nyari
            if (keyword === "") {
                menuCards.forEach(card => {
                    const isFav = card.dataset.fav === 'true';
                    const cardCat = card.dataset.category;
                    if (currentCategory === 'all') card.style.display = 'block';
                    else if (currentCategory === 'fav') card.style.display = isFav ? 'block' : 'none';
                    else card.style.display = (cardCat === currentCategory) ? 'block' : 'none';
                });
                if (noResult) noResult.style.display = 'none';
                return;
            }

            // Fokuskan layar otomatis ke area menu
            menuSection.scrollIntoView({ behavior: 'smooth' });

            // Mulai mencari ke seluruh isi menu-card
            menuCards.forEach(card => {
                const title = card.querySelector('.menu-card-title').innerText.toLowerCase();
                if (title.includes(keyword)) {
                    card.style.display = 'block';
                    found = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if (noResult) {
                noResult.style.display = found ? 'none' : 'block';
            }
        });
    }

    // ==================== 4. LOGIKA BUTTON CHECKOUT ====================
    const checkOutBtn = document.querySelector('.navbar .shopping-cart .check');
    if (checkOutBtn) {
        checkOutBtn.onclick = (e) => {
            e.preventDefault();
            
            let items = document.querySelectorAll(".cart-item");
            let cartData = [];

            items.forEach(item => {
                let name = item.querySelector("h3").innerText;
                let price = parseInt(item.querySelector(".price").dataset.price);
                let qty = parseInt(item.querySelector(".count").innerText);
                
                if (qty > 0) {
                    cartData.push({ name, price, qty });
                }
            });

            if (cartData.length === 0) {
                Swal.fire({
                    title: 'Oops!',
                    text: 'Your cart is empty. Find our interesting menu today!',
                    icon: 'warning',
                    confirmButtonText: 'Let\'s Shop',
                    confirmButtonColor: '#6C5141', 
                    background: '#111111',          
                    color: '#D8CFBC',              
                    iconColor: '#6C5141',
                    allowOutsideClick: true,
                    didOpen: () => {
                        const swalContainer = Swal.getContainer();
                        if(swalContainer) {
                            swalContainer.style.zIndex = "100000";
                        }
                    }
                });
                return;
            }
            
            localStorage.setItem('rannikka_cart', JSON.stringify(cartData));
            window.location.href = 'checkout.html';
        };
    }
});
