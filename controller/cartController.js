function showCart() {
  var total = 0;
  $('#cartItems').empty();
  cart = JSON.parse(localStorage.getItem('cart'));    
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

$(document).ready(function() {
    updateCartBadge()
});

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
  $('#total').append(`Total:Rp 0`);
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