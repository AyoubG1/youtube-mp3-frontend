document.getElementById('downloadButton').addEventListener('click', () => {
    const videoUrl = document.getElementById('videoUrl').value;
  
    if (!videoUrl) {
      alert('Please enter a YouTube video URL!');
      return;
    }
  
    // Show progress bar
    document.getElementById('progressContainer').style.display = 'block';
    document.getElementById('completionMessage').style.display = 'none';
  
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
  
    // Send a POST request to the backend to start the download
    fetch('https://youtube-mp3-backend-v23e.onrender.com/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoUrl: videoUrl }),
    })
      .then((response) => {
        if (response.ok) {
          // Listen for progress updates
          const eventSource = new EventSource('https://youtube-mp3-backend-v23e.onrender.com/progress');
  
          eventSource.onmessage = (e) => {
            const progress = parseFloat(e.data);
            progressBar.value = progress;
            progressText.textContent = `${progress}%`;
  
            if (progress === 100) {
              document.getElementById('completionMessage').style.display = 'block';
              eventSource.close();
            }
          };
        } else {
          alert('Failed to start download!');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        alert('An error occurred. Please try again later.');
      });
  });
