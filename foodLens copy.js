function showData() { 
  $.ajax({
    url: 'http://127.0.0.1:8000/api/market',
    method: 'GET',
    success: function (data) {

      console.log(data)

      $('#gallery').empty();

      data.forEach(function (element) {       

        $('#gallery').append(`
                <label class="image-choice relative cursor-pointer">
                  <input type="radio" name="chosenImage" value="${element.image_url}" class="absolute opacity-0">
                    <div class="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl image-container">
                        <div class="block">
                            <img
                            src="${element.image_url}"
                            alt="Product" class="h-80 w-72 object-cover rounded-t-xl" />
                            <div class="px-4 py-3 w-72">
                            <span class="text-gray-400 mr-3 uppercase text-xs">${element.jenis}</span>
                            <p class="nama_hidangan text-lg font-bold text-black truncate block capitalize">${element.nama_barang}</p>                            
                            </div>
                        </div>
                    </div>        
                </label>  
            `);
            console.log(element.image_url)
      });

      // Tambahkan event listener untuk radio buttons
      $('input[name="chosenImage"]').change(function() {
        // Hapus border biru dari semua gambar
        $('.image-container').removeClass('ring-4 ring-blue-500');
        
        // Tambahkan border biru ke gambar yang dipilih
        $(this).closest('.image-choice').find('.image-container').addClass('ring-4 ring-blue-500');
      });
    },
    error: function (err) {
      console.log('Error fetching data', err);
    }
  });
}




$(document).ready(function() {
    const $sendButton = $('#sendButton');
    const $questionInput = $('#inputPrompt');
    const $responseBox = $('#responseBox');
    const $responseContent = $('#responseContent');
    const $closeResponseBox = $('#closeResponseBox');
    
    // $sendButton.on('click', function() {
    //     const question = $questionInput.val().trim();
        
    //     if (question) {
    //         // Show loading state
    //         $responseContent.text("Loading...");
    //         $responseBox.removeClass('hidden').show(); // Explicitly show the element
            
    //         // Here you would typically send the question to your backend or API
    //         // For demonstration, we'll just show a sample response after a delay
    //         setTimeout(function() {
    //             $responseContent.text("This is a sample response to your question: " + question);
                
    //             // Clear the input field
    //             $questionInput.val('');
    //         }, 1000);
    //     }
    // });
    
    // Close response box when clicking the X button
    $closeResponseBox.on('click', function() {
        $responseBox.addClass('hidden');
    });
    
    // Optional: Allow pressing Enter to send the question
    // $questionInput.on('keypress', function(e) {
    //     if (e.key === 'Enter') {
    //         $sendButton.click();
    //     }
    // });
});



$('#geminiForm').on('submit', function (e) {
  e.preventDefault();

  console.log("Form submitted");

  const prompt = $('#inputPrompt').val();
  const selectedImage = $('input[name="chosenImage"]:checked').val();
  // const selectedNamaMakanan = selectedImage; // Sama seperti selectedImage
  const nama_makanan = $('.nama_hidangan').text();
  const $outputDiv = $('#responseBox');

  const selectedNamaMakanan = $('input[name="chosenImage"]:checked')
  .closest('.image-choice')    // cari parent label
  .find('.nama_hidangan')      // cari p dalam label
  .text();                     // ambil teks

  console.log(selectedNamaMakanan);

  $outputDiv.text('Memproses...');

  $.ajax({
    url: 'http://localhost:8000/api/ask-gemini',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      question: prompt,
      image: selectedImage,
      nama_makanan: selectedNamaMakanan
    }),
    success: function (data) {
      const reply = data.result || data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada balasan.';
      $outputDiv.text(reply);
      console.log(selectedImage);
    },
    error: function (xhr, status, error) {
      $outputDiv.text('Gagal mendapatkan respon.');
      console.error(error);
    }
  });
});



// DEBUGGING

  $(document).ready(function() {
    // Debug panel toggle
    $('#toggleDebug').on('click', function() {
      $('#debugPanel').toggleClass('hidden');
    });
    
    // Close debug panel
    $('#closeDebugPanel').on('click', function() {
      $('#debugPanel').addClass('hidden');
    });
    
    // Check if any image is selected and update debug panel
    $('input[name="chosenImage"]').on('change', function() {
      const selectedImage = $('input[name="chosenImage"]:checked').val();
      const selectedNamaMakanan = $('input[name="chosenImage"]:checked')
        .closest('.image-choice')
        .find('.nama_hidangan')
        .text();
        
      $('#imageSelected').text(selectedImage ? 'Yes' : 'None');
      $('#foodName').text(selectedNamaMakanan || 'None');
    });
    
    // Form submission with enhanced debugging
    $('#geminiForm').on('submit', function (e) {
      e.preventDefault();
      
      // Update debug panel
      $('#formStatus').text('Submitted');
      $('#requestStatus').text('Sending...');
      
      console.log("Form submitted");
      const prompt = $('#inputPrompt').val();
      const selectedImage = $('input[name="chosenImage"]:checked').val();
      const $outputDiv = $('#output');
      
      // Update prompt in debug panel
      $('#promptValue').text(prompt || 'Empty');
      
      // Check if image is selected
      if (!selectedImage) {
        $('#requestStatus').text('Failed - No image selected');
        $('#responseData').text('Error: No image selected');
        alert('Please select an image first!');
        return;
      }
      
      const selectedNamaMakanan = $('input[name="chosenImage"]:checked')
        .closest('.image-choice')
        .find('.nama_hidangan')
        .text();
        
      console.log("Selected food name:", selectedNamaMakanan);
      
      // Update debug panel with request data
      $('#imageSelected').text(selectedImage ? 'Yes' : 'None');
      $('#foodName').text(selectedNamaMakanan || 'None');
      
      $outputDiv.text('Memproses...');
      
      // Prepare request data
      const requestData = {
        question: prompt,
        image: selectedImage,
        nama_makanan: selectedNamaMakanan
      };
      
      // Show request data in debug panel
      $('#responseData').text('Request data: ' + JSON.stringify(requestData, null, 2));
      
      $.ajax({
        url: 'http://localhost:8000/api/ask-gemini',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (data) {
          const reply = data.result || data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada balasan.';
          $outputDiv.text(reply);
          
          // Update debug panel
          $('#requestStatus').text('Success');
          $('#responseData').text(JSON.stringify(data, null, 2));
          
          // Show response in response box
          $('#responseContent').text(reply);
          $('#responseBox').removeClass('hidden');
          
          console.log("API Response:", data);
        },
        error: function (xhr, status, error) {
          $outputDiv.text('Gagal mendapatkan respon.');
          
          // Update debug panel with error details
          $('#requestStatus').text('Failed - ' + status);
          $('#responseData').text('Error: ' + error + '\n\nResponse: ' + xhr.responseText);
          
          console.error("API Error:", error);
          console.error("Status:", status);
          console.error("Response:", xhr.responseText);
        }
      });
    });
  });

