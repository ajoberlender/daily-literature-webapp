document.addEventListener('DOMContentLoaded', () => {
    // Load data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            setupApp(data);
        });

    const setupApp = (data) => {
        let { poems, shortStories, essays } = data;

        // Randomly assign pieces on page load
        let currentPoem = getRandomItem(poems);
        let currentShortStory = getRandomItem(shortStories);
        let currentEssay = getRandomItem(essays);

        // Set up buttons
        document.getElementById('poemBtn').addEventListener('click', () => {
            window.open(currentPoem, '_blank');
        });
        document.getElementById('shortStoryBtn').addEventListener('click', () => {
            window.open(currentShortStory, '_blank');
        });
        document.getElementById('essayBtn').addEventListener('click', () => {
            window.open(currentEssay, '_blank');
        });

        // Reshuffle function
        document.getElementById('reshuffleBtn').addEventListener('click', () => {
            currentPoem = getRandomItem(poems);
            currentShortStory = getRandomItem(shortStories);
            currentEssay = getRandomItem(essays);
            alert('Links reshuffled!');
        });
    };

    // Function to get a random item from an array
    const getRandomItem = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    };
});
