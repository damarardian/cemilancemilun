function showData() { 
    
    var angka = 0;
    let rupiah = new Intl.NumberFormat("id-ID",{
        style:"currency",
        currency:"IDR",        
    })
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
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        url: 'http://127.0.0.1:8000/api/market/admin/organize',
        method: 'GET',    
        success: function(data) {
         
            console.log(data)
            $('#data').empty(); 
         
            data.forEach(function(element) {
                angka += 1;
                $('#data').append(`
                <tr class="  text-gray-700">
                    <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">${angka}</td>
                    <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900"><img src="${element.image_url}" alt="" width="100px"></td>
                    <td class="whitespace-nowrap px-4 py-2 font-medium text-gray-900">${element.nama_barang}</td>
                    <td class="whitespace-nowrap px-4 py-2 text-gray-700">${element.jenis}</td>
                    <td class="whitespace-nowrap px-4 py-2 text-gray-700">${element.stock}</td>
                    <td class="whitespace-nowrap px-4 py-2 text-gray-700">${rupiah.format(element.harga)}</td>
                    <td class="whitespace-nowrap px-4 py-2">       
                        <span class="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                            <button value="${element.id}" class="btn_edit inline-block border-e p-3  text-gray-700 hover:text-white hover:bg-indigo-700 focus:relative" title="Edit Product">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"class="h-4 w-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"/>
                                </svg>
                            </button>
                        
                            <button value="${element.id}" class="btn_delete inline-block p-3 text-gray-700 hover:text-white hover:bg-indigo-700  focus:relative" title="Delete Product">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                                </svg>
                            </button>
                        </span>
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

//get by id
$(document).on('click', '.btn_edit', function(e){
    e.preventDefault();
        var data_id = $(this).val();            
        console.log(data_id);       
        $.ajax({
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        type: "GET",
        url: "http://127.0.0.1:8000/api/market/"+ data_id,
        success: function (response) {
            console.log(response);
            var modalOutput = document.getElementById("modalEdit");
            modalOutput.innerHTML = '';

            // var output;
            $('.modal').append(`
            <div class="modal-content fixed inset-0 z-10 overflow-y-auto">
                <div class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>                    
    
                    <div class="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-[#F8F7F4] rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                        <h3 class="text-lg font-medium leading-6 text-gray-800 capitalize" id="modal-title">
                            Ubah Data Product
                        </h3>    

                        <form class="mt-4" action="#">
                            <input id="id_barang" value="${response[0].id}" hidden />

                            <label class="text-sm text-gray-700">
                                Nama Product
                            </label>
    
                            <label class="block mt-3">
                                <input type="text" name="nama_barang" id="nama_barang" placeholder="Masukkan nama barang" value="${response[0].nama_barang}" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
                            </label>  
                            
                            <label class="text-sm text-gray-700 ">
                                berat
                            </label>
    
                            <label class="block mt-3">
                                <input type="number" min="0" name="berat" id="berat_input" placeholder="Masukkan berat barang" value="${response[0].berat}" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
                            </label>                                      
                            
                            <label class="text-sm text-gray-700">
                               Jenis
                            </label>
    
                            <label class="block mt-3">
                                <select type="text" name="jenis" id="jenis_barang" placeholder="Masukkan jenis barang" value="${response[0].jenis}" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600   dark:focus:border-blue-300"> 
                                    <option class="text-gray-300">Minuman</option>
                                    <option class="text-gray-300">Frozen Food</option>
                                </select>
                            </label>  

                            <label class="text-sm text-gray-700 ">
                                Stock
                            </label>
    
                            <label class="block mt-3">
                                <input type="text" name="stock" id="stock_barang" placeholder="Masukkan stock barang" value="${response[0].stock}" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
                            </label>  

                            <label class="text-sm text-gray-700 ">
                                Harga
                            </label>
    
                            <label class="block mt-3">
                                <input type="text" name="harga" id="harga_barang" placeholder="Masukkan harga barang" value="${response[0].harga}" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
                            </label>
                            
                            <label class="text-sm text-gray-700 ">
                                isi
                            </label>
    
                            <label class="block mt-3">
                                <input type="number" min="0" name="desc" id="desc_barang" placeholder="masukan jumlah isi perbungkus" value="${response[0].desc}" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
                            </label>                         
    
                            <div class="mt-4 sm:flex sm:items-center sm:-mx-2">
                                <button type="button" class="cancelButton w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2  dark:border-gray-700 hover:bg-red-600 hover:text-white focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">
                                    Cancel
                                </button>
    
                                <button type="button" class="btn-update w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
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

// POST
$(document).on('click', '#ppp', function(e){
    e.preventDefault();
    $("#modalAdd").hide();

    var formData = new FormData($('#formSubmit')[0]);

    if (!formData.get('image').name || !formData.get('nama_barang') || !formData.get('berat') || !formData.get('jenis') || !formData.get('stock') || !formData.get('harga') || !formData.get('desc')) {
        return Swal.fire("Column Wajib Diisi semua", "", "info").then((result) => {            
            if (result.isConfirmed) {
              $("#modalAdd").show();
            } 
          });

    }

    // var modalAdd = document.getElementById("modalAdd")
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
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        url: 'http://127.0.0.1:8000/api/market/add',
        method: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        success: function(res) {           
            Swal.close();
            Swal.fire({
                title: "Berhasil!",
                text: "Data Product Sudah Ditambahkan",
                icon: "success",
                confirmButtonText: "Oke",                
                }
            ).then(function(isConfirm){
                if (isConfirm) {
                    location.href = "../view2/organisir.html"
                }
            });
        },
        error: function(err) {
            console.error(err);       
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",  
              });
        }        
    });                          
})


//update
$(document).on('click', '.btn-update', function(e){
    e.preventDefault();

    var id_barang = document.getElementById("id_barang").value;
    var nama_barang = document.getElementById("nama_barang").value;
    var berat_barang = document.getElementById("berat_input").value;
    var jenis_barang = document.getElementById("jenis_barang").value;
    var stock_barang = document.getElementById("stock_barang").value;
    var harga_barang = document.getElementById("harga_barang").value;
    var desc = document.getElementById("desc_barang").value;

    console.log(id_barang,nama_barang,berat_barang,jenis_barang,stock_barang,harga_barang,desc)

    $.ajax({
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        type: "POST",
        url: "http://127.0.0.1:8000/api/market/update/"+ id_barang,
        contentType: 'application/json',
        data: JSON.stringify({ 
            id : id_barang,
            nama_barang: nama_barang,
            berat: berat_barang,
            stock: stock_barang,
            jenis: jenis_barang,
            harga: harga_barang,
            desc: desc
        }),
        // dataType: "dataType",
        success: function (response) {
            console.log(response);
            location.href = "../view2/organisir.html"
        }
    });
})

//DELETE PRODUCT
$(document).on('click', '.btn_delete', function(e){
    e.preventDefault()
    var data_id = $(this).val();   

    //var get_id = document.getElementById("get_id").value
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
            icon: "success"
            });
            $.ajax({
            headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
            type: "DELETE",
            url: "http://127.0.0.1:8000/api/market/delete/"+ data_id,
            success: function (response) {
                console.log(response)
                location.href = "../view2/organisir.html"

            }
            });
        }
    });    
})