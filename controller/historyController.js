
let rupiah = new Intl.NumberFormat("id-ID",{
  style:"currency",
  currency:"IDR",        
})

function showData(){   

  var token = localStorage.getItem('setToken');
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

  var id;

  $.ajax({
      method : "GET",
      url: "https://cemilanv1.biz.id/api/profile",
      headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
      success: function (response) {  
        console.log(response)
        
        id = response[0]['id'];

        console.log(id) 
        var pembelian = 0;  
        $('.name').val(response[0]['name'])
        $('.name').text(response[0]['name'])
        $('.email').val(response[0]['email'])
        $('.email').text(response[0]['email'])
        $('#phone').val(response[0]['notelp'])
        $('#provinsi').val(response[0]['provinsi'])
        $('#provinsi').text(response[0]['provinsi'])
        $('#kota').val(response[0]['kota_id'])
        $('#kota').text(response[0]['kota'])
        $('#message').text(response[0]['alamat'])
        $('#role').val(response[0]['role'])

        response.forEach(function(element) {             
          element.data_pembayaran.forEach(function(data) {             
            pembelian++;            
          });
        });

        $('.totalBeli').text(pembelian)
      }
  });
}


$(document).on('click', '.showDataPembelian', function (e) {
  e.preventDefault();
  var angka = 0;
  
  $('.formPembelian').removeClass('hidden')

  $('.showDataPembelian').addClass('hidden')
  $('.showDataPembelian').removeClass('block')

  $('.hideDataPembelian').removeClass('hidden')
  $('.hideDataPembelian').addClass('block')

  

  $.ajax({
      headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
      url: 'https://cemilanv1.biz.id/api/pembayaran',
      type: 'GET',
      success: function(response) {            
          $('#tableShow').empty();
          response.forEach(function(element) {  
            angka++           
              $('#tableShow').append(`
                  <tr>                     
                    <td class="px-6 py-4 formId whitespace-nowrap text-sm font-medium text-gray-800">${angka}</td>
                    <td class="hidden px-6 py-4 formOngkir whitespace-nowrap text-sm font-medium text-gray-800">${element.ongkir}</td>
                    <td class="px-6 py-4 formInvoice whitespace-nowrap text-sm text-gray-800">${element.invoice}</td>
                    <td class="px-6 py-4 formKurir whitespace-nowrap text-sm text-gray-800">${element.kurir}</td>
                    <td class="px-6 py-4 formStatus whitespace-nowrap text-sm text-gray-800">${element.status}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button type="button" class="showOrders items-center text-sm font-semibold" value="${element.id}">
                        <img src="https://cdn-icons-png.flaticon.com/512/1557/1557311.png" width="25px" alt="">
                      </button>
                      
                      <button type="button" class="showTrackingPackage items-center text-sm font-semibold" data-kurir="${element.kurir}" data-invoice="${element.no_resi}">
                        <img src="https://cdn-icons-png.flaticon.com/512/15566/15566115.png" width="25px" alt="">
                      </button>
                    </td>
                  </tr>      
              `);
          });
      }
  })
});

const courierLogos = {
    jne: "https://images.seeklogo.com/logo-png/13/2/tiki-jne-logo-png_seeklogo-139992.png",
    pos: "https://images.seeklogo.com/logo-png/19/1/pos-indonesia-logo-png_seeklogo-190633.png",
    tiki: "https://images.seeklogo.com/logo-png/13/2/tiki-logo-png_seeklogo-139990.png"    
};


$(document).on('click', '.showTrackingPackage', function(e) {
    e.preventDefault();

    const kurir = $(this).data('kurir');
    const invoice = $(this).data('invoice');
    const modal = $('#modalShowTrackingPackage');
    const trackingHeader = $('#trackingHeader');
    const trackingBody = $('#showDataTrackingPackage');
    
    modal.removeClass('hidden').addClass('flex');
    trackingHeader.html(''); 
    trackingBody.html(`
        <div class="flex flex-col items-center justify-center py-10">
            <svg class="h-8 w-8 animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-3 text-sm text-gray-600">Mengambil data tracking...</p>
        </div>
    `);

    $.ajax({
        type: "POST",
        url: 'https://cemilanv1.biz.id/api/track-package/',
        headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
        data: {
            "courier": kurir,
            "awb": invoice
        },
        success: function(response) {
            const summary = response.data?.summary;
            const history = response.data?.history;
            const logoUrl = courierLogos[kurir.toLowerCase()] || 'https://placehold.co/100x40?text=Kurir';
            
            const headerContent = `
                <div class="flex items-center justify-between">
                    <img src="${logoUrl}" alt="${summary?.courier || kurir}" class="h-8 w-auto object-contain">
                    <span class="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">${summary?.status || 'Tracking'}</span>
                </div>
                <div>
                    <p class="text-xs text-gray-500">No. Resi</p>
                    <p class="text-lg font-bold text-gray-800 tracking-wider">${summary?.awb || invoice}</p>
                </div>
            `;
            trackingHeader.html(headerContent);
            
            trackingBody.empty(); // Kosongkan area body
            if (Array.isArray(history) && history.length > 0) {
                const timeline = $('<ol class="relative border-l border-gray-200"></ol>');
                history.forEach(function(item, index) {
                    const isLast = index === 0;
                    const dateObj = new Date(item.date);
                    const formattedDate = dateObj.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' });
                    const formattedTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

                    const timelineItem = `
                        <li class="mb-6 ml-6">
                            <span class="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full ${isLast ? 'bg-blue-500 ring-8 ring-white' : 'bg-gray-200'}">
                                ${isLast ? `
                                    <svg class="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                                ` : `
                                    <svg class="h-3 w-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd"></path></svg>
                                `}
                            </span>
                            <div class="flex justify-between items-start">
                                <div>
                                    <p class="text-sm font-semibold text-gray-900 ${isLast ? 'text-blue-600' : ''}">${item.desc || 'Update Status'}</p>
                                    <p class="text-xs text-gray-500">${item.location || ''}</p>
                                </div>
                                <div class="text-right text-xs text-gray-500 whitespace-nowrap pl-3">
                                    <p>${formattedDate}</p>
                                    <p>${formattedTime} WIB</p>
                                </div>
                            </div>
                        </li>
                    `;
                    timeline.append(timelineItem);
                });
                trackingBody.html(timeline);
            } else {
                trackingBody.html('<p class="py-10 text-center text-sm text-gray-500">Tidak ada riwayat pengiriman ditemukan.</p>');
            }
        },
        error: function(xhr) {
            console.error("Gagal mengambil data tracking:", xhr);
            trackingHeader.html('');
            trackingBody.html(`
                <div class="py-10 text-center">
                    <p class="font-semibold text-red-600">Gagal Memuat Data</p>
                    <p class="mt-1 text-sm text-gray-500">Tidak dapat terhubung ke server kurir. Silakan coba lagi nanti.</p>
                </div>
            `);
        }
    });
});

$(document).on('click', '.cancelModalShowTrackingPackage', function() {
    $('#modalShowTrackingPackage').addClass('hidden').removeClass('flex');
});


$(document).on('click', '.showTrackingPackage', function (e) {
  e.preventDefault();
  $('#modalShowTrackingPackage').show()

});

// $(document).on('click', '.cancelModalShowTrackingPackage', function(e){
//   e.preventDefault();
//   $('#modalShowTrackingPackage').hide();
// })

// Event listener untuk tombol "showOrders"
$(document).on('click', '.showOrders', function(e) {
    e.preventDefault();

    // Tombol yang sedang diklik
  const button = $(this); 
  
  // 1. Temukan baris (tr) terdekat dari tombol yang diklik
  const row = button.closest('tr');

  // 2. Dari baris tersebut, temukan elemen 'td' dengan kelas 'formOngkir' dan ambil teksnya
  const ongkirValue = row.find('.formOngkir').text();

  // 3. Ambil ID dari value tombol seperti sebelumnya
  const id = button.val();
  
  // (Opsional) Konversi nilai ongkir menjadi angka untuk kalkulasi
  const ongkirNumerik = parseInt(ongkirValue);

  console.log(ongkirNumerik)

    const orderId = $(this).val(); // ID dari tombol yang diklik
    const modal = $('#modalShowOrders');
    const container = $('#orderItemsContainer');
    const orderIdText = $('#orderIdText');
    const subtotalAmount = $('#subtotalAmount');
    const shippingAmount = $('#shippingAmount'); // Asumsi Anda akan menambahkan ini nanti
    const totalAmount = $('#totalAmount');

    // Reset dan tampilkan modal
    modal.removeClass('hidden').addClass('flex');
    orderIdText.text(`ID Pesanan: #${orderId}`);
    subtotalAmount.text('Rp 0');
    shippingAmount.text('Rp 0'); // Reset ongkir
    totalAmount.text('Rp 0');
    container.html(`
        <div class="py-10 text-center">
            <p class="text-sm text-gray-500">Memuat item pesanan...</p>
        </div>
    `);

    $.ajax({
        type: "GET",
        headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
        url: 'https://cemilanv1.biz.id/api/pembayaran/orders/' + orderId,
        success: function(response) {
            container.empty();
            let subtotal = 0;
            
            // Asumsi ongkir didapat dari data pertama (jika ada)
            // Sesuaikan ini dengan struktur data Anda
            const ongkir = response.length > 0 ? response[0].ongkir : 0; 

            if (Array.isArray(response) && response.length > 0) {
                response.forEach(function(item) {
                    const itemSubtotal = item.qty * item.harga;
                    subtotal += itemSubtotal;
                    
                    // Asumsi ada 'image_url' di data item Anda. Jika tidak, akan menggunakan placeholder.
                    const imageUrl = item.image_url || `https://placehold.co/64x64/e2e8f0/333?text=${item.nama_barang.charAt(0)}`;

                    const itemHtml = `
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <img src="${imageUrl}" alt="${item.nama_barang}" class="h-16 w-16 rounded-md object-cover mr-4">
                                <div>
                                    <p class="font-semibold text-gray-800">${item.nama_barang}</p>
                                    <p class="text-sm text-gray-500">${item.qty} x ${rupiah.format(item.harga)}</p>
                                </div>
                            </div>
                            <p class="text-sm font-medium text-gray-900">${rupiah.format(itemSubtotal)}</p>
                        </div>
                    `;
                    container.append(itemHtml);
                });

                // Update total
                subtotalAmount.text(rupiah.format(subtotal));
                shippingAmount.text(rupiah.format(ongkirNumerik));
                totalAmount.text(rupiah.format(subtotal + ongkirNumerik));

            } else {
                container.html('<p class="py-10 text-center text-sm text-gray-500">Tidak ada item dalam pesanan ini.</p>');
            }
        },
        error: function(xhr) {
            console.error("Gagal memuat detail pesanan:", xhr);
            container.html(`
                <div class="py-10 text-center text-red-600">
                    <p class="font-semibold">Gagal Memuat Data</p>
                    <p class="text-sm text-gray-500 mt-1">Silakan coba lagi nanti.</p>
                </div>
            `);
        }
    });
});

// Event listener untuk menutup modal
$(document).on('click', '.cancelAddShowOrders', function() {
    $('#modalShowOrders').addClass('hidden').removeClass('flex');
});

$(document).on('click', '.showOrders', function (e) {
  e.preventDefault();
  $('#modalShowOrders').show()

})

$(document).on('click', '.cancelAddShowOrders', function(e){
  e.preventDefault();
  $('#modalShowOrders').hide();

})

$(document).on('click', '.hideDataPembelian', function(e){
  e.preventDefault();

  $('.formPembelian').addClass('hidden')

  $('.hideDataPembelian').addClass('hidden')
  $('.hideDataPembelian').removeClass('block')

  $('.showDataPembelian').removeClass('hidden')
  $('.showDataPembelian').addClass('block')

})

