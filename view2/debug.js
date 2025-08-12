// document.addEventListener('DOMContentLoaded', function() {
//   // Get all radio buttons in the gallery
//   const radioButtons = document.querySelectorAll('#gallery input[type="radio"]');
  
//   // Create a debugging panel
//   const debugPanel = document.createElement('div');
//   debugPanel.className = 'fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 border border-gray-300';
//   debugPanel.innerHTML = `
//     <h3 class="font-bold text-lg mb-2">Debug Panel</h3>
//     <div id="debugStatus" class="text-red-500">No image selected</div>
//     <div id="selectedImage" class="mt-2"></div>
//   `;
//   document.body.appendChild(debugPanel);
  
//   // Function to update debug panel
//   function updateDebugPanel() {
//     const debugStatus = document.getElementById('debugStatus');
//     const selectedImage = document.getElementById('selectedImage');
    
//     // Check if any radio button is checked
//     const checkedRadio = document.querySelector('#gallery input[type="radio"]:checked');
    
//     if (checkedRadio) {
//       debugStatus.textContent = 'Image selected ✓';
//       debugStatus.className = 'text-green-500';
//       selectedImage.innerHTML = `
//         <p class="text-sm">Selected value: ${checkedRadio.value}</p>
//         <img src="${checkedRadio.value}" class="mt-2 h-20 w-20 object-cover rounded">
//       `;
//     } else {
//       debugStatus.textContent = 'No image selected';
//       debugStatus.className = 'text-red-500';
//       selectedImage.innerHTML = '';
//     }
//   }
  
//   // Add click event listeners to all radio buttons
//   radioButtons.forEach(radio => {
//     radio.addEventListener('change', function() {
//       // Visual indicator on the selected image container
//       document.querySelectorAll('.image-container').forEach(container => {
//         container.classList.remove('ring-2', 'ring-blue-500');
//       });
      
//       if (this.checked) {
//         // Add visual indicator to the selected image
//         this.closest('.image-choice').querySelector('.image-container')
//           .classList.add('ring-2', 'ring-blue-500');
//       }
      
//       updateDebugPanel();
//     });
//   });
  
//   // Add a button to check status programmatically
//   const checkButton = document.createElement('button');
//   checkButton.textContent = 'Check Selection Status';
//   checkButton.className = 'mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm';
//   checkButton.addEventListener('click', updateDebugPanel);
//   debugPanel.appendChild(checkButton);
  
//   // Initial check
//   updateDebugPanel();
  
//   // Log to console when form is submitted
//   const form = document.querySelector('form');
//   if (form) {
//     form.addEventListener('submit', function(e) {
//       const checkedRadio = document.querySelector('#gallery input[type="radio"]:checked');
//       console.log('Form submitted with selected image:', checkedRadio ? checkedRadio.value : 'None');
      
//       // Uncomment the next line if you want to prevent actual form submission during testing
//       // e.preventDefault();
//     });
//   }
// });
