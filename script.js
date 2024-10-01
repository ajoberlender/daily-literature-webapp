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

        // Export history button
        document.getElementById('exportHistoryBtn').addEventListener('click', () => {
            const history = {
                seenPoems: JSON.parse(localStorage.getItem('seenPoems')) || [],
                seenShortStories: JSON.parse(localStorage.getItem('seenShortStories')) || [],
                seenEssays: JSON.parse(localStorage.getItem('seenEssays')) || []
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
    };
});
