// import {GoogleGenerativeAI, HarmBlockThreshold, HarmCategory} from '@google/generative-ai'
// import Base64 from 'base64-js'
// import MarkdownIt from 'markdown-it'
// import {maybeShowApiKeyBanner} from './gemini-api-banner'
// import './testAI.css'

// // 🔥🔥 FILL THIS OUT FIRST! 🔥🔥
// // Get your Gemini API key by:
// // - Selecting "Add Gemini API" in the "Firebase Studio" panel in the sidebar
// // - Or by visiting https://g.co/ai/idxGetGeminiKey
// let API_KEY = 'AIzaSyDgr8FdOIRyQWX24qO2rnE0Y8vhX1da7xY'

// let form = document.querySelector('form')
// let promptInput = document.querySelector('input[name="prompt"]')
// let output = document.querySelector('.output')

// form.onsubmit = async ev => {
//   ev.preventDefault()
//   output.textContent = 'Generating...'

//   try {
//     // Load the image as a base64 string
//     let imageUrl = form.elements.namedItem('chosen-image').value
//     let imageBase64 = await fetch(imageUrl)
//       .then(r => r.arrayBuffer())
//       .then(a => Base64.fromByteArray(new Uint8Array(a)))

//     // Assemble the prompt by combining the text with the chosen image
//     let contents = [
//       {
//         role: 'user',
//         parts: [
//           {inline_data: {mime_type: 'image/jpeg', data: imageBase64}},
//           {text: promptInput.value},
//         ],
//       },
//     ]

//     // Call the multimodal model, and get a stream of results
//     const genAI = new GoogleGenerativeAI(API_KEY)
//     const model = genAI.getGenerativeModel({
//       model: 'gemini-1.5-flash', // or gemini-1.5-pro
//       safetySettings: [
//         {
//           category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//           threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
//         },
//       ],
//     })

//     const result = await model.generateContentStream({contents})

//     // Read from the stream and interpret the output as markdown
//     let buffer = []
//     let md = new MarkdownIt()
//     for await (let response of result.stream) {
//       buffer.push(response.text())
//       output.innerHTML = md.render(buffer.join(''))
//     }
//   } catch (e) {
//     output.innerHTML += '<hr>' + e
//   }
// }

// // You can delete this once you've filled out an API key
// maybeShowApiKeyBanner(API_KEY)




// async function askGemini() {
//     const input = document.getElementById('inputText').value;
//     const outputDiv = document.getElementById('output');
//     outputDiv.innerText = 'Memproses...';

//     const response = await fetch('http://localhost:8000/api/ask-gemini', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ question: input })
//     });

//     const data = await response.json();
//     try {
//       const reply = data.candidates[0].content.parts[0].text;
//       outputDiv.innerText = reply;
//     } catch (e) {
//       outputDiv.innerText = 'Gagal mendapatkan respon.';
//     }
//   }


// FIXED
// document.getElementById('geminiForm').addEventListener('submit', async function (e) {
//   e.preventDefault();

//   const prompt = document.getElementById('inputPrompt').value;
//   const selectedImage = document.querySelector('input[name="chosenImage"]:checked').value;
//   // const selectedNamaMakanan = document.querySelector('input[name="chosenImage"]:checked').value;
//   const outputDiv = document.getElementById('output');
//   const nama_makanan = document.getElementsByClassName('nama_hidangan').textContent;
//   outputDiv.innerText = 'Memproses...';

//   console.log(nama_makanan);

//   try {
//     const response = await fetch('http://localhost:8000/api/ask-gemini', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         question: prompt,
//         image: selectedImage,
//         nama_makanan: nama_makanan
//       })
//     });

//     const data = await response.json();
//     const reply = data.result || data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak ada balasan.';
//     outputDiv.innerText = reply;

//     console.log(selectedImage);
//   } catch (error) {
//     outputDiv.innerText = 'Gagal mendapatkan respon.';
//     console.error(error);
//   }
// });

function showData() { 
  $.ajax({
    url: 'https://cemilanv1.biz.id/api/market',
    method: 'GET',
    success: function (data) {

      console.log(data)

      $('#data').empty();

      data.forEach(function (element) {       

        $('#menu').append(`
                <label class="image-choice">
                  <input type="radio" name="chosenImage" value="${element.image_url}">
                  <img src="${element.image_url}">
                  <p class="nama_hidangan">${element.nama_barang}</p>
                </label>              
            `);
      });
    },
    error: function (err) {
      console.log('Error fetching data', err);
    }
  });
 }

$('#geminiForm').on('submit', function (e) {
  e.preventDefault();

  console.log("Form submitted");

  const prompt = $('#inputPrompt').val();
  const selectedImage = $('input[name="chosenImage"]:checked').val();
  // const selectedNamaMakanan = selectedImage; // Sama seperti selectedImage
  const nama_makanan = $('.nama_hidangan').text();
  const $outputDiv = $('#output');

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
