
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let qty = 0;
let rupiah = new Intl.NumberFormat("id-ID",{
    style:"currency",
    currency:"IDR",        
})

// var minJumlahProduk;

function showData() { 
  var tableRow = document.getElementById("index");
  updateCartBadge();
  var token = window.localStorage.getItem('setToken');

  console.log(cart)
  if(!token){
    $('a.logedIn').addClass("hidden");
    $('a.logedIn').removeClass("flex");

    $('div.logedIn').addClass("hidden");  
    $('div.logedIn').removeClass("flex");  
        
    $('div.guestMenu').removeClass("hidden");        
    $('div.guestMenu').addClass("flex");        
  } else {
    $('a.logedIn').removeClass("hidden");
    $('a.logedIn').addClass("flex");

    $('div.logedIn').removeClass("hidden");  
    $('div.logedIn').addClass("flex");  
        
    $('div.guestMenu').addClass("hidden");        
    $('div.guestMenu').removeClass("flex");        
  }

  var idInput = 0;

    $.ajax({
        url: 'http://127.0.0.1:8000/api/market',
        method: 'GET',
        success: function(data) {      

            console.log(data)
    
            $('#data').empty(); 
            
            data.forEach(function(element) {
                idInput++;
                var isDisabled = element.stock < 1 ? 'disabled' : '';
                var isQtyDisabled = element.stock < 1 ? 'disabled' : '';
                var stockHabis = element.stock < 1 ? 'Stock Habis' : 'Cart';

                
                $('#index').append(`
                    <div class="item h-[350px] w-[300px] mx-3 my-3" data-category="${element.jenis}">
                        <div class="w-full h-1/2 bg-white shadow rounded">
                            <div class="h-full w-full bg-gray-200 flex flex-row justify-between p-4 bg-cover bg-center" style="background-image: url('${element.image_url}')"></div>
                            <div class="container p-4 flex flex-col">
                                <div class="flex justify-between">
                                    <p class="text-gray-400 font-light text-xs text-center">${element.jenis}</p>
                                    <p class="text-gray-400 font-light text-xs text-center">${element.desc} PCS/ML</p>
                                </div>
                                <h1 class="text-gray-800 text-center mt-1">${element.nama_barang}</h1>
                                <p class="text-center text-gray-800 mt-1">${rupiah.format(element.harga)}/PCK</p>
                                <p class="stock${idInput} text-center text-gray-800 mt-1">Stock : ${element.stock} PCK</p>
                                <div class="btn_container inline-flex items-center mt-2 justify-center">
                                    <button class="kurang bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200" ${isQtyDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <input type="number" min="0" max="${element.stock}" class="qty w-20 text-center bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none" value="0" ${isQtyDisabled} data-id="${element.id}" />                                                 
                                    <button class="tambah bg-white rounded-r border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200" ${isQtyDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                                <button class="btn_beli py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center" data-id="${element.id}" ${isDisabled}> ${stockHabis}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                `);     
            });
        },
        error: function(err) {
            console.log('Error fetching data', err);
        }
    }); 
  
}

$(document).ready(function() {

    $('.category-btn').click(function() {
        var category = $(this).data('category');
        if (category === 'all') {
            $('.item').show();
            $('.category-btn[data-category="'+ category +'"]').addClass('border-b border-black');
            $('.category-btn[data-category="Frozen Food"]').removeClass('border-b border-black');
            $('.category-btn[data-category="Minuman"]').removeClass('border-b border-black');


        } else if (category === 'Frozen Food') {
            $('.item').hide();
            $('.category-btn[data-category="all"]').removeClass('border-b border-black');
            $('.category-btn[data-category="Minuman"]').removeClass('border-b border-black');
            $('.category-btn[data-category="'+ category +'"]').addClass('border-b border-black');
            $('.item[data-category="Frozen Food"]').show();
            
        } else {
            $('.item').hide();
            $('.category-btn[data-category="all"]').removeClass('border-b border-black');
            $('.category-btn[data-category="Frozen Food"]').removeClass('border-b border-black');
            $('.category-btn[data-category="'+ category +'"]').addClass('border-b border-black');
            $('.item[data-category="Minuman"]').show();
        }
    })

    $('#index').on('click', '.tambah', function() {
        var $qtyInput = $(this).siblings(".qty");
        var currentVal = Number($qtyInput.val());
        $qtyInput.val(currentVal + 1);
        var newValue = Number($qtyInput.val());
        console.log("Incremented value: " + newValue);
    });
    
    $('#index').on('click', '.kurang', function() {
        var $qtyInput = $(this).siblings(".qty");
        var currentVal = Number($qtyInput.val());
        if (currentVal > 0) {
            $qtyInput.val(currentVal - 1);
        }
        var newValue = Number($qtyInput.val());
        console.log("Decremented value: " + newValue);
    });
    
    $('#index').on('click', '.btn_beli', function() {
        console.log('test')
        var id = $(this).data('id');
        addToCart(id);
    });
});

function cari(){
    word = $('#cariProduk').val();
    console.log(word)
    var idInput = 0;

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/cari-produk?keyword="+word,  
        success: function (response) {
            console.log(response);
            $('#index').empty(); 
            
            response.forEach(function(element) {
                idInput++;
                var isDisabled = element.stock < 1 ? 'disabled' : '';
                var isQtyDisabled = element.stock < 1 ? 'disabled' : '';
                var stockHabis = element.stock < 1 ? 'Stock Habis' : 'Cart';  
                $('#index').append(`
                    <div class="item h-[350px] w-[300px] mx-3 my-3" data-category="${element.jenis}">
                        <div class="w-full h-1/2 bg-white shadow rounded">
                            <div class="h-full w-full bg-gray-200 flex flex-row justify-between p-4 bg-cover bg-center" style="background-image: url('${element.image_url}')"></div>
                            <div class="container p-4 flex flex-col">
                                <div class="flex justify-between">
                                    <p class="text-gray-400 font-light text-xs text-center">${element.jenis}</p>
                                    <p class="text-gray-400 font-light text-xs text-center">${element.desc} PCS/ML</p>
                                </div>
                                <h1 class="text-gray-800 text-center mt-1">${element.nama_barang}</h1>
                                <p class="text-center text-gray-800 mt-1">${rupiah.format(element.harga)}/PCK</p>
                                <p class="stock${idInput} text-center text-gray-800 mt-1">Stock : ${element.stock} PCK</p>
                                <div class="btn_container inline-flex items-center mt-2 justify-center">
                                    <button class="kurang bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200" ${isQtyDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                        </svg>
                                    </button>
                                    <input type="number" min="0" max="${element.stock}" class="qty w-20 text-center bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none" value="0" ${isQtyDisabled} data-id="${element.id}" />                                                 
                                    <button class="tambah bg-white rounded-r border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200" ${isQtyDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                                <button class="btn_beli py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center" data-id="${element.id}" ${isDisabled}> ${stockHabis}
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                `);               
            });
        }
    });
}


function addToCart(id) {
    var $qtyInput = $('input[data-id="'+id+'"]');
    var maxQty = Number($qtyInput.attr('max')); // Ambil nilai max dari atribut max input
    var qty = Number($qtyInput.val());
    var checkLogin = localStorage.getItem('setToken')

    if (!checkLogin) {
        Swal.fire({
            icon: 'error',
            title: 'Anda Belum Login',   
            showConfirmButton: true,   
            confirmButtonText: 'login',
            allowOutsideClick: false,
        }).then((result) => {
            if(result.isConfirmed){
              location.href = "../view2/login.html";
            }
        });       
    } else {
        if (qty < 1){
            Swal.fire({
                icon: 'error',
                title: 'Jumlah Produk Tidak Boleh 0',
            });
        } else if (qty > maxQty) {
            Swal.fire({
                icon: 'error',
                title: 'Stok tidak cukup',
                text: `Produk hanya tersisa ${maxQty} PCK.`
            });
        } else {
            $.ajax({
                url: 'http://127.0.0.1:8000/api/market/'+id,
                method: 'GET',
                success: function(product) {
                    let productTotal = product[0].harga * qty;
                    let beratTotal = product[0].berat * qty;
                    let barang_id = product[0].id;

                    cart.push({
                        product: product[0], 
                        quantity: qty, 
                        id: barang_id,
                        total: productTotal,
                        berat: beratTotal
                    });

                    // Update local storage
                    localStorage.setItem('cart', JSON.stringify(cart));
                    // Update badge notification
                    updateCartBadge();

                    Swal.fire({
                        icon: 'success',
                        title: 'Added to Cart',
                        text: `${product[0].nama_barang} Ditambah ke keranjang.`
                    });
                    // console.log(JSON.stringify(cart));
                    showCart();
                    updateCartBadge();
                },
                error: function(error) {
                    console.error('Error:', error);
                }
            });
        }
    }        
}


function showCart() {
    var total = 0;
    $('#cartItems').empty();
    
    // cart = JSON.parse(localStorage.getItem('cart'));    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach(function(element, index) {
        $('#cartItems').append(`
            <div class="flex justify-between items-center border-b pb-2">
                <span>${element.product.nama_barang} (x${element.quantity})</span>
                <span>${rupiah.format(element.total)}</span>
                <button class="delete-item border p-1 rounded-md hover:bg-red-600 hover:text-slate-50" data-index="${index}">Hapus</button>
            </div>
        `);
        total += element.total;
    });

    $('#total').empty();
    $('#total').append(`Total:${rupiah.format(total)}`);
    $('#cartModal').removeClass('hidden');

    // delete cart per item
    $('.delete-item').click(function() {
        var index = $(this).data('index');
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart)); // Update local storage after item removal
        updateCartBadge(); // Update badge notification
        showCart();
    });
}

function updateCartBadge() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var badge = $('#notifBadge');
    if (cart.length > 0) {
        badge.text(cart.length);
        badge.removeClass('hidden');
    } else {
        badge.addClass('hidden');
    }
}

// hapus semua cart
$(document).on('click','#deleteCart', function(e){
    e.preventDefault();
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart)
    $('#cartItems').empty();
    $('#total').empty();
    $('#total').append(`Total:Rp 0,00`);
    updateCartBadge();
})

// hide cart
$(document).on('click', '#closeCartModal', function() {
    $('#cartModal').addClass('hidden');
});


// checkout
$(document).on('click', '#checkout', function() {    
    if (cart[0] == null) {
        Swal.fire({
            icon: 'info',            
            text: 'keranjang belanja masih kosong.',
            showConfirmButton: true,
        })
        $('#cartModal').addClass('hidden');
    } else {
        Swal.fire({
            icon: 'success',
            title: 'Successful',
            text: 'Orderan Kamu sudah Masuk.',
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
              location.href = "../view2/order.html"
            }
          });  
        $('#cartModal').addClass('hidden');
    }    
});





