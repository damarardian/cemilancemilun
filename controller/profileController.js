
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
      url: "http://127.0.0.1:8000/api/profile",
      headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
      success: function (response) {  
        console.log(response)
        
        id = response[0]['id'];

        console.log(id) 
        var pembelian = 0;  
        $('.name').val(response[0]['name'])
        $('.name').text(response[0]['name'])
        $('.names').text(response[0]['name'])
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

function showDataAdmin(){   
  $.ajax({
      method : "GET",
      url: "http://127.0.0.1:8000/api/profile",
      headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
      success: function (response) {
        var role = response[0]['role'];    

        if (role === 'user') {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Access tidak diberikan!',
            allowOutsideClick: false,
          }).then((result) => {
              if(result.isConfirmed){
                location.href = "../view2/profileUser.html";
              }
          });         
        }
        console.log(response)
        
        $('.name').val(response[0]['name'])
        $('.name').text(response[0]['name'])
        $('.email').val(response[0]['email'])
        $('.email').text(response[0]['email'])
        $('#phone').val(response[0]['notelp'])
        $('#provinsi').val(response[0]['provinsi'])
        $('#provinsi').text(response[0]['provinsi'])
        $('#kota').val(response[0]['kota'])
        $('#kota').text(response[0]['kota'])
        $('#message').text(response[0]['alamat'])
        $('#role').val(response[0]['role'])
      }
  });
}


$(document).on('click', '.ubahData', function (e) {
    e.preventDefault();

    $('.name').prop('disabled', false)
    $('#phone').prop('disabled', false)
    $('#Option1').prop('disabled', false)
    $('#Option2').prop('disabled', false)
    $('#message').prop('disabled', false)
  
    $('.ubahData').addClass('hidden')
    $('.formUbahData').removeClass('hidden')
    $("#provinsi").removeAttr("selected");
    $("#kota").removeAttr("selected");

    $('.saveUbah').removeClass('hidden')
    $('.cancelUbah').removeClass('hidden')
    

    $.ajax({
        url: 'http://127.0.0.1:8000/api/provinsi',
        method: 'GET',
        dataType: 'json',                     
        success: function(data) {                      
            data.forEach(function(element) {             
                $('#Option1').append(`
                    <option class="" value="${element.province_id}">${element.province}</option>   
                `);
            });
        }
    })

})

$(document).on('click', '.cancelUbah', function (e) {
    e.preventDefault();

    $.ajax({
        method : "GET",
        url: "http://127.0.0.1:8000/api/profile",
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        success: function (response) {
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

            $("#Option1 option[value='"+response[0]['provinsi']+"']").attr("selected","selected");
            $("#Option2 option[value='"+response[0]['kota']+"']").attr("selected","selected");

            $('.child').remove();
        }
    });

    $('.ubahData').removeClass('hidden')
    $('.saveUbah').addClass('hidden')
    $('.cancelUbah').addClass('hidden')
    $('.formUbahData').addClass('hidden')


    $('.name').prop('disabled', true)
    $('#phone').prop('disabled', true)
    $('#Option1').prop('disabled', true)
    $('#Option2').prop('disabled', true)
    $('#message').prop('disabled', true)
})


$(document).on('click', '.saveUbah', function (e) {
    e.preventDefault();
    var nama = $('.name').val();
    var noTelp = $('#phone').val();
    var provinsi = $('#Option1 option:selected').text();
    var kota = $('#Option2 option:selected').text();
    var kota_id = $('#Option2 option:selected').val();
    var alamat = $('#message').val();
    var role = $('#role').val()
    console.log(nama, noTelp, provinsi, kota, kota_id, alamat, role)

    var token = localStorage.getItem('setToken');
    
    Swal.fire({
        title: "Loading!",
        text: "Mohon Bersabar",
        imageUrl: "../images/icon/loading.gif",
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Loading",
        showConfirmButton: false
    });

    if (!nama || !provinsi || !kota || !noTelp || !alamat) {
        swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Gagal Update Data Diri',
            text: 'Mohon isi column yang kosong',
        })
        return undefined;
    }

    $.ajax({
        method : "PUT",
        url: "http://127.0.0.1:8000/api/profile/update",
        headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
        contentType: 'application/json',
        data: JSON.stringify({ 
            name : nama,
            notelp: noTelp,
            provinsi: provinsi,
            kota: kota,
            kota_id: kota_id,
            alamat: alamat,
            role : role
        }),
        success: function (response) {
          console.log(response)
            swal.close()
            // if(role === 'admin'){
            //   location.href = "../view2/profile.html"

            // } else {
            //   location.href = "../view2/profileUser.html"
            // }
        }
    });
})


function showKota(){
    let id_province = document.getElementById('Option1').value
    
    $.ajax({
      url: 'http://127.0.0.1:8000/api/provinsi/kota/'+id_province,
      method: 'GET',
      dataType: 'json',                     
      success: function(data) {
        // data = JSON.parse(data)
        $('.child').remove();
        // $('#Option2').append(`<option class="" id="kota" value="" selected="selected" disabled></option>`);
        data.forEach(function(element) {             
            $('#Option2').append(`
                <option class="child" value="${element.city_id}">${element.city_name}</option>   
            `);
        });
      }
    })
  }
