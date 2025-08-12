//ORDER dan HISTORI
function showHistori() {    

    Swal.fire({
        title: "Loading!",
        text: "Mohon Bersabar",
        imageUrl: "../images/icon/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Loading",
        showConfirmButton: false
      });

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/pembayaran",
        headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
        success: function (response) {
            console.log(response);
            $('.history').empty();
            response.forEach(function (element) {
                
                var statusClass = '';

                // Menentukan class berdasarkan status
                if (element.status === "Sedang Diperiksa") {
                    statusClass = 'text-yellow-600';
                } else if (element.status === "Sedang Diproses") {
                    statusClass = 'text-yellow-600';
                } else if (element.status === "Sedang Diantar") {
                    statusClass = 'text-yellow-400';
                } else if (element.status === "Sudah Diterima") {
                    statusClass = 'text-green-500';
                }

                $('.history').append(`
                <div class="w-[25rem] px-8 py-4 bg-white rounded-lg shadow-md">
                    <div class="flex items-center justify-between">
                        <p class="text-sm font-light text-gray-600">RESI: ${element.no_resi}</p>
                    </div>
                
                    <div class="mt-2">
                        <p class="text-xl font-bold text-gray-700">Status: <span class="${statusClass}">${element.status}</span></p>
                    </div>
                
                    <div class="flex items-center justify-between mt-4">
                        <button class="invoce px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500" value="${element.id}">Upload Bukti Pembayaran</button>
                        <button class="detail px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500" value="${element.id}">Detail</button>                                   
                    </div>
                </div>
                `);
            });            
        },        
    });
    swal.close();
}


$(document).on('click', '.detail', function (e) {
    e.preventDefault();
    $('.order').empty();

    var pembayaran_id = $(this).val()
    console.log(pembayaran_id)
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/pembayaran/orders/"+pembayaran_id,
        headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
        success: function (response) {
            response.forEach(function (element){        
                $('.order').append(`
                   <tr class="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                        <td class="p-3">
                            <p>${element.nama_barang}</p>
                        </td>
                        <td class="p-3">
                            <p>${element.jenis}</p>
                        </td>
                        <td class="p-3">
                            <p>${element.qty}</p>
                        </td>
                        <td class="p-3">
                            <p>${element.harga}</p>
                        </td>                                  
                    </tr>                    
                `);
            })
        }
    });
    $("#modalShowOrder").show();            

})

$(document).on('click', '.close', function() {  
    $("#modalShowOrder").hide();            
})

// TRANSAKSI

function showTransaksi() {
    Swal.fire({
        title: "Loading!",
        text: "Mohon Bersabar",
        imageUrl: "../images/icon/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Loading",
        showConfirmButton: false
    });

    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/api/pembayaran/showall",
        headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
        success: function (response) {
            console.log(response);
            $('.transaksi').empty();
            response.forEach(function (element) {

                var action1 = '';
                var action2 = '';
                var action3 = '';       

                // Menentukan class berdasarkan status
                if (element.status === "Sedang Diperiksa") {
                    action2 = 'hidden';
                    action3 = 'hidden';                    
                } else if (element.status === "Sedang Diproses") {
                    action1 = 'hidden';
                    action3 = 'hidden';                    
                } else if (element.status === "Sedang Dikirim") {
                    action1 = 'hidden';
                    action2 = 'hidden';                    
                } else if (element.status === "Selesai") {
                    action1 = 'hidden';
                    action2 = 'hidden';
                    action3 = 'hidden';                                        
                } else {
                    action1 = 'hidden';
                    action2 = 'hidden';
                    action3 = 'hidden';                    
                }
                             
                $('.transaksi').append(`
                    <tr class="border-b border-opacity-20 dark:border-gray-300 dark:bg-gray-50">
                        <td class="p-3">
                            <p>${element.invoice}</p>
                        </td>
                        <td class="p-3">
                            <p>${element.no_resi}</p>
                        </td>
                        <td class="p-3">
                            <p>${element.kurir}</p>
                        </td>
                        <td class="p-3">
                            <p>${element.status}</p>
                        </td> 
                        <td class="p-3">
                            <p>${element.total}</p>
                        </td> 
                        <td class="p-3">
                            <button value="${element.id}" class="btnApprove w-[100px] py-2 font-normal text-center text-white transition duration-500 ease-in-out transform bg-yellow-600 rounded-xl hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${action1}">Approve</button>
                            <button value="${element.id}" class="btnKirim w-[100px] py-2 font-normal text-center text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${action2}">Kirim</button>
                            <button value="${element.id}" class="btnSelesai w-[100px] py-2 font-normal text-center text-white transition duration-500 ease-in-out transform bg-green-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${action3}">Selesai</button>
                        </td>                                    
                    </tr>  
                `);
            });
            swal.close();
        },
        error: function(err) {
            console.log('Error fetching data', err);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Access tidak diberikan!',
                allowOutsideClick: false,
            }).then((result) => {
                if(result.isConfirmed){
                    // location.href = "../view2/login.html";
                    history.go(-1);
                }
            });
        }
    });
}

// BTN APPROVE
$(document).on('click', '.btnApprove', function (e) {
    e.preventDefault();    
    var id = $(this).val();
    var status = 'Sedang Diproses';

    Swal.fire({
        title: "Loading!",
        text: "Mohon Bersabar",
        imageUrl: "../images/icon/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Loading",
        showConfirmButton: false
    });

    $.ajax({
        type: "PUT",
        url: "http://127.0.0.1:8000/api/pembayaran/acc/" + id,
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        contentType: "application/json",
        data: JSON.stringify({
            status: status
        }),
        success: function (response) {
            swal.close()
            location.href = "../view2/transaksi.html"            
        },
        error: function (error) { 
            console.log('error', error);
        }
    });
});


// BTN KIRIM
$(document).on('click', '.cancelAddResi', function() {  
    $("#modalAddResi").hide();            
})

$(document).on('click', '.btnKirim', function (e) {
 var id = $(this).val();
 console.log(id)
 $("#modalAddResi").show();   
 $('.input_id').attr('value', id);
});


// BTN Upload Resi
$(document).on('click', '#tambahResi', function (e) {
    e.preventDefault();    
    var id = $('.input_id').val();
    var no_resi = $('#resi').val()
    var status = 'Sedang Dikirim';

    Swal.fire({
        title: "Loading!",
        text: "Mohon Bersabar",
        imageUrl: "../images/icon/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Loading",
        showConfirmButton: false
    });

    $.ajax({
        type: "PUT",
        url: "http://127.0.0.1:8000/api/resi/"+ id,
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        contentType: "application/json",
        data: JSON.stringify ({
            no_resi: no_resi,
        }),
        success: function (response) {
            console.log(response)
        }
     });

    $.ajax({
        type: "PUT",
        url: "http://127.0.0.1:8000/api/pembayaran/acc/" + id,
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        contentType: "application/json",
        data: JSON.stringify({
            status: status
        }),
        success: function (response) {
            swal.close()
            location.href = "../view2/transaksi.html"            
        },
        error: function (error) { 
            console.log('error', error);
        }
    });
});



// BTN SELESAI
$(document).on('click', '.btnSelesai', function (e) {
    e.preventDefault();    
    var id = $(this).val();
    var status = 'Selesai';

    Swal.fire({
        title: "Loading!",
        text: "Mohon Bersabar",
        imageUrl: "../images/icon/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Loading",
        showConfirmButton: false
    });

    $.ajax({
        type: "PUT",
        url: "http://127.0.0.1:8000/api/pembayaran/acc/" + id,
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        contentType: "application/json",
        data: JSON.stringify({
            status: status
        }),
        success: function (response) {
            swal.close()
            location.href = "../view2/transaksi.html"            
        },
        error: function (error) { 
            console.log('error', error);
        }
    });
});
