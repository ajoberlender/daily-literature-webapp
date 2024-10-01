document.addEventListener('DOMContentLoaded', () => {
    // Load data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            setupApp(data);
        });

    const setupApp = (data) => {
        let { poems, shortStories, essays } = data;

        // Retrieve previously seen links and stats from localStorage
        let seenPoems = JSON.parse(localStorage.getItem('seenPoems')) || [];
        let seenShortStories = JSON.parse(localStorage.getItem('seenShortStories')) || [];
        let seenEssays = JSON.parse(localStorage.getItem('seenEssays')) || [];
        let numPoemsRead = parseInt(localStorage.getItem('numPoemsRead')) || 0;
        let numShortStoriesRead = parseInt(localStorage.getItem('numShortStoriesRead')) || 0;
        let numEssaysRead = parseInt(localStorage.getItem('numEssaysRead')) || 0;
        let streak = parseInt(localStorage.getItem('streak')) || 0;
        let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
        let lastInteraction = localStorage.getItem('lastInteraction') || null;

        // Update streak if a new day
        const today = new Date().toDateString();
        if (lastInteraction !== today) {
            updateStreak(today);
        }

        // Get unseen items
        let currentPoem = getUnseenItem(poems, seenPoems);
        let currentShortStory = getUnseenItem(shortStories, seenShortStories);
        let currentEssay = getUnseenItem(essays, seenEssays);

        // Set up buttons to open the URLs in a new tab
        document.getElementById('poemBtn').addEventListener('click', () => {
            window.open(currentPoem, '_blank');
            markAsSeen(currentPoem, 'seenPoems');
            incrementCounter('numPoemsRead');
        });

        document.getElementById('shortStoryBtn').addEventListener('click', () => {
            window.open(currentShortStory, '_blank');
            markAsSeen(currentShortStory, 'seenShortStories');
            incrementCounter('numShortStoriesRead');
        });

        document.getElementById('essayBtn').addEventListener('click', () => {
            window.open(currentEssay, '_blank');
            markAsSeen(currentEssay, 'seenEssays');
            incrementCounter('numEssaysRead');
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

        // Export history button
        document.getElementById('exportHistoryBtn').addEventListener('click', () => {
            const history = {
                seenPoems: JSON.parse(localStorage.getItem('seenPoems')) || [],
                seenShortStories: JSON.parse(localStorage.getItem('seenShortStories')) || [],
                seenEssays: JSON.parse(localStorage.getItem('seenEssays')) || [],
                numPoemsRead,
                numShortStoriesRead,
                numEssaysRead,
                streak,
                bestStreak
            };
            downloadHistoryFile(history);
        });

        // Import history button
        document.getElementById('importHistoryBtn').addEventListener('click', () => {
            document.getElementById('importHistoryInput').click();
        });

        document.getElementById('importHistoryInput').addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const importedHistory = JSON.parse(e.target.result);
                    importHistory(importedHistory);
                    alert('History imported successfully!');
                };
                reader.readAsText(file);
            }
        });
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

    // Function to increment the read counters
    const incrementCounter = (key) => {
        let count = parseInt(localStorage.getItem(key)) || 0;
        count += 1;
        localStorage.setItem(key, count);
    };

    // Function to update streaks
    const updateStreak = (today) => {
        let lastInteraction = localStorage.getItem('lastInteraction');
        let streak = parseInt(localStorage.getItem('streak')) || 0;
        let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;

        if (lastInteraction) {
            const lastDate = new Date(lastInteraction);
            const difference = (new Date(today) - lastDate) / (1000 * 60 * 60 * 24);

            if (difference === 1) {
                streak += 1; // Increment streak if it's the next day
            } else if (difference > 1) {
                streak = 1; // Reset streak if more than a day has passed
            }
        } else {
            streak = 1; // Initialize streak if it's the user's first interaction
        }

        // Update best streak
        if (streak > bestStreak) {
            bestStreak = streak;
        }

        // Save streaks and last interaction date
        localStorage.setItem('streak', streak);
        localStorage.setItem('bestStreak', bestStreak);
        localStorage.setItem('lastInteraction', today);
    };

    // Function to download history as a JSON file
    const downloadHistoryFile = (history) => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "literature_history.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // Function to import history from a JSON file and store in localStorage
    const importHistory = (history) => {
        if (history.seenPoems) {
            localStorage.setItem('seenPoems', JSON.stringify(history.seenPoems));
        }
        if (history.seenShortStories) {
            localStorage.setItem('seenShortStories', JSON.stringify(history.seenShortStories));
        }
        if (history.seenEssays) {
            localStorage.setItem('seenEssays', JSON.stringify(history.seenEssays));
        }
        if (history.numPoemsRead) {
            localStorage.setItem('numPoemsRead', history.numPoemsRead);
        }
        if (history.numShortStoriesRead) {
            localStorage.setItem('numShortStoriesRead', history.numShortStoriesRead);
        }
        if (history.numEssaysRead) {
            localStorage.setItem('numEssaysRead', history.numEssaysRead);
        }
        if (history.streak) {
            localStorage.setItem('streak', history.streak);
        }
        if (history.bestStreak) {
            localStorage.setItem('bestStreak', history.bestStreak);
        }
    };
});
