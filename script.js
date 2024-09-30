document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    // Authentication Elements
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
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

    // Function to initialize user data if it's their first time logging in
    const initializeUserHistory = () => {
        const user = auth.currentUser;
        if (user) {
            const userRef = db.collection('users').doc(user.uid);

            userRef.get().then((doc) => {
                if (!doc.exists) {
                    // If no history exists, initialize it
                    userRef.set({
                        seenPoems: [],
                        seenShortStories: [],
                        seenEssays: []
                    });
                }
            });
        }
    };

    // Function to update the seen history
    const markAsSeen = (item, category) => {
        const user = auth.currentUser;
        if (user) {
            const userRef = db.collection('users').doc(user.uid);

            userRef.update({
                [category]: firebase.firestore.FieldValue.arrayUnion(item)
            });
        }
    };

    // Retrieve unseen items from Firestore
    const getUnseenItems = (items, seenItems) => {
        return items.filter(item => !seenItems.includes(item));
    };

    // Retrieve user's seen history
    const getUserSeenHistory = () => {
        const user = auth.currentUser;
        if (user) {
            const userRef = db.collection('users').doc(user.uid);
            return userRef.get().then((doc) => {
                if (doc.exists) {
                    return doc.data();
                }
                return {};
            });
        }
    };

    // Signup
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;

        auth.createUserWithEmailAndPassword(email, password).then(() => {
            alert('Sign up successful!');
            initializeUserHistory();
        }).catch((error) => {
            alert('Error: ' + error.message);
        });
    });

    // Login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        auth.signInWithEmailAndPassword(email, password).then((userCredential) => {
            const user = userCredential.user;
            userEmailDisplay.textContent = user.email;
            authSection.style.display = 'none';
            contentSection.style.display = 'block';
            logoutSection.style.display = 'block';
            initializeUserHistory();
        }).catch((error) => {
            alert('Error: ' + error.message);
        });
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            authSection.style.display = 'block';
            contentSection.style.display = 'none';
            logoutSection.style.display = 'none';
            alert('Logged out!');
        });
    });

    // Load content after login and track history
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

    // Clear History
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
});
