// var profit = 0;

function showData() {
    var angka = 0;
    let rupiah = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
    });

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
        url: 'https://cemilanv1.biz.id/api/kas',
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        method: 'GET',

        success: function(data) {
            $('#data').empty();
            token = window.localStorage.getItem('setToken');            

            data.forEach(function(element) {
                angka += 1;
                let totalProfit = 0;

                const getBulan = new Date(element.bulanan);
                const bulan = getBulan.getMonth();
                const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July", "Agustus", "September", "Oktober", "November", "Desember"];

                // console.log(namaBulan[bulan]);

                // Calculate total profit from data_kas
                if (element.data_kas) {
                    element.data_kas.forEach(function(kas) {
                        totalProfit += kas.income;
                    });
                }

                $('#data').append(`
                <div class="rounded-xl border-2 border-gray-300 bg-white mt-10" data-id="${element.id}">
                    <div class="flex gap-4 p-4 sm:p-6 lg:p-8">
                        <div>
                            <h3 class="font-medium sm:text-3xl">
                                Bulan : ${namaBulan[bulan]}
                            </h3>
                        </div>
                        <div class="ml-auto">
                            Profit : <span id="total_profit" class="text-green-600">${rupiah.format(totalProfit)}</span>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <strong class="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-ee-xl rounded-ss-xl hover:bg-green-800 bg-green-600 px-3 py-1.5 text-white">
                            <button class="detailDown text-[10px] font-medium sm:text-lg" value="${element.id}">Show!</button>
                            <button class="detailUp text-[10px] font-medium sm:text-lg hidden">Hide!</button>
                        </strong>
                    </div>
                    <div class="panel h-auto border hidden">
                        <div class="p-10">
                            <section class="container px-4 mx-auto">
                                <div class="sm:flex sm:items-center sm:justify-between">
                                    <div class="mt-4">
                                        <button value="${element.id}" class="btnAddDataKas w-1/2 px-5 py-2 text-sm text-gray-800 transition-colors duration-200 bg-white border rounded-lg sm:w-auto dark:hover:bg-gray-800 dark:bg-gray-900 hover:bg-gray-100 dark:text-white dark:border-gray-700">
                                            Tambah
                                        </button>
                                    </div>
                                </div>
                                <div class="flex flex-col mt-6">
                                    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                            <div class="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                                                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead class="bg-gray-50 dark:bg-gray-800">
                                                        <tr>
                                                            <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-200">
                                                                No
                                                            </th>
                                                            <th scope="col" class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-200">
                                                                Item
                                                            </th>
                                                            <th scope="col" class="py-3.5 text-sm font-normal text-left rtl:text-right text-gray-200">
                                                                Tanggal
                                                            </th>
                                                            <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-200">
                                                                Qty
                                                            </th>
                                                            <th scope="col" class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-200">
                                                                income
                                                            </th>
                                                            <th scope="col" class="relative py-3.5 px-4">
                                                                <span class="sr-only">Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-700" id="showRekap-${element.id}">
                                                        <!--data dinamyc-->
                                                    </tbody>
                                                </table>
                                                <div class="no-data-message text-center py-4 text-gray-500 hidden">Belum ada data</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                `);
            });

            // show isi table by data_id
            $(document).on('click', '.detailDown', function(e){
                e.preventDefault();
                var data_id = $(this).val();
                var parentDiv = $(this).closest('.rounded-xl');

                $.ajax({
                    type: "GET",
                    headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
                    url: "https://cemilanv1.biz.id/api/data-kas/" + data_id,
                    success: function(response) {
                        var tbody = parentDiv.find(`#showRekap-${data_id}`);
                        var noDataMessage = parentDiv.find('.no-data-message');
                        tbody.empty();
                        var angka = 0;
                        var totalIncome = 0;

                        if (response.length > 0) {
                            noDataMessage.hide();
                            response.forEach(function(element) {
                                angka += 1;
                                totalIncome += element.income;
                                tbody.append(`
                                <tr>
                                    <td class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">${angka}</td>
                                    <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                        <h2 class="text-gray-800">${element.nama_item}</h2>
                                    </td>
                                    <td class="py-4 text-sm text-gray-500 whitespace-nowrap">${element.tanggal}</td>
                                    <td class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">${element.qty_sold}</td>
                                    <td class="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">${rupiah.format(element.income)}</td>
                                    <td class="px-4 py-4 text-sm whitespace-nowrap">
                                    <button value="${element.id}" class="btn_editDataKas inline-block border-e p-3  text-gray-700 hover:text-white hover:bg-indigo-700 focus:relative" title="Edit Product">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"class="h-4 w-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                        </svg>
                                    </button>
                                
                                    <button value="${element.id}" class="btn_deleteDataKas inline-block p-3 text-gray-700 hover:text-white hover:bg-indigo-700 focus:relative" title="Delete Product">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                        </svg>
                                    </button>
                                    </td>
                                </tr>
                                `);
                            });
                        } else {
                            noDataMessage.show();
                        }

                        parentDiv.find('.panel').slideDown("slow");
                        parentDiv.find('.detailDown').hide();
                        parentDiv.find('.detailUp').show();

                        Swal.close();
                    },
                    error: function(err) {
                        console.log('Error fetching data', err);
                        Swal.close();
                        location.href = "../view2/login.html"
                    }
                });
            });

            // GET KAS_ID BUAT ADD DATA KAS
            $(document).on('click', '.btnAddDataKas', function(e) {
                e.preventDefault();
                var data_id = $(this).val();
                $("#modal_data_id").val(data_id); // Simpan kas id dalam input tersembunyi
                $("#modalAddDataKas").show();
            });           

            $(document).on('click', '.detailUp', function() {
                var parentDiv = $(this).closest('.rounded-xl');
                parentDiv.find('.panel').slideUp("slow");
                parentDiv.find('.detailDown').show();
                parentDiv.find('.detailUp').hide();
            });

            Swal.close();
        },        
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Akses tidak diberikan',
                showConfirmButton:true,
                allowOutsideClick: false,
            }).then((result) => {
                if(result.isConfirmed){
                    history.go(-1);
                }
            });
        }
    });
}


// ADD DATA KAS
$(document).on('click', '.addDataKas', function(e) {
    e.preventDefault();
    var data_id = document.getElementById('modal_data_id').value;
    var nama_item = document.getElementById('nama_product').value;
    var tanggal = document.getElementById('tanggal').value;
    var qty_sold = document.getElementById('qty_sold').value;
    var income = document.getElementById('income').value;

    if (!nama_item || !tanggal || !qty_sold || !income) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Semua kolom harus diisi!',
        });
        return;
    }

    Swal.fire({
        title: '',
        text: 'loading . . .',
        imageUrl: 'https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif',
        showConfirmButton: false,
        allowOutsideClick: false
    });

    $.ajax({
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        url: 'https://cemilanv1.biz.id/api/data-kas/add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
            data_id: data_id,
            tanggal: tanggal,
            nama_item: nama_item,
            qty_sold: qty_sold,
            income: income,
        }),
        success: function(res) {
            console.log(res);
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: 'Data berhasil ditambahkan!',
            }).then((result) => {
                if(result.isConfirmed){
                    location.href = "../view2/admin.html";
                }
            });
        },
        error: function(err) {
            console.log(err);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Access tidak diberikan!',
                allowOutsideClick: false,
            }).then((result) => {
                if(result.isConfirmed){
                    location.href = "../view2/login.html";
                }
            });
        }
    });
});


// ADD KAS
$(document).on('click', '.addKas', function(e) {
    e.preventDefault();
    
    var bulanan = document.getElementById('tanggalDataKas').value    

    if (!bulanan) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Masukkan tanggal dengan benar',
        });
        return;
    }

    $.ajax({
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        url: 'https://cemilanv1.biz.id/api/kas/add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
            bulanan: bulanan,           
        }),
        success: function(res) {
            console.log(res);
            if($('.addKas').click()) location.href = "../view2/admin.html"
        }
    });
});

//buat modal tambah Kas
$(document).on('click', '.btnAddKas', function() {  
    $("#modalAddKas").show();            
})

$(document).on('click', '.cancelAddKas', function() {  
    $("#modalAddKas").hide();            
})

$(document).on('click', '.cancelAddDataKas', function() {  
    $("#modalAddDataKas").hide();            
})


//SHOW MODAL EDIT DATA KAS
$(document).on('click', '.btn_editDataKas', function(e){
    e.preventDefault();
        var data_id = $(this).val();            
        console.log(data_id);       
        $.ajax({
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        type: "GET",
        url: "https://cemilanv1.biz.id/api/data-kas/one/"+ data_id, 
        success: function (response) {
            console.log(response);
            var modalOutput = document.getElementById("modalEditDataKas");
            modalOutput.innerHTML = '';

            // var output;
            $('.modalEditDataKas').append(`
            <div class="modal-content fixed inset-0 z-10 overflow-y-auto">
                <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
                    <div class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-[#F8F7F4] rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                        <h3 class="text-lg font-medium leading-6 text-gray-800 capitalize" id="modal-title">
                            Edit Data Rekap
                        </h3>
                        <form class="mt-4" id="formEditDataKas">
                            <input type="hidden" id="data_id_edit" value="${response[0].data_id}" />
                            <input type="text" id="id_edit" value="${response[0].id}" hidden />
                            <label class="text-sm text-gray-700">
                                Nama Product
                            </label>
                            <label class="block mt-3">
                                <input type="text" value="${response[0].nama_item}" name="nama_product" id="nama_item_edit" placeholder="Masukkan nama Product" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:focus:border-blue-300" />
                            </label>
                            <label class="text-sm text-gray-700 ">
                                Tanggal
                            </label>
                            <label class="block mt-3">
                                <input type="date" value="${response[0].tanggal}" name="tanggal" id="tanggal_edit" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:focus:border-blue-300" />
                            </label>
                            <label class="text-sm text-gray-700 ">
                                Qty
                            </label>
                            <label class="block mt-3">
                                <input type="text" value="${response[0].qty_sold}" name="qty_sold" id="qty_sold_edit" placeholder="Masukkan qty terjual" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:focus:border-blue-300" />
                            </label>
                            <label class="text-sm text-gray-700 ">
                                Income
                            </label>
                            <label class="block mt-3">
                                <input type="text" value="${response[0].income}" name="income" id="income_edit" placeholder="Masukkan harga pendapatan" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600 dark:focus:border-blue-300" />
                            </label>
                            <div class="mt-4 sm:flex sm:items-center sm:-mx-2">
                                <button type="button" class="cancelEditDataKas w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2 dark:border-gray-700 hover:bg-red-600 hover:text-white focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">
                                    Cancel
                                </button>
                                <button type="button" class="EditDataKas w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                                    Ubah
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            `);
        }
    });         
})

$(document).on('click', '.cancelEditDataKas', function() {  
    $("#modalEditDataKas").empty();            
})


// UPDATE DATA KAS
$(document).on('click', '.EditDataKas', function(e){
    e.preventDefault();

    var id = document.getElementById("id_edit").value;
    var data_id = document.getElementById("data_id_edit").value;
    var tanggal = document.getElementById("tanggal_edit").value;
    var nama_item = document.getElementById("nama_item_edit").value;
    var qty_sold = document.getElementById("qty_sold_edit").value;
    var income = document.getElementById("income_edit").value;

    $.ajax({
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        type: "PUT",
        url: "https://cemilanv1.biz.id/api/data-kas/update/"+ id,
        contentType: 'application/json',
        data: JSON.stringify({ 
            data_id : data_id,
            tanggal: tanggal,
            nama_item: nama_item,
            qty_sold: qty_sold,
            income: income
        }),
        // dataType: "dataType",
        success: function (response) {
            console.log(response);
            if($('.EditDataKas').click()) location.href = "../view2/admin.html"
        }
    });
})



//DELETE DATA KAS
$(document).on('click', '.btn_deleteDataKas', function(e){
    e.preventDefault()
    var id = $(this).val();       
    Swal.fire({
        title: "Yakin?",
        text: "Data yang sudah di hapus tidak bisa dikembalikan",
        icon: "warning",        
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, Hapus"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                timer: 3000,
                showConfirmButton: false
            });
            $.ajax({
                headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
                type: "DELETE",
                url: "https://cemilanv1.biz.id/api/data-kas/delete/"+ id,
                success: function (response) {
                    console.log(response)
                    if($('.btn_delete').click()) location.href = "../view2/admin.html"

                }
            });
        }
    });    
})


