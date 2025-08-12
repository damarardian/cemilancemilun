//REGISTER
$(document).on('click', '#register', function (e) {
    e.preventDefault();
    var email = document.getElementById('regEmail').value
    var nama = document.getElementById('regNama').value
    var password = document.getElementById('regPassword').value

    // console.log(email, nama, password)

    if (!nama || !email || !password){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Pastikan mengisi semua form"
        })
        return undefined
    }

    if (password.length < 9){
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Password Harus Lebih Dari 8 Digit"
        })
        return undefined
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
    
    $.ajax({
        type: "POST",
        url: "https://cemilanv1.biz.id/api/register",        
        dataType: "JSON",
        data: {
            "email": email,
            "name": nama,
            "password": password,            
            "role": 'user',            
        },
        success: function (response) {       
            Swal.close();               
            Swal.fire({
                title: "Akun Sudah Dibuat!",
                text: "Silahkan cek email anda untuk melakukan verifikasi",
                icon: "success",            
              }).then((result) => {
                if (result.isConfirmed) {
                  location.href = "../view2/login.html"
                }
              });                       
              
        },
        error: function() {   
            Swal.close();         
            Swal.fire({
                title: "Gagal Membuat Akun!",
                text: "Akun sudah dipakai",
                icon: "error",            
              })
        }
    });
})

//LOGIN
$(document).on('click', '#login', function (e) {
  e.preventDefault();
  var token = window.localStorage.getItem('setToken');
  var email = document.getElementById('email').value    
  var password = document.getElementById('password').value

  
  if(!token){
    $('.logedIn').addClass("hidden");
    $('.guestMenu').removeClass("hidden");        
  } else {
    $('.logedIn').removeClass("hidden");
    $('.guestMenu').addClass("hidden");    
  }

  $.ajax({
    type: "POST",
    url: "https://cemilanv1.biz.id/api/login",        
    dataType: "JSON",
    data: {
      "email": email,            
      "password": password,            
    },
    success: function (response) {            
      window.localStorage.setItem('setToken', response.access_token); 
      console.log(response);
      if (response.Role[0].role == 'admin') {
          location.href = "../view2/admin.html"
      } else {
          location.href = "../view2/index.html"
      }                     
    },
    error: function(error) {
      console.error('Error:', error);
      Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Pastikan Email Sudah Di Verifikasi, dan password atau email anda benar",                
      });
    }
  });         
})

//LOGOUT
$(document).on('click', '#logout', function (e) {
    e.preventDefault();
    token = window.localStorage.getItem('setToken');
    
    $.ajax({        
        url: "https://cemilanv1.biz.id/api/logout",        
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {            
            console.log(response);            
                localStorage.removeItem('setToken');                
                localStorage.removeItem('id');                
                window.location.href = 'login.html';            
        },
        error: function(error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "gagal logout",                
            });
        }
    });
})


// FORGOT PASSWORD
$(document).on('click', '#forgot', function (e) {
    e.preventDefault();
    // token = window.localStorage.getItem('setToken');
    email = document.getElementById("forgotEmail").value

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
        url: "https://cemilanv1.biz.id/api/password/email",        
        method: 'POST',
        data: {                  
            "email": email,            
        },
        success: function () {                          
            Swal.close();
            Swal.fire({
                icon: "success",
                title: "Link Terkirim",
                text: "Silahkan Cek email anda",  
                showConfirmButton: true              
            }).then((result) => {
                if(result.isConfirmed){
                    location.href = "../view2/login.html";
                }
            });
        },
        error: function(error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                title: "Gagal",
                text: "Gagal Forgot Password",                
              });
        }
    });
});

// ACCOUNT redirect berdasarkan role
$(document).on('click', '#btnAccount', function(e) {
  e.preventDefault();
   $.ajax({
    type: "GET",
    url: "https://cemilanv1.biz.id/api/profile",
    headers: {"Authorization": "Bearer " + localStorage.getItem('setToken')},
    
      success: function (response) {
        console.log(response)
        var role = response.role;
        if (role === 'admin') {
          location.href = "../view2/profile.html";          
        } else {
          location.href = "../view2/profileUser.html";
        }
      }
   });
})

