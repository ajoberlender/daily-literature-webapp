document.addEventListener('DOMContentLoaded', () => {
    // Load data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            setupApp(data);
        });

    const setupApp = (data) => {
        let { poems, shortStories, essays } = data;

        // Retrieve previously seen and flagged links from localStorage
        let seenPoems = JSON.parse(localStorage.getItem('seenPoems')) || [];
        let seenShortStories = JSON.parse(localStorage.getItem('seenShortStories')) || [];
        let seenEssays = JSON.parse(localStorage.getItem('seenEssays')) || [];
        let flaggedPoems = JSON.parse(localStorage.getItem('flaggedPoems')) || [];
        let flaggedShortStories = JSON.parse(localStorage.getItem('flaggedShortStories')) || [];
        let flaggedEssays = JSON.parse(localStorage.getItem('flaggedEssays')) || [];

        // Get unseen and unflagged items
        let currentPoem = getUnseenUnflaggedItem(poems, seenPoems, flaggedPoems);
        let currentShortStory = getUnseenUnflaggedItem(shortStories, seenShortStories, flaggedShortStories);
        let currentEssay = getUnseenUnflaggedItem(essays, seenEssays, flaggedEssays);

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

        // Set up flagging for bad URLs
        document.getElementById('flagPoemBtn').addEventListener('click', () => {
            flagLink(currentPoem, 'flaggedPoems');
            alert('Poem link flagged!');
            currentPoem = getUnseenUnflaggedItem(poems, seenPoems, flaggedPoems);
        });

        document.getElementById('flagShortStoryBtn').addEventListener('click', () => {
            flagLink(currentShortStory, 'flaggedShortStories');
            alert('Short story link flagged!');
            currentShortStory = getUnseenUnflaggedItem(shortStories, seenShortStories, flaggedShortStories);
        });

        document.getElementById('flagEssayBtn').addEventListener('click', () => {
            flagLink(currentEssay, 'flaggedEssays');
            alert('Essay link flagged!');
            currentEssay = getUnseenUnflaggedItem(essays, seenEssays, flaggedEssays);
        });

        // Reshuffle button to get new unseen items
        document.getElementById('reshuffleBtn').addEventListener('click', () => {
            currentPoem = getUnseenUnflaggedItem(poems, JSON.parse(localStorage.getItem('seenPoems')) || [], JSON.parse(localStorage.getItem('flaggedPoems')) || []);
            currentShortStory = getUnseenUnflaggedItem(shortStories, JSON.parse(localStorage.getItem('seenShortStories')) || [], JSON.parse(localStorage.getItem('flaggedShortStories')) || []);
            currentEssay = getUnseenUnflaggedItem(essays, JSON.parse(localStorage.getItem('seenEssays')) || [], JSON.parse(localStorage.getItem('flaggedEssays')) || []);
            alert('Links reshuffled!');
        });

        // Clear history button
        document.getElementById('clearHistoryBtn').addEventListener('click', () => {
            localStorage.removeItem('seenPoems');
            localStorage.removeItem('seenShortStories');
            localStorage.removeItem('seenEssays');
            alert('History cleared!');
        });

        // Clear flagged links button
        document.getElementById('clearFlagsBtn').addEventListener('click', () => {
            localStorage.removeItem('flaggedPoems');
            localStorage.removeItem('flaggedShortStories');
            localStorage.removeItem('flaggedEssays');
            alert('Flagged links cleared!');
        });
    };

    // Function to get an unseen and unflagged item
    const getUnseenUnflaggedItem = (items, seenItems, flaggedItems) => {
        // Filter out seen and flagged items
        let filteredItems = items.filter(item => !seenItems.includes(item) && !flaggedItems.includes(item));

        // If all items have been seen or flagged, start over
        if (filteredItems.length === 0) {
            filteredItems = items;
            seenItems = [];
            flaggedItems = [];
        }

        // Return a random unseen and unflagged item
        return filteredItems[Math.floor(Math.random() * filteredItems.length)];
    };

    // Function to mark an item as seen and store in localStorage
    const markAsSeen = (item, storageKey) => {
        let seenItems = JSON.parse(localStorage.getItem(storageKey)) || [];
        seenItems.push(item);
        localStorage.setItem(storageKey, JSON.stringify(seenItems));
    };

    // Function to flag an item and store in localStorage
    const flagLink = (item, storageKey) => {
        let flaggedItems = JSON.parse(localStorage.getItem(storageKey)) || [];
        flaggedItems.push(item);
        localStorage.setItem(storageKey, JSON.stringify(flaggedItems));
    };
});
