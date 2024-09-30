document.addEventListener('DOMContentLoaded', () => {
    // Content Buttons
    const poemBtn = document.getElementById('poemBtn');
    const shortStoryBtn = document.getElementById('shortStoryBtn');
    const essayBtn = document.getElementById('essayBtn');
    const reshuffleBtn = document.getElementById('reshuffleBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    let poems = [];
    let shortStories = [];
    let essays = [];

    // Fetch content from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            poems = data.poems || [];
            shortStories = data.shortStories || [];
            essays = data.essays || [];
        })
        .catch(error => {
            console.error("Error loading data:", error);
        });

    // Load history from localStorage
    const loadHistory = () => {
        return JSON.parse(localStorage.getItem('viewedContent')) || {
            seenPoems: [],
            seenShortStories: [],
            seenEssays: []
        };
    };

    // Save history to localStorage
    const saveHistory = (history) => {
        localStorage.setItem('viewedContent', JSON.stringify(history));
    };

    // Get unseen items from the array
    const getUnseenItems = (items, seenItems) => {
        const unseenItems = items.filter(item => !seenItems.includes(item));
        return unseenItems.length > 0 ? unseenItems : items; // If all seen, reset and return all
    };

    // Mark an item as seen
    const markAsSeen = (item, category) => {
        const history = loadHistory();
        history[category].push(item);
        saveHistory(history);
    };

    // Button event listeners
    poemBtn.addEventListener('click', () => {
        const history = loadHistory();
        const unseenPoems = getUnseenItems(poems, history.seenPoems);
        const randomPoem = unseenPoems[Math.floor(Math.random() * unseenPoems.length)];
        window.open(randomPoem, '_blank');
        markAsSeen(randomPoem, 'seenPoems');
    });

    shortStoryBtn.addEventListener('click', () => {
        const history = loadHistory();
        const unseenShortStories = getUnseenItems(shortStories, history.seenShortStories);
        const randomShortStory = unseenShortStories[Math.floor(Math.random() * unseenShortStories.length)];
        window.open(randomShortStory, '_blank');
        markAsSeen(randomShortStory, 'seenShortStories');
    });

    essayBtn.addEventListener('click', () => {
        const history = loadHistory();
        const unseenEssays = getUnseenItems(essays, history.seenEssays);
        const randomEssay = unseenEssays[Math.floor(Math.random() * unseenEssays.length)];
        window.open(randomEssay, '_blank');
        markAsSeen(randomEssay, 'seenEssays');
    });

    reshuffleBtn.addEventListener('click', () => {
        alert('Content reshuffled!');
    });

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('viewedContent');
        alert('History cleared!');
    });

    // Export history to a JSON file
    exportBtn.addEventListener('click', () => {
        const history = loadHistory();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "history.json");
        document.body.appendChild(downloadAnchorNode); // Required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Import history from a JSON file
    importBtn.addEventListener('click', () => {
        importFile.click();
    });

    importFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const importedHistory = JSON.parse(e.target.result);
            saveHistory(importedHistory);
            alert('History imported successfully!');
        };
        reader.readAsText(file);
    });
});
