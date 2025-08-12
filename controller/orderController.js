let rupiah = new Intl.NumberFormat("id-ID",{
  style:"currency",
  currency:"IDR",        
});

function showOrderan(){
  // var orderan = localStorage.getItem('cart') || [];
  var orderan = JSON.parse(localStorage.getItem('cart')) || [];
  var total = 0;
  var berat = 0;

  var token = window.localStorage.getItem('setToken');
  // var cart = JSON.parse(localStorage.getItem('cart'));

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

  if (orderan.length < 1) {
    swal.fire({
      icon: 'error',
      text: "Anda belum Mengisi cart",
      showConfirmButton: true,      
      allowOutsideClick: false,
    }).then((result) => {
      if(result.isConfirmed){
          location.href = "index.html";
      }
    });

    return;
  }
  
  // orderanJson = JSON.parse(orderan)
  console.log(orderan)

  orderan.forEach(function(element) {
    console.log(element.product.nama_barang)
    $('#orderan').append(`
      <div class="flex justify-between items-center border-b pb-2">
          <span>${element.product.nama_barang} (x${element.quantity})</span>
          <span>${rupiah.format(element.total)}</span>
      </div>
  `);
    total = total + element.total;
    berat = berat + element.berat
    $('#total').empty();
    $('#total').append(`Total: ${rupiah.format(total)}`);
    $('#total').append(`<input id="totalVal" type="text" value="${total}" hidden>`);

    $('#totalBerat').empty();
    $('#totalBerat').append(`
        <input id="totalBerat2" type="text" value="${berat}">
      `);
});

  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/profile",
    headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
    success: function (response) {
      console.log(response)

      response.forEach(function(element) {
      let kota = element.kota_id ? element.kota_id : 'kosong';
      let provinsi = element.provinsi ? element.provinsi : 'kosong';
      let alamat = element.alamat ? element.alamat : 'kosong';

        $('#paymentDetail').append(`
          <label for="nama" class="mt-4 mb-2 block text-sm font-medium">Nama</label>
          <div class="relative">
            <input type="text" id="nama" name="nama" value="${element.name}" class="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Nama anda" />
            <div class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <svg xmlns="http://www.w3.org/2000/svg"  class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>

          <label for="email" class="mt-4 mb-2 block text-sm font-medium">Email</label>
          <div class="relative">
            <input type="text" id="email" name="email" value="${element.email}" class="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="your.email@gmail.com" />
            <div class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>

          <label for="noTelp" class="mt-4 mb-2 block text-sm font-medium">No telepon</label>
          <div class="relative">
            <input type="number" min="0" id="noTelp" name="noTelp" value="${element.notelp}" class="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Nomor telepon" />
            <div class="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
          </div>

          <label for="provinsi" class="mt-4 mb-2 block text-sm font-medium">Alamat</label>
          <div class="flex  flex-col sm:flex-row">
            <div class="relative w-1/2 max-sm:w-full flex-shrink-0">
              <select onchange="showKota()" type="text" id="provinsi" name="provinsi" class="w-full rounded-md border border-gray-200 px-2 py-3  text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="PROVINSI">
                <option class="w-1/2">${provinsi}</option>
              </select>
              
            </div>
            <select type="text" name="kota" id="kota" class="w-1/2 max-sm:w-full max-sm:mt-5 flex-shrink-0 rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="KOTA"> 
              <option class="w-1/2" value="${kota}" >${element.kota}</option>
            </select>
          </div>
          <label for="alamatLengkap" class="mt-4 mb-2 block text-sm font-medium">Detail Alamat</label>
          <div class="flex flex-col sm:flex-row">
            <div class="relative flex-shrink-0 w-full">
              <textarea type="text" id="alamatLengkap" name="alamatLengkap" class="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" value="${alamat}">${alamat}</textarea>            
            </div>
          </div>   

         
          <label for="kurir" class="mt-4 mb-2 block text-sm font-medium">kurir</label>
          <div class="flex  gap-5 w-full mt-2">
          
              <legend class="sr-only">Delivery</legend>

              <div class="w-1/3">
                <label
                  for="jne"
                  class="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
                  <div class="text-center">
                    <p class="text-gray-900 uppercase">jne</p>
                  </div>
                  <input type="radio" name="kurir" value="jne" id="jne" class="sr-only"/>
                </label>
              </div>

              <div class="w-1/3">
                <label
                  for="tiki"
                  class="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
                  <div class="text-center">
                    <p class="text-gray-700 uppercase">tiki</p>
                  </div>
                  <input type="radio" name="kurir" value="tiki" id="tiki" class="sr-only"/>
                </label>
              </div>

              <div class="w-1/3">
                <label
                  for="pos"
                  class="block cursor-pointer rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:checked]:border-blue-500 has-[:checked]:ring-1 has-[:checked]:ring-blue-500">
                  <div class="text-center">
                    <p class="text-gray-700 uppercase">pos</p>
                  </div>
                  <input type="radio" name="kurir" value="pos" id="pos" class="sr-only"/>
                </label>
              </div>          
          </div>                   
        `)
      });
    }
  });

  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/provinsi",
    headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
    success: function (response) {
      console.log(response)

      response.forEach(function(element) {
          $('#provinsi').append(`
            <option class="w-1/2" value="${element.id}">${element.name}</option>                
          `)
      });
    }
  });
}


$(document).on('click', '#cancelPilihKurir', function(e){
  e.preventDefault();
  $('#modalPilihPengiriman').hide()
  console.log('sssss')
});


function showKota(){
  var id_province = $('#provinsi').find(":selected").val();
  $.ajax({
    url: 'http://127.0.0.1:8000/api/provinsi/kota/'+id_province,
    method: 'GET',
    dataType: 'json',                     
    success: function(data) {
      $('#kota').empty();
      data.forEach(function(element) {             
          $('#kota').append(`
              <option class="child" value="${element.id}">${element.name}</option>   
          `);
      });
    }
  })
}

var harga = 0;

$(document).on('change', 'input[type=radio][name=kurir]', function(e){
  e.preventDefault()
  var kota_id = $('#kota').find(":selected").val();    
  var alamat = $('textarea#alamatLengkap').val();  
  

  var berat = Number($('#totalBerat2').val())  
  // var berat = 30000;  
  var kurir = $(this).val();
  console.log(kota_id, berat, kurir, alamat)

  if (kota_id === "kosong" || alamat === "kosong") {
    Swal.fire({
      icon: 'error',
      text: 'Alamat tidak boleh kosong',
      showConfirmButton: true,
    })

    return;
    
  }

  Swal.fire({
    title: "Loading!",
    text: "Mohon Bersabar",
    imageUrl: "../images/icon/loading.gif",
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: "Loading",
    showConfirmButton: false
  });

  if (berat > 30000) {
    Swal.fire({
      icon: 'error',            
      text: 'beban terlalu berat',
      showConfirmButton: true,
    })
  }

  var jneIcon = 'https://images.seeklogo.com/logo-png/13/2/tiki-jne-logo-png_seeklogo-139992.png';
  var tikiIcon = 'https://images.seeklogo.com/logo-png/13/2/tiki-logo-png_seeklogo-139990.png'
  var posIcon = 'https://images.seeklogo.com/logo-png/19/1/pos-indonesia-logo-png_seeklogo-190633.png'

  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8000/api/ongkir",
    headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
    contentType: 'application/json',
    data: JSON.stringify({ 
      origin: 594,
      destination : kota_id,
      weight : berat,
      courier : kurir
    }),
    success: function (response) {
      swal.close();
      console.log(response);

      
      

      $('#kurirDetail').empty();
      $('#kurirDetail').append(`
          <p id="jasaKurir" class="hidden" value="">${kurir}</p>
          `)
      response.forEach(function (element) {

        var index = 1;
        var logoUrl = 'https://img.icons8.com/?size=200&id=QPHuc4xZpn0y&format=png'
        

        if(element.code == 'tiki'){
          logoUrl = tikiIcon
        } else if (element.code == 'pos') {
          logoUrl = posIcon
        } else if (element.code == 'jne'){
          logoUrl = jneIcon
        }
        
        // $('#kurirDetail').empty();
        $('#kurirDetail').append(`
          <label for="service_${element.service}_${index}" class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm ring-blue-500 focus:outline-none peer-checked:border-transparent peer-checked:ring-2">
    
            <input type="radio" name="pengiriman" value="${element.cost}" id="service_${element.service}_${index}" class="peer sr-only" ${index === 0 ? 'checked' : ''}>
            
            <div class="flex flex-1 items-center">
              <img src="${logoUrl}" alt="${element.code}" class="mr-4 h-8 w-auto object-contain">
              <div class="flex flex-col">
                <span class="block text-sm font-semibold text-gray-900">${element.service} (${element.description})</span>
                <span class="mt-1 block text-xs text-gray-600">Estimasi ${element.etd.replace(/hari/i, '').trim()} Hari</span>
              </div>
            </div>
            
            <span class="text-sm font-bold text-gray-900">${rupiah.format(element.cost)}</span>
            
            <span class="absolute right-4 top-1/2 -translate-y-1/2 hidden h-5 w-5 text-blue-600 peer-checked:block" aria-hidden="true">
              <svg class="h-full w-full" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="currentColor"></circle>
                <path d="M9.75 14.35l-2.43-2.43a.75.75 0 00-1.06 1.06l3 3c.29.29.77.29 1.06 0l6.5-6.5a.75.75 0 00-1.06-1.06L9.75 14.35z" fill="#fff"></path>
              </svg>
            </span>
            
          </label>           
          `);    
          index++;      
      });
      console.log($("input[name='pengiriman']:checked").val())
    },
    error: function(res){      
      Swal.fire({
      icon: 'error',            
      text: 'Kurir Tidak Tersedia',
      showConfirmButton: true,
    })
    }
  });
  
})

$(document).on('click', '#pembayaran', function(e) {
  e.preventDefault();
 
  var hargaOngkir = Number($("input[name='pengiriman']:checked").val());
  var hargaBarang = Number($("#totalVal").val());
  var nama = $("#nama").val();
  var email = $("#email").val();
  var noTelp = $("#noTelp").val();
  var jasaKurir = $("#jasaKurir").text(); 
  var alamatLengkap = $("#alamatLengkap").val();

  var cart = JSON.parse(localStorage.getItem('cart'));    


  console.log(hargaOngkir, hargaBarang, nama, email, noTelp, jasaKurir, alamatLengkap)

  if (!nama || !email || !noTelp  || alamatLengkap === null) {
    swal.fire({
      icon: 'error',
      text: 'Isi semua data terlebih dahulu',
      showConfirmButton: true,
    })
    return;
  } 

  var id =  $(this).val()
  var hargaTotal = hargaBarang + hargaOngkir;
  console.log(jasaKurir, hargaTotal, id)

  var lastId = 0;
  // var stringLastId = JSON.parse(lastId);
  
  console.log(JSON.stringify(cart))

  if (!hargaOngkir) {
    swal.fire({
      icon: 'error',
      text: 'Pilih jasa kurir terlebih dahulu',
      showConfirmButton: true,
    })
  } else {    
  
    $.ajax({
      type: "POST",
      url: "http://127.0.0.1:8000/api/bayar",
      headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
      contentType: 'application/json',
      data: JSON.stringify({ 
        total: hargaTotal,      
        nama: nama,
        kurir: jasaKurir,
        ongkirKurir : hargaOngkir,
        email : email,
        notelp: noTelp,
      }),
    
      success: function (response) {
        lastId = response[1]    
        console.log('Last ID:', lastId);
        // window.snap.pay(response.status.snap_token)           

        $.ajax({
          type: "POST",
          url: "http://127.0.0.1:8000/api/pembayaran/order/add",
          headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify({
            orders: cart,
            pembayaran_id: lastId
          }),
          success: function(response) {
            console.log(response);            
            window.snap.pay(response.snap_token)           
            localStorage.removeItem('cart');  
          },
          error: function (error) {
            swal.fire({
              icon: 'error',
              text: 'Stock kurang dari pesanan',
              showConfirmButton: true,
            })
          }
        });

      }
    });  
    
  }
})
