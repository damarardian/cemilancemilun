let cart = [];
let qty = 0;

function showData() { 
  var tableRow = document.getElementById("index");
  let rupiah = new Intl.NumberFormat("id-ID",{
      style:"currency",
      currency:"IDR",        
  })
  var token = window.localStorage.getItem('setToken');

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

  $.ajax({
      url: 'https://cemilanv1.biz.id/api/market',
      method: 'GET',
      success: function(data) {
          data.sort(function(a, b) {
              return a.nama_barang.localeCompare(b.nama_barang);
          });

          $('#data').empty(); 
          
          data.forEach(function(element) {
              $('#index').append(`
                  <div class="item h-[350px] w-[300px] mx-3 my-3" data-category="${element.jenis}">
                      <div class="w-full h-1/2 bg-white shadow rounded">
                          <div class="h-full w-full bg-gray-200 flex flex-row justify-between p-4 bg-cover bg-center" style="background-image: url('${element.image_url}')"></div>
                          <div class="container p-4 flex flex-col items-center">
                            <p class="text-gray-400 font-light text-xs text-center">${element.jenis}</p>
                            <h1 class="text-gray-800 text-center mt-1">${element.nama_barang}</h1>
                            <p class="text-center text-gray-800 mt-1">${rupiah.format(element.harga)}/PCK</p>
                            <p class="text-center text-gray-800 mt-1">Stock : ${element.stock} PCK</p>
                            <div class="btn_container inline-flex items-center mt-2 justify-center">
                                <button class="kurang bg-white rounded-l border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                                    </svg>
                                </button>
                                <input class="qty w-10 bg-gray-100 border-t border-b border-gray-100 text-gray-600 hover:bg-gray-100 inline-flex items-center px-4 py-1 select-none" value="0" />                                                 
                                <button class="tambah bg-white rounded-r border text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 inline-flex items-center px-2 py-1 border-r border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                            <button id="btn_beli" onclick="addToCart(${element.id})" class="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 mt-4 w-full flex items-center justify-center"> Cart
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-2" fill="none" viewBox="0 24 24" stroke="currentColor">
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
    // Filter items based on category button click
    $('.category-btn').click(function() {
        var category = $(this).data('category');
        if (category === 'all') {
            $('.item').show();
        } else {
            $('.item').hide();
            $('.item[data-category="'+ category +'"]').show();
        }
    });

    // Event delegation for dynamically added elements
    $('#index').on('click', '.tambah', function() {
        var $qtyInput = $(this).siblings(".qty");
        var currentVal = Number($qtyInput.val());
        $qtyInput.val(currentVal + 1);
        var newValue = Number($qtyInput.val());
        console.log("Incremented value: " + newValue);
        qty = newValue;
    });

    $('#index').on('click', '.kurang', function() {
        var $qtyInput = $(this).siblings(".qty");
        var currentVal = Number($qtyInput.val());
        if (currentVal > 0) {
            $qtyInput.val(currentVal - 1);
        }
        var newValue = Number($qtyInput.val());
        console.log("Decremented value: " + newValue);
        qty = newValue;
    });
});



function addToCart(id) {
    if (qty == 0){
        Swal.fire({
            icon: 'error',
            title: 'Masukkan qty',
        });
    } else {
        $.ajax({
            url: 'https://cemilanv1.biz.id/api/market/'+id,
            method: 'GET',
            success: function(product) {
                let productTotal = product[0].harga * qty;
                cart.push({product, quantity: qty, total: productTotal });
                Swal.fire({
                    icon: 'success',
                    title: 'Added to Cart',
                    text: `${product[0].nama_barang} Ditambah ke keranjang.`
                });
                console.log(cart);
                showCart();
            },
            error: function(error) {
                console.error('Error:', error);
            }
        });
    }
    
}



function showCart() {
    const cartItems = $('#cartItems');
    var total = 0;
    $('#cartItems').empty();
    cart.forEach(function(element) {
        $('#cartItems').append(`
            <div class="flex justify-between items-center border-b pb-2">
                <span>${element.product[0].nama_barang} (x${element.quantity})</span>
                <span>Rp${element.total}</span>
            </div>
        `);
        total += element.total;
    });
    $('#total').empty();
    $('#total').append(`Total: Rp${total}`);
    $('#cartModal').removeClass('hidden');
}



$(document).on('click', '#closeCartModal', function() {
    $('#cartModal').addClass('hidden');
});

$(document).on('click', '#checkout', function() {
    Swal.fire({
        icon: 'success',
        title: 'Successful',
        text: 'Orderan Kamu sudah Masuk.'
    });
    cart = [];
    $('#cartModal').addClass('hidden');
});

$(document).on('click', '#btn_beli', function(e) {
    e.preventDefault();
    var id = $(this).val();
    console.log(id);
});




