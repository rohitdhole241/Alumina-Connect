document.getElementById('file-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('preview');
    previewContainer.innerHTML = ''; // Clear previous content
  
    if (file) {
      const fileType = file.type;
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
      if (validImageTypes.includes(fileType)) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.style.maxWidth = '100%';
        img.style.maxHeight = '500px';
        previewContainer.appendChild(img);
      } else if (validVideoTypes.includes(fileType)) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(file);
        video.controls = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '500px';
        previewContainer.appendChild(video);
      } else {
        previewContainer.innerHTML = 'Unsupported file type!';
      }
    }
  });
  
  document.getElementById('caption').addEventListener('input', function() {
    const maxLength = 2200;
    const currentLength = this.value.length;
    const charCountDisplay = document.getElementById('char-count');
  
    charCountDisplay.textContent = `${currentLength}/${maxLength}`;
  
    // Optionally, you can add a warning if the character limit is exceeded
    if (currentLength > maxLength) {
      charCountDisplay.style.color = 'red';
    } else {
      charCountDisplay.style.color = '#888'; // Reset to normal color
    }
  });
  