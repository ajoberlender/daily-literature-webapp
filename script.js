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

        // Track whether user has read all 3 types for the day
        let hasReadPoemToday = JSON.parse(localStorage.getItem('hasReadPoemToday')) || false;
        let hasReadShortStoryToday = JSON.parse(localStorage.getItem('hasReadShortStoryToday')) || false;
        let hasReadEssayToday = JSON.parse(localStorage.getItem('hasReadEssayToday')) || false;

        // Update streak if a new day
        const today = new Date().toDateString();
        if (lastInteraction !== today) {
            resetDailyReads(); // Reset daily read flags if a new day starts
            updateStreak(today);
        }

        // Update counter display
        updateCounterDisplay(numPoemsRead, numShortStoriesRead, numEssaysRead, streak, bestStreak);

        // Get unseen items
        let currentPoem = getUnseenItem(poems, seenPoems);
        let currentShortStory = getUnseenItem(shortStories, seenShortStories);
        let currentEssay = getUnseenItem(essays, seenEssays);

        // Set up buttons to open the URLs in a new tab
        document.getElementById('poemBtn').addEventListener('click', () => {
            window.open(currentPoem, '_blank');
            markAsSeen(currentPoem, 'seenPoems');
            incrementCounter('numPoemsRead');
            markAsReadToday('hasReadPoemToday');
            checkDailyCompletion(); // Check if all three types are read today
        });

        document.getElementById('shortStoryBtn').addEventListener('click', () => {
            window.open(currentShortStory, '_blank');
            markAsSeen(currentShortStory, 'seenShortStories');
            incrementCounter('numShortStoriesRead');
            markAsReadToday('hasReadShortStoryToday');
            checkDailyCompletion(); // Check if all three types are read today
        });

        document.getElementById('essayBtn').addEventListener('click', () => {
            window.open(currentEssay, '_blank');
            markAsSeen(currentEssay, 'seenEssays');
            incrementCounter('numEssaysRead');
            markAsReadToday('hasReadEssayToday');
            checkDailyCompletion(); // Check if all three types are read today
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
            localStorage.removeItem('numPoemsRead');
            localStorage.removeItem('numShortStoriesRead');
            localStorage.removeItem('numEssaysRead');
            localStorage.removeItem('streak');
            localStorage.removeItem('bestStreak');
            resetDailyReads(); // Clear daily read flags
            alert('History and counters cleared!');
            updateCounterDisplay(0, 0, 0, 0, 0);
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

        // View history button to display the local history in a new tab
        document.getElementById('viewHistoryBtn').addEventListener('click', () => {
            viewHistory(seenPoems, seenShortStories, seenEssays, numPoemsRead, numShortStoriesRead, numEssaysRead, streak, bestStreak);
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

        // Update the displayed counters after increment
        updateDisplayedCounter(key, count);
    };

    // Function to update the streaks
    const updateStreak = (today) => {
        localStorage.setItem('lastInteraction', today); // Save the current day as last interaction
    };

    // Function to check if user has read all three types today and update streak
    const checkDailyCompletion = () => {
        let hasReadPoemToday = JSON.parse(localStorage.getItem('hasReadPoemToday')) || false;
        let hasReadShortStoryToday = JSON.parse(localStorage.getItem('hasReadShortStoryToday')) || false;
        let hasReadEssayToday = JSON.parse(localStorage.getItem('hasReadEssayToday')) || false;
        let streak = parseInt(localStorage.getItem('streak')) || 0;
        let bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;

        // If all types have been read today, increment the streak
        if (hasReadPoemToday && hasReadShortStoryToday && hasReadEssayToday) {
            streak += 1;
            if (streak > bestStreak) {
                bestStreak = streak;
            }
            localStorage.setItem('streak', streak);
            localStorage.setItem('bestStreak', bestStreak);

            // Reset daily read flags
            resetDailyReads();
            updateCounterDisplay(null, null, null, streak, bestStreak);
        }
    };

    // Function to reset daily read flags
    const resetDailyReads = () => {
        localStorage.setItem('hasReadPoemToday', false);
        localStorage.setItem('hasReadShortStoryToday', false);
        localStorage.setItem('hasReadEssayToday', false);
    };

    // Function to mark specific literature type as read for the day
    const markAsReadToday = (key) => {
        localStorage.setItem(key, true);
    };

    // Function to update all counters in the UI
    const updateCounterDisplay = (poemsRead, shortStoriesRead, essaysRead, currentStreak, bestStreak) => {
        if (poemsRead !== null) document.getElementById('poemsRead').textContent = poemsRead;
        if (shortStoriesRead !== null) document.getElementById('shortStoriesRead').textContent = shortStoriesRead;
        if (essaysRead !== null) document.getElementById('essaysRead').textContent = essaysRead;
        if (currentStreak !== null) document.getElementById('currentStreak').textContent = currentStreak;
        if (bestStreak !== null) document.getElementById('bestStreak').textContent = bestStreak;
    };

    // Function to update individual counter after increment
    const updateDisplayedCounter = (key, value) => {
        switch (key) {
            case 'numPoemsRead':
                document.getElementById('poemsRead').textContent = value;
                break;
            case 'numShortStoriesRead':
                document.getElementById('shortStoriesRead').textContent = value;
                break;
            case 'numEssaysRead':
                document.getElementById('essaysRead').textContent = value;
                break;
        }
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

        // Update the counter display after importing
        updateCounterDisplay(
            history.numPoemsRead || 0,
            history.numShortStoriesRead || 0,
            history.numEssaysRead || 0,
            history.streak || 0,
            history.bestStreak || 0
        );
    };

    // Function to view history in a new tab
    const viewHistory = (poems, shortStories, essays, poemsRead, shortStoriesRead, essaysRead, streak, bestStreak) => {
        let historyTab = window.open("about:blank", "_blank"); // Open in a new tab
        if (historyTab) { // If the tab is successfully opened
            historyTab.document.write("<html><head><title>Your History</title></head><body>");
            historyTab.document.write("<h1>Reading History</h1>");
            historyTab.document.write("<p>Poems read: " + poemsRead + "</p>");
            historyTab.document.write("<p>Short Stories read: " + shortStoriesRead + "</p>");
            historyTab.document.write("<p>Essays read: " + essaysRead + "</p>");
            historyTab.document.write("<p>Current Streak: " + streak + " days</p>");
            historyTab.document.write("<p>All-Time Best Streak: " + bestStreak + " days</p>");
            historyTab.document.write("<h2>Read URLs</h2>");
            
            historyTab.document.write("<h3>Poems:</h3><ul>");
            poems.forEach(poem => historyTab.document.write("<li><a href='" + poem + "' target='_blank'>" + poem + "</a></li>"));
            historyTab.document.write("</ul>");
            
            historyTab.document.write("<h3>Short Stories:</h3><ul>");
            shortStories.forEach(story => historyTab.document.write("<li><a href='" + story + "' target='_blank'>" + story + "</a></li>"));
            historyTab.document.write("</ul>");
            
            historyTab.document.write("<h3>Essays:</h3><ul>");
            essays.forEach(essay => historyTab.document.write("<li><a href='" + essay + "' target='_blank'>" + essay + "</a></li>"));
            historyTab.document.write("</ul>");
            
            historyTab.document.write("</body></html>");
            historyTab.document.close(); // Close document writing to render the content
        } else {
            alert("Pop-up blocked. Please allow pop-ups for this site to view your history.");
        }
    };
});
