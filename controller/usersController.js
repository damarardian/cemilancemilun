function showData(){
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
    url: "http://127.0.0.1:8000/api/user?page=1", 
    headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
    success: function (response) {
     
      response.data.forEach(function (element)  {
       
        let name = element.name ? element.name : 'N/A';
        let email = element.email ? element.email : 'N/A';
        let notelp = element.notelp ? element.notelp : 'N/A';
        let verified = element.email_verified_at ? element.email_verified_at : 'N/A';


        $('#data_user').append(`
          <tr>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${name}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="role text-gray-900 whitespace-no-wrap">
              ${element.role}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
              ${email}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${notelp}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${verified}
              </p>
            </td>
            <td class="px-5 py-5 flex text-sm bg-white border-b border-gray-200">
              <button value="${element.id}" class="btnEdit inline-block border-e p-3  text-gray-700 hover:text-white hover:bg-indigo-700 focus:relative" title="Edit Product">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
              </svg>
              </button>
          
              <button value="${element.id}" class="btn_delete inline-block p-3 text-gray-700 hover:text-white hover:bg-indigo-700  focus:relative" title="Delete Product">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                  </svg>
              </button>
            </td>
          </tr>      
        `)
      });

      response.links.forEach(function (element_page)  {
        var page = element_page.url;                
        var bgActived = '';
        var textActived = '';
        var disable = '';

        if (element_page.active == true) {
          bgActived = 'bg-blue-600';
          textActived = 'text-white';
        }

        if(element_page.url == null){
          disable = 'disabled'
        }

        $('#pagination').append(`
          <button type="button" value="${page}" ${disable} class="${bgActived} ${textActived} btn_page w-auto h-10 px-4 border py-2 text-base  border-t border-b hover:bg-gray-100 ">
           ${element_page.label}   
          </button>          
        `)
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

// PAGINATION
$(document).on('click','.btn_page', function(e){
  var currentPage = $(this).val()

  $.ajax({
    type: "GET",
    url: currentPage, 
    headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
    success: function (response) {
      $('#data_user').empty()
      response.data.forEach(function (element)  {
       
        let name = element.name ? element.name : 'N/A';
        let email = element.email ? element.email : 'N/A';
        let notelp = element.notelp ? element.notelp : 'N/A';
        let verified = element.email_verified_at ? element.email_verified_at : 'N/A';

        
        $('#data_user').append(`
          <tr>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${name}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="role text-gray-900 whitespace-no-wrap">
              ${element.role}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
              ${email}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${notelp}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${verified}
              </p>
            </td>
            <td class="px-5 py-5 flex text-sm bg-white border-b border-gray-200">
              <button value="${element.id}" class="btnEdit inline-block border-e p-3  text-gray-700 hover:text-white hover:bg-indigo-700 focus:relative" title="Edit Product">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
              </svg>
              </button>
          
              <button value="${element.id}" class="btn_delete inline-block p-3 text-gray-700 hover:text-white hover:bg-indigo-700  focus:relative" title="Delete Product">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                  </svg>
              </button>
            </td>
          </tr>      
        `)
      });

      $('#pagination').empty();
      response.links.forEach(function (element_page)  {
        var page = element_page.url; 
        var bgActived = '';
        var textActived = '';
        var disable = '';

        if (element_page.active == true) {
          bgActived = 'bg-blue-600';
          textActived = 'text-white';
        }

        if(element_page.url == null){
          disable = 'disabled'
        }
              
        $('#pagination').append(`
          <button type="button" value="${page}" ${disable} class="${bgActived} ${textActived} btn_page w-auto h-10 px-4 border py-2 text-base border-t border-b hover:bg-gray-100 ">
           ${element_page.label}   
          </button>          
        `)
      });
    }
  });  
})


// SEARCH MEMBER
$(document).on('click','#cari', function(e){
  e.preventDefault();

  let keyword = $('#keyword').val()
  console.log(keyword)

  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/user?keyword="+ keyword,     
    headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
    success: function (response) {
      $("#data_user").empty();
      response.data.forEach(function (element)  {
       
        let name = element.name ? element.name : 'N/A';
        let email = element.email ? element.email : 'N/A';
        let notelp = element.notelp ? element.notelp : 'N/A';
        let verified = element.email_verified_at ? element.email_verified_at : 'N/A';


        $('#data_user').append(`
          <tr>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${name}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="role text-gray-900 whitespace-no-wrap">
              ${element.role}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
              ${email}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${notelp}
              </p>
            </td>
            <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
              <p class="text-gray-900 whitespace-no-wrap">
                ${verified}
              </p>
            </td>
            <td class="px-5 py-5 flex text-sm bg-white border-b border-gray-200">
              <button value="${element.id}" class="btnShowData inline-block border-e p-3  text-gray-700 hover:text-white hover:bg-indigo-700 focus:relative" title="Edit Product">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
              </svg>
              </button>
          
              <button value="${element.id}" class="btn_delete inline-block p-3 text-gray-700 hover:text-white hover:bg-indigo-700  focus:relative" title="Delete Product">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
                  </svg>
              </button>
            </td>
          </tr>      
        `)
      });

      $('#pagination').empty();
      response.links.forEach(function (element_page)  {
        var page = element_page.url; 
        var bgActived = '';
        var textActived = '';
        var disable = '';

        if (element_page.active == true) {
          bgActived = 'bg-blue-600';
          textActived = 'text-white';
        }

        if(element_page.url == null){
          disable = 'disabled'
        }
       
       
        $('#pagination').append(`
          <button type="button" value="${page}" ${disable} class="${bgActived} ${textActived} btn_page w-auto h-10 px-4 border py-2 text-base border-t border-b hover:bg-gray-100 ">
           ${element_page.label}   
          </button>          
        `)
      });
    }
  });
})


//UPDATE MEMBER
$(document).on('click', '.btnEdit', function() {  
  $("#modalEditMember").show();
  var id = $(this).val()
  
  $.ajax({
    type: "GET",
    url: "http://127.0.0.1:8000/api/user/"+id,
    headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
    success: function (response) {
      console.log(response)

      $('#formUpdate').empty();
      response.forEach(function (element) {      
        var select = '';

        if (element.role === 'admin') {
          select = 'selected';
        }

        $('#formUpdate').append(`
          <input type="hidden" id="user_id" value="${element.id}">
          
          <label class="text-sm text-gray-700 ">
              Nama
          </label>

          <label class="block mt-3">
              <input type="text" value="${element.name}" name="nama" id="edit_nama" placeholder="Nama User" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
          </label> 

          <label class="text-sm text-gray-700 ">
              Role
          </label>

          <label class="block mt-3">
              <select type="text" name="role" id="edit_role" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600   dark:focus:border-blue-300"> 
                  <option class="text-gray-300">user</option>
                  <option class="text-gray-300" ${select}>admin</option>
              </select>
          </label>  
          
          <label class="text-sm text-gray-700 ">
              Email
          </label>

          <label class="block mt-3">                                            
              <input type="email" value="${element.email}" name="email_member" id="edit_email" placeholder="Email Aktif" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
          </label>  

          <label class="text-sm text-gray-700 ">
              Password
            </label>

            <label class="block mt-3">                                            
                <input type="password" name="password_member" id="edit_password" placeholder="Ganti Password" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
            </label>

          <label class="text-sm text-gray-700 ">
              Telepon
          </label>

          <label class="block mt-3">
              <input type="number" min="0" value="${element.notelp}" name="notelp" id="edit_notelp" placeholder="Nomor Telepon" class="block w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:border-gray-600  dark:focus:border-blue-300" />
          </label>                                  

          <div class="mt-4 sm:flex sm:items-center sm:-mx-2">
              <button type="button" class="cancelEdit w-full px-4 py-2 text-sm font-medium tracking-wide text-gray-700 capitalize transition-colors duration-300 transform border border-gray-200 rounded-md sm:w-1/2 sm:mx-2  dark:border-gray-700 hover:bg-red-600 hover:text-white focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-40">
                  Cancel
              </button>

              <button type="button" id="saveUpdateMember" class=" w-full px-4 py-2 mt-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md sm:mt-0 sm:w-1/2 sm:mx-2 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                  Ubah
              </button>
          </div>
        `)
      });
    }
  });
})

$(document).on('click', '.cancelEdit', function() {  
  $("#modalEditMember").hide();            
})


$(document).on('click', '#saveUpdateMember', function(e){
  e.preventDefault()
  console.log('tambahan')

  var id = $('#user_id').val()
  var email = $('#edit_email').val()
  var nama = $('#edit_nama').val()
  var password = $('#edit_password').val()
  var role = $('#edit_role').find(":selected").val()
  var telp = $('#edit_notelp').val()

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
    url: "http://127.0.0.1:8000/api/user/update/"+id,
    headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
    dataType: "JSON",
    data: {
        "name": nama,
        "email": email,
        "password": password,            
        "role": role,
        "notelp": telp,
    },  
    success: function (response) {
      console.log(response)
      swal.close();
      Swal.fire({
        title: "Berhasil!",
        text: "Akun Diubah",
        icon: "success",            
      }).then((result) => {
        if(result.isConfirmed){
          location.href = '../view2/users.html'
        }
      })
    }
  });
})



//ADD MEMBER BARU
$(document).on('click', '#addMember', function() {  
  $("#modalAddMember").show();            
})

$(document).on('click', '.cancelAdd', function() {  
  $("#modalAddMember").hide();            
})


$(document).on('click', '#saveTambahMember', function(e){
  e.preventDefault()

  var email = $('#email_member').val()
  var nama = $('#nama_member').val()
  var password = $('#password_member').val()
  var role = $('#role_member').find(":selected").val()
  var telp = $('#notelp').val()
  var verified = $('#verifikasi').find(":selected").val()

  var tgl = new Date();

  var hari = tgl.getDate();
  var bulan = tgl.getMonth() + 1;
  var tahun = tgl.getFullYear();

  var tglSekarang = tahun + '-' + bulan + '-' + hari;
  $('#tglSekarang').val(tglSekarang)

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
    type: "POST",
    url: "http://127.0.0.1:8000/api/user/add",
    headers: { "Authorization": "Bearer " + localStorage.getItem('setToken') },
    dataType: "JSON",
    data: {
        "name": nama,
        "email": email,
        "password": password,            
        "role": role,
        "notelp": telp,
        "email_verified_at" : verified,            
    },  
    success: function (response) {
      console.log(response)
      swal.close();
      Swal.fire({
        title: "Berhasil!",
        text: "Akun dengan nama "+response.data.name+" terbuat",
        icon: "success",            
      }).then((result) => {
        if(result.isConfirmed){
          location.href = '../view2/users.html'
        }
      })
    }
  });
})


// DELETE MEMBER

$(document).on('click', '.btn_delete', function(e){
  e.preventDefault()

  var id = $(this).val()

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
        showConfirmButton: false
        });
        $.ajax({
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        type: "DELETE",
        url: "http://127.0.0.1:8000/api/user/delete/"+ id,
        success: function (response) {
            console.log(response)
            location.href = "../view2/users.html"
        }
        });
    }
});
})