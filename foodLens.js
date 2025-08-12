// Ganti dengan base URL API Laravel Anda
const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

function showData() { 
var token = window.localStorage.getItem('setToken');

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
}
/**
 * Mengonversi URL gambar menjadi string Base64.
 * Ini diperlukan agar gambar dapat dikirim ke Gemini Vision API.
 * @param {string} url - URL gambar yang akan dikonversi.
 * @returns {Promise<string|null>} - String Base64 atau null jika terjadi error.
 */
async function toBase64(url) {
    try {
        // Menggunakan proxy untuk menghindari masalah CORS saat mengambil gambar dari Cloudinary
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Gagal memuat gambar: ${response.statusText}`);
        }
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error converting image to Base64:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat Gambar',
            text: 'Terjadi masalah saat memproses gambar dari server. Coba lagi nanti.',
        });
        return null;
    }
}

/**
 * Memuat data produk dari API dan menampilkannya di galeri.
 */
function loadProducts() {
    const gallery = $('#gallery');
    // Menampilkan pesan loading saat data diambil
    gallery.html('<p class="text-center text-gray-500 col-span-full">Memuat produk...</p>');

    $.ajax({
        url: `${API_BASE_URL}/market`, // Endpoint untuk mengambil semua produk
        method: 'GET',
        dataType: 'json',
        success: function(products) {
            gallery.empty(); // Hapus pesan loading

            if (!products || products.length === 0) {
                gallery.html('<p class="text-center text-gray-500 col-span-full">Belum ada produk yang tersedia.</p>');
                return;
            }

            // Loop melalui setiap produk dari API dan buat kartu HTML-nya
            products.forEach(food => {
                // Pastikan nama field sesuai dengan kolom di database Anda ('nama_barang' dan 'image_url')
                const foodCard = `
                    <div class="food-item w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl cursor-pointer" 
                         data-image-url="${food.image_url}" data-food-name="${food.nama_barang}">
                        <img src="${food.image_url}" alt="${food.nama_barang}" class="h-80 w-72 object-cover rounded-t-xl" onerror="this.onerror=null;this.src='https://placehold.co/288x320/FFF5EA/333?text=Gambar+Rusak';" />
                        <div class="px-4 py-3 w-72">
                            <p class="text-lg font-bold text-black truncate block capitalize">${food.nama_barang}</p>
                            <div class="flex items-center">
                                <p class="text-sm text-gray-600 cursor-auto my-3">Klik untuk bertanya pada AI</p>
                            </div>
                        </div>
                    </div>
                `;
                gallery.append(foodCard);
            });
        },
        error: function(xhr) {
            console.error("Gagal mengambil data produk:", xhr);
            gallery.empty(); // Hapus pesan loading
            // Tampilkan pesan error yang jelas kepada pengguna
            const errorHTML = `
                <div class="col-span-full text-center p-8 bg-red-100 rounded-lg">
                    <h3 class="font-bold text-red-800">Gagal Memuat Produk</h3>
                    <p class="text-red-600 mt-2">Tidak dapat terhubung ke server. Silakan coba muat ulang halaman nanti.</p>
                </div>
            `;
            gallery.html(errorHTML);
        }
    });
}


$(document).ready(function() {
    const gallery = $('#gallery');
    const modal = $('#foodLensModal');
    let selectedImageUrl = '';
    let selectedFoodName = '';
    let imageBase64 = '';

    // 1. Panggil fungsi untuk memuat produk dari API saat halaman siap
    loadProducts();

    // 2. Event handler saat gambar di galeri diklik (logika ini tidak berubah)
    gallery.on('click', '.food-item', async function() {
        const item = $(this);
        selectedImageUrl = item.data('image-url');
        selectedFoodName = item.data('food-name');

        Swal.fire({
            title: 'Mempersiapkan FoodLens...',
            text: 'Mohon tunggu sebentar.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        imageBase64 = await toBase64(selectedImageUrl);
        Swal.close();

        if (imageBase64) {
            $('#selectedImage').attr('src', selectedImageUrl);
            $('#selectedFoodName').text(selectedFoodName);
            $('#chatContainer').html('<div class="p-3 rounded-lg bg-blue-100 text-blue-800 text-sm">Hai! Ada yang ingin kamu ketahui tentang makanan ini? Tanyakan saja di bawah.</div>');
            modal.removeClass('hidden').addClass('flex');
        }
    });

    // 3. Menutup modal (logika ini tidak berubah)
    $('#closeModal').on('click', function() {
        modal.addClass('hidden').removeClass('flex');
    });

    modal.on('click', function(e) {
        if ($(e.target).is(modal)) {
            modal.addClass('hidden').removeClass('flex');
        }
    });

    // 4. Submit form pertanyaan ke AI (logika ini tidak berubah)
    $('#geminiForm').on('submit', function(e) {
        e.preventDefault();
        const prompt = $('#inputPrompt').val();
        if (!prompt.trim()) return;

        const userPromptHTML = `<div class="flex justify-end"><div class="p-3 rounded-lg bg-green-200 text-gray-800 text-sm max-w-xs">${prompt}</div></div>`;
        $('#chatContainer').append(userPromptHTML);
        
        const loadingHTML = `<div id="loading-indicator" class="p-3 rounded-lg bg-gray-200 text-gray-600 text-sm">Gemini sedang berpikir... 🤔</div>`;
        $('#chatContainer').append(loadingHTML);
        $('#chatContainer').scrollTop($('#chatContainer')[0].scrollHeight);

        $('.submit-text').addClass('hidden');
        $('.spinner').removeClass('hidden');
        $('#geminiForm button').prop('disabled', true);
        
        $.ajax({
            url: `${API_BASE_URL}/ask-gemini`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                prompt: prompt,
                nama_makanan: selectedFoodName,
                image: imageBase64
            }),
            success: function(response) {
                $('#loading-indicator').remove();
                const formattedResponse = response.result.replace(/\n/g, '<br>');
                const aiResponseHTML = `<div class="p-3 rounded-lg bg-blue-100 text-blue-800 text-sm">${formattedResponse}</div>`;
                $('#chatContainer').append(aiResponseHTML);
            },
            error: function(xhr) {
                $('#loading-indicator').remove();
                const errorMsg = xhr.responseJSON?.error || 'Terjadi kesalahan. Coba lagi nanti.';
                const errorHTML = `<div class="p-3 rounded-lg bg-red-200 text-red-800 text-sm">${errorMsg}</div>`;
                $('#chatContainer').append(errorHTML);
            },
            complete: function() {
                $('#inputPrompt').val('');
                $('.submit-text').removeClass('hidden');
                $('.spinner').addClass('hidden');
                $('#geminiForm button').prop('disabled', false);
                $('#chatContainer').scrollTop($('#chatContainer')[0].scrollHeight);
            }
        });
    });
});
