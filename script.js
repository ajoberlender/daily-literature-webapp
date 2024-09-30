document.addEventListener('DOMContentLoaded', () => {
    // Load data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            setupApp(data);
        });

    const setupApp = (data) => {
        let { poems, shortStories, essays } = data;

        // Retrieve previously seen links from localStorage
        let seenPoems = JSON.parse(localStorage.getItem('seenPoems')) || [];
        let seenShortStories = JSON.parse(localStorage.getItem('seenShortStories')) || [];
        let seenEssays = JSON.parse(localStorage.getItem('seenEssays')) || [];

        // Get unseen items
        let currentPoem = getUnseenItem(poems, seenPoems);
        let currentShortStory = getUnseenItem(shortStories, seenShortStories);
        let currentEssay = getUnseenItem(essays, seenEssays);

        // Set up buttons to open the URLs in a new tab
        document.getElementById('poemBtn').addEventListener('click', () => {
            window.open(currentPoem, '_blank');
            markAsSeen(currentPoem, 'seenPoems');
        });

        document.getElementById('shortStoryBtn').addEventListener('click', () => {
            window.open(currentShortStory, '_blank');
            markAsSeen(currentShortStory, 'seenShortStories');
        });

        document.getElementById('essayBtn').addEventListener('click', () => {
            window.open(currentEssay, '_blank');
            markAsSeen(currentEssay, 'seenEssays');
        });

        // Reshuffle button to get new unseen items
        document.getElementById('reshuffleBtn').addEventListener('click', () => {
            currentPoem = getUnseenItem(poems, JSON.parse(localStorage.getItem('seenPoems')) || []);
            currentShortStory = getUnseenItem(shortStories, JSON.parse(localStorage.getItem('seenShortStories')) || []);
            currentEssay = getUnseenItem(essays, JSON.parse(localStorage.getItem('seenEssays')) || []);
            alert('Links reshuffled!');
        });

        // Clear history button
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            localStorage.removeItem('seenPoems');
            localStorage.removeItem('seenShortStories');
            localStorage.removeItem('seenEssays');
            alert('History cleared!');
        });
    };

    // Function to get an unseen item
    const getUnseenItem = (items, seenItems) => {
        // Filter out seen items
        let unseenItems = items.filter(item => !seenItems.includes(item));

        // If all items have been seen, clear seenItems to start again
        if (unseenItems.length === 0) {
            unseenItems = items;
            seenItems = [];
        }

        // Return a random unseen item
        return unseenItems[Math.floor(Math.random() * unseenItems.length)];
    };

    // Function to mark an item as seen and store in localStorage
    const markAsSeen = (item, storageKey) => {
        let seenItems = JSON.parse(localStorage.getItem(storageKey)) || [];
        seenItems.push(item);
        localStorage.setItem(storageKey, JSON.stringify(seenItems));
    };
});
