function showData() { 

    var tableRow = document.getElementById("index");
    var angka = 0;
    let rupiah = new Intl.NumberFormat("id-ID",{
        style:"currency",
        currency:"IDR"
    })
    swal({
        title: "",
        text: "loading . . .",
        icon: "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif",
        button: false
    });
    $.ajax({
        url: 'https://cemilanv1.biz.id/api/market',
        type: 'GET',
            success: function(res) {
                console.log(res);
                tableRow.innerHTML = '';
                var output = "";
                res.forEach(element => {
                    angka++;
                    output += `
                    <li class="table-row">
                        <div id="${element.id}" hidden> </div>
                        <div class="col col-1" data-label="Job Id">${angka}</div>
                        <div class="col col-2" data-label="nama_barang">${element.nama_barang}</div>
                        <div class="col col-3" data-label="jenis_barang">${element.jenis}</div>
                        <div class="col col-4" data-label="stock_barang">${element.stock}</div>
                        <div class="col col-5" data-label="harga_barang">${rupiah.format(element.harga)}</div>
                        <div class="col col-6" data-label="actions">
                            <button id="get_id" class="btn_delete" value="${element.id}"> <img src="../images/icon/delete.png" width="20px"> </button>
                            <button class="btn" value="${element.id}"> <img src="../images/icon/edit.png" width="20px"> </button>                         
                        </div> 
                    </li>
                    `;
                });                
                $('.data').append(output);
                swal.close();
            }

        
    });
}



//get by id
$(document).on('click', '.btn', function(e){
    e.preventDefault();
        var data_id = $(this).val();            
        console.log(data_id);       
        $.ajax({
        type: "GET",
        url: "https://cemilanv1.biz.id/api/market/"+ data_id,
        // data: "data",
        // dataType: "dataType",
        success: function (response) {
            console.log(response);
            var modalOutput = document.getElementById("myModal");
            modalOutput.innerHTML = '';

            // var output;
            $('.modal').append(`
            <div class="modal-content absolute">
            <span class="close">&times;</span>
                <div class="w-full max-w-sm p-6 m-auto mx-auto  rounded-lg shadow-md">            
                    <form class="mt-6">  
                        <input type="text" id="id_barang" value="${response[0].id}" hidden>
                        <div>
                            <label for="nama_barang" class="block text-sm dark:text-gray-800 text-gray-200">Nama</label>
                            <input type="text" id="nama_barang" value="${response[0].nama_barang}" class="block w-full px-4 py-2 mt-2 bg-white border rounded-lg text-slate-900 border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>      
                        <div class="mt-4">
                            <div class="flex items-center justify-between">
                                <label for="stock" class="block text-sm dark:text-gray-800 text-gray-200">Stock</label>
                            </div>            
                            <input type="text" id="stock_barang" value="${response[0].stock}" class="block w-full px-4 py-2 mt-2 bg-white border rounded-lg text-slate-900 border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>       
                        <div class="mt-4">
                            <div class="flex items-center justify-between">
                                <label for="jenis" class="block text-sm dark:text-gray-800 text-gray-200">Jenis</label>
                            </div>            
                            <input type="text" id="jenis_barang" value="${response[0].jenis}"class="block w-full px-4 py-2 mt-2 bg-white border rounded-lg text-slate-900 border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>                              
                        <div class="mt-4">
                            <div class="flex items-center justify-between">
                                <label for="harga" class="block text-sm dark:text-gray-800 text-gray-200">Harga</label>
                            </div>            
                            <input type="text" id="harga_barang" value="${response[0].harga}" class="block w-full px-4 py-2 mt-2 bg-white border rounded-lg text-slate-900 border-blue-500 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
                        </div>              
                        <div class="flex items-center mt-6 -mx-2">  
                            <button type="button" class="btn flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none">
                                Update      
                            </button>                              
                        </div>   
                    </form>         
                </div>
            </div>
            `);
            // output = `        
            
            // `;
        }
    });         
})

$(document).on('click', '.btn_update', function(e){
    e.preventDefault();

    var id_barang = document.getElementById("id_barang").value;
    var nama_barang = document.getElementById("nama_barang").value;
    var jenis_barang = document.getElementById("jenis_barang").value;
    var stock_barang = document.getElementById("stock_barang").value;
    var harga_barang = document.getElementById("harga_barang").value;

    $.ajax({
        type: "PUT",
        url: "https://cemilanv1.biz.id/api/market/update/"+ id_barang,
        contentType: 'application/json',
        data: JSON.stringify({ 
            id : id_barang,
            nama_barang: nama_barang,
            stock: stock_barang,
            jenis: jenis_barang,
            harga: harga_barang
        }),
        // dataType: "dataType",
        success: function (response) {
            console.log(response);
            if($('.btn_update').click()) location.href = "../view2/index.html"
        }
    });
})

$(document).on('click', '.btn_delete', function(e){
    e.preventDefault()

    var get_id = document.getElementById("get_id").value

    $.ajax({
        type: "DELETE",
        url: "https://cemilanv1.biz.id/api/market/delete/"+ get_id,
        success: function (response) {
            console.log(response)
            if($('.btn_delete').click()) location.href = "../view2/index.html"

        }
    });
    
})

 // POST
 $('#formSubmit').on('submit', function(event) {
    console.log('asdasd')
    event.preventDefault();

    var nama_barang = document.getElementById('namaBarang').value
    var jenis = document.getElementById('jenisBarang');
    var optValue = jenis.value;
    var stock = document.getElementById('stockBarang').value;
    var harga = document.getElementById('hargaBarang').value;

    if(nama_barang.length == 0 || optValue.length == 0 || stock.length == 0 || harga.length == 0 ){
        console.log('asdasd')
        return swal('', 'isi form yang masih kosong', 'warning');
    }

    swal({
        title: "",
        text: "loading . . .",
        icon: "https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif",
        button: false
    });

    $.ajax({
        url: 'https://cemilanv1.biz.id/api/market/add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 
            nama_barang: nama_barang,
            jenis: optValue,
            stock: stock,
            harga: harga
        }),
        success: function(res) {
            console.log(res);
            swal.close();
            if($('#addData').click()) location.href = "../view2/index.html"
        }
    });
});
    