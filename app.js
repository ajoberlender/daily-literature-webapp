// Function to fetch URLs from data.json
function fetchUrls() {
  return fetch('data.json')
    .then(response => response.json())
    .then(data => {
      return {
        poems: data.poems,
        stories: data.stories,
        essays: data.essays
      };
    })
    .catch(error => console.error('Error loading data:', error));
}

// Function to get a random URL
function getRandomUrl(urls) {
  return urls[Math.floor(Math.random() * urls.length)];
}

// Function to assign random URLs to buttons
function assignRandomUrls(data) {
  document.getElementById('poem-btn').onclick = () => {
    window.open(getRandomUrl(data.poems), '_blank');
  };
  document.getElementById('story-btn').onclick = () => {
    window.open(getRandomUrl(data.stories), '_blank');
  };
  document.getElementById('essay-btn').onclick = () => {
    window.open(getRandomUrl(data.essays), '_blank');
  };
}

// Fetch the URLs and set up the page
fetchUrls().then(data => {
  assignRandomUrls(data);

  // Reshuffle button to change URLs
  document.getElementById('reshuffle-btn').onclick = () => assignRandomUrls(data);
});
