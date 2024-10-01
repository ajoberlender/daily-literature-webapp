document.addEventListener('DOMContentLoaded', () => {
    // Load data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            setupApp(data);
        });

    // Function to update the read date and streak
    const updateReadDate = () => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD
        let lastReadDate = localStorage.getItem('lastReadDate');

        if (lastReadDate !== today) {
            let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
            let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;

            // Check if the last read date was yesterday to maintain the streak
            if (lastReadDate && isYesterday(lastReadDate)) {
                currentStreak++;
            } else {
                currentStreak = 1; // Start new streak
            }

            // Update best streak if current streak exceeds it
            if (currentStreak > bestStreak) {
                bestStreak = currentStreak;
                localStorage.setItem('bestStreak', bestStreak);
                document.getElementById('bestStreak').innerText = bestStreak;
            }

            localStorage.setItem('currentStreak', currentStreak);
            localStorage.setItem('lastReadDate', today);
            document.getElementById('currentStreak').innerText = currentStreak;
        }
    };

    // Helper function to check if a given date is yesterday
    const isYesterday = (dateString) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return dateString === yesterday.toISOString().split('T')[0];
    };

    // Function to update the piece count
    const updatePieceCount = (localStorageKey, elementId) => {
        let count = parseInt(localStorage.getItem(localStorageKey)) || 0;
        count++;
        localStorage.setItem(localStorageKey, count);
        document.getElementById(elementId).innerText = count; // Ensure DOM update
    };

    const setupApp = (data) => {
        let { poems, shortStories, essays } = data;

        // Retrieve previously seen links and stats from localStorage
        let seenPoems = JSON.parse(localStorage.getItem('seenPoems')) || [];
        let seenShortStories = JSON.parse(localStorage.getItem('seenShortStories')) || [];
        let seenEssays = JSON.parse(localStorage.getItem('seenEssays')) || [];
        
        let poemCount = parseInt(localStorage.getItem('poemCount')) || 0;
        let shortStoryCount = parseInt(localStorage.getItem('shortStoryCount')) || 0;
        let essayCount = parseInt(localStorage.getItem('essayCount')) || 0;
        
        let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;
        let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
        let lastReadDate = localStorage.getItem('lastReadDate') || null;

        // Display initial counts and streaks
        document.getElementById('poemCount').innerText = poemCount;
        document.getElementById('shortStoryCount').innerText = shortStoryCount;
        document.getElementById('essayCount').innerText = essayCount;
        document.getElementById('currentStreak').innerText = currentStreak;
        document.getElementById('bestStreak').innerText = bestStreak;

        // Check and update streak if a new day
        updateReadDate();

        // Get unseen items
        let currentPoem = getUnseenItem(poems, seenPoems);
        let currentShortStory = getUnseenItem(shortStories, seenShortStories);
        let currentEssay = getUnseenItem(essays, seenEssays);

        // Set up buttons to open the URLs in a new tab and track stats
        document.getElementById('poemBtn').addEventListener('click', () => {
            window.open(currentPoem, '_blank');
            markAsSeen(currentPoem, 'seenPoems');
            updatePieceCount('poemCount', 'poemCount'); // Update poem count
            updateReadDate();
        });

        document.getElementById('shortStoryBtn').addEventListener('click', () => {
            window.open(currentShortStory, '_blank');
            markAsSeen(currentShortStory, 'seenShortStories');
            updatePieceCount('shortStoryCount', 'shortStoryCount'); // Update short story count
            updateReadDate();
        });

        document.getElementById('essayBtn').addEventListener('click', () => {
            window.open(currentEssay, '_blank');
            markAsSeen(currentEssay, 'seenEssays');
            updatePieceCount('essayCount', 'essayCount'); // Update essay count
            updateReadDate();
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
            localStorage.removeItem('poemCount');
            localStorage.removeItem('shortStoryCount');
            localStorage.removeItem('essayCount');
            localStorage.removeItem('currentStreak');
            localStorage.removeItem('bestStreak');
            localStorage.removeItem('lastReadDate');
            alert('History and stats cleared!');
            location.reload();
        });

        // Export/import functions remain the same...
    };

    // Function to get an unseen item
    const getUnseenItem = (items, seenItems) => {
        let unseenItems = items.filter(item => !seenItems.includes(item));
        if (unseenItems.length === 0) {
            unseenItems = items;
            seenItems = [];
        }
        return unseenItems[Math.floor(Math.random() * unseenItems.length)];
    };

    // Function to mark an item as seen and store in localStorage
    const markAsSeen = (item, storageKey) => {
        let seenItems = JSON.parse(localStorage.getItem(storageKey)) || [];
        seenItems.push(item);
        localStorage.setItem(storageKey, JSON.stringify(seenItems));
    };

    // Other unchanged functions (getUnseenItem, markAsSeen, downloadHistoryFile, importHistory) remain the same...
});
