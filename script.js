document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();  // Firebase Auth
    const db = firebase.firestore();  // Firebase Firestore

    // Authentication Elements
    const googleSignInBtn = document.getElementById('googleSignInBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userEmailDisplay = document.getElementById('userEmail');
    const authSection = document.getElementById('authSection');
    const contentSection = document.getElementById('contentSection');
    const logoutSection = document.getElementById('logoutSection');

    // Content Buttons
    const poemBtn = document.getElementById('poemBtn');
    const shortStoryBtn = document.getElementById('shortStoryBtn');
    const essayBtn = document.getElementById('essayBtn');
    const reshuffleBtn = document.getElementById('reshuffleBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Load data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            setupApp(data);
        });

    // Function to initialize the app after data is loaded
    const setupApp = (data) => {
        let { poems, shortStories, essays } = data;

        // Initialize user's seen history in Firestore if they are new
        const initializeUserHistory = () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = db.collection('users').doc(user.uid);

                userRef.get().then((doc) => {
                    if (!doc.exists) {
                        // If no document exists for this user, create it with empty arrays
                        userRef.set({
                            seenPoems: [],
                            seenShortStories: [],
                            seenEssays: []
                        });
                    }
                });
            }
        };

        // Function to mark an item as seen in Firestore
        const markAsSeen = (item, category) => {
            const user = auth.currentUser;
            if (user) {
                const userRef = db.collection('users').doc(user.uid);
                userRef.update({
                    [category]: firebase.firestore.FieldValue.arrayUnion(item)
                }).then(() => {
                    console.log(`${item} marked as seen`);
                }).catch((error) => {
                    console.error('Error updating seen items:', error);
                });
            }
        };

        // Function to get unseen items by filtering out the seen items
        const getUnseenItems = (items, seenItems) => {
            let unseenItems = items.filter(item => !seenItems.includes(item));

            // If all items are seen, reset and show the full list again
            if (unseenItems.length === 0) {
                unseenItems = items;
            }

            return unseenItems;
        };

        // Retrieve user's seen history from Firestore
        const getUserSeenHistory = () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = db.collection('users').doc(user.uid);
                return userRef.get().then((doc) => {
                    if (doc.exists) {
                        return doc.data();
                    }
                    return {};
                }).catch((error) => {
                    console.error('Error retrieving seen history:', error);
                    return {};
                });
            }
        };

        // Google Sign-In
        googleSignInBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider).then((result) => {
                const user = result.user;
                userEmailDisplay.textContent = user.email;
                authSection.style.display = 'none';
                contentSection.style.display = 'block';
                logoutSection.style.display = 'block';
                initializeUserHistory();  // Initialize user history if this is the first login
            }).catch((error) => {
                console.error('Error during Google Sign-In:', error);
            });
        });

        // Logout functionality
        logoutBtn.addEventListener('click', () => {
            auth.signOut().then(() => {
                authSection.style.display = 'block';
                contentSection.style.display = 'none';
                logoutSection.style.display = 'none';
                alert('Logged out!');
            });
        });

        // Load content after login and show unseen items
        poemBtn.addEventListener('click', () => {
            getUserSeenHistory().then((history) => {
                const unseenPoems = getUnseenItems(poems, history.seenPoems || []);
                const randomPoem = unseenPoems[Math.floor(Math.random() * unseenPoems.length)];
                window.open(randomPoem, '_blank');
                markAsSeen(randomPoem, 'seenPoems');
            });
        });

        shortStoryBtn.addEventListener('click', () => {
            getUserSeenHistory().then((history) => {
                const unseenShortStories = getUnseenItems(shortStories, history.seenShortStories || []);
                const randomShortStory = unseenShortStories[Math.floor(Math.random() * unseenShortStories.length)];
                window.open(randomShortStory, '_blank');
                markAsSeen(randomShortStory, 'seenShortStories');
            });
        });

        essayBtn.addEventListener('click', () => {
            getUserSeenHistory().then((history) => {
                const unseenEssays = getUnseenItems(essays, history.seenEssays || []);
                const randomEssay = unseenEssays[Math.floor(Math.random() * unseenEssays.length)];
                window.open(randomEssay, '_blank');
                markAsSeen(randomEssay, 'seenEssays');
            });
        });

        // Reshuffle content
        reshuffleBtn.addEventListener('click', () => {
            alert('Content reshuffled! Click a button to see new content.');
        });

        // Clear history in Firestore
        clearHistoryBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            if (user) {
                const userRef = db.collection('users').doc(user.uid);
                userRef.update({
                    seenPoems: [],
                    seenShortStories: [],
                    seenEssays: []
                }).then(() => {
                    alert('History cleared!');
                });
            }
        });
    };
});
