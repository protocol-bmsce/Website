document.addEventListener("DOMContentLoaded", () => {
    // --- Element Selectors ---
    const elements = {
        themeToggle: document.getElementById("theme-toggle"),
        body: document.body,
        hamburger: document.getElementById('hamburger'),
        sidebar: document.getElementById('sidebar'),
        closeSidebar: document.getElementById('close-sidebar'),
        navbar: document.getElementById('navbar'),
        navLinks: document.querySelectorAll('#navbar a, .sidebar-nav a'), // Include sidebar links for closing sidebar
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds"),
        changingWords: document.querySelectorAll('.changing-word'),
        bookViewer: document.getElementById('book-viewer'), // Added for 3D book viewer
        closeBookButton: document.getElementById('close-book'), // Added for 3D book viewer
        prevPageButton: document.getElementById('prev-page'), // Added for 3D book viewer
        nextPageButton: document.getElementById('next-page'), // Added for 3D book viewer
        pages: document.querySelectorAll('.book .page'), // Added for 3D book viewer
        pdfViewerModal: document.getElementById('pdf-viewer-modal'), // Added for PDF viewer
        closePdfViewerBtn: document.getElementById('close-pdf-viewer'), // Added for PDF viewer
        pdfIframe: document.getElementById('pdf-iframe'), // Added for PDF viewer
    };

    // --- Configuration ---
    const config = {
        // Target date will be calculated dynamically to be 32 days from now
        words: ["Creativity", "Innovation", "Learning", "Technology"],
        fadeDuration: 500, // Consistent variable for fade duration
        sidebarSlideDuration: '0.3s', //Added CSS transition duration
        defaultTheme: 'light',
    };

    // --- State ---
    let wordIndex = 0;
    let currentPage = 0; // For 3D book viewer
    let targetCountdownDate; // Will store the dynamically calculated target date for the countdown
    let countdownInterval; // To store the interval ID for clearing

    // --- Helper Functions ---

    /**
     * Applies a theme to the body by toggling a class.
     * @param {string} theme - The theme to apply ('light' or 'dark').
     */
    function setTheme(theme) {
        elements.body.classList.remove('light', 'dark'); // Remove both to be safe
        elements.body.classList.add(theme);
        localStorage.setItem("theme", theme);

        // Update theme toggle icon based on current theme
        if (elements.themeToggle) {
            if (theme === 'dark') {
                elements.themeToggle.textContent = '🌓'; // Light mode icon
            } else {
                elements.themeToggle.textContent = '🌓'; // Dark mode icon
            }
        }
    }

    /**
     * Handles the changing word animation.
     */
    function handleChangingWord() {
        if (elements.changingWords.length === 0) return;

        elements.changingWords.forEach(element => {
            element.classList.add('fade-out');
            setTimeout(() => {
                element.textContent = config.words[wordIndex];
                element.classList.remove('fade-out');
                element.classList.add('fade-in');
            }, config.fadeDuration);
        });
        wordIndex = (wordIndex + 1) % config.words.length;
    }

    /**
     * Handles the countdown timer.
     * Starts the countdown from 32 days and ensures positive numbers.
     */
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetCountdownDate - now;

        // Calculate days, hours, minutes, and seconds
        // Use Math.max(0, ...) to ensure numbers are never negative
        const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
        const hours = Math.max(0, Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = Math.max(0, Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)));
        const seconds = Math.max(0, Math.floor((difference % (1000 * 60)) / 1000));

        // Update the display elements, ensuring two digits
        if (elements.days) elements.days.textContent = days.toString().padStart(2, "0");
        if (elements.hours) elements.hours.textContent = hours.toString().padStart(2, "0");
        if (elements.minutes) elements.minutes.textContent = minutes.toString().padStart(2, "0");
        if (elements.seconds) elements.seconds.textContent = seconds.toString().padStart(2, "0");

        // If the countdown is finished, clear the interval
        if (difference < 0) {
            clearInterval(countdownInterval); // Use the named interval
            if (elements.days) elements.days.textContent = '00';
            if (elements.hours) elements.hours.textContent = '00';
            if (elements.minutes) elements.minutes.textContent = '00';
            if (elements.seconds) elements.seconds.textContent = '00';
            // Optionally, display a message like "Countdown Ended!"
        }
    }

    /**
     * Handles the sidebar functionality.
     */
    function handleSidebar() {
        // Hamburger click to open sidebar
        if (elements.hamburger && elements.sidebar) {
            elements.hamburger.addEventListener('click', () => {
                elements.sidebar.classList.add('open');
                const overlay = document.getElementById('overlay');
                if (overlay) overlay.classList.add('active');
            });
        }

        // Close sidebar button click
        if (elements.closeSidebar && elements.sidebar) {
            elements.closeSidebar.addEventListener('click', () => {
                elements.sidebar.classList.remove('open');
                const overlay = document.getElementById('overlay');
                if (overlay) overlay.classList.remove('active');
            });
        }

        // Close sidebar when a navigation link is clicked (both navbar and sidebar links)
        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (elements.sidebar && elements.sidebar.classList.contains('open')) {
                    elements.sidebar.classList.remove('open');
                    const overlay = document.getElementById('overlay');
                    if (overlay) overlay.classList.remove('active');
                }
            });
        });

        // Close sidebar if overlay is clicked
        const overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                if (elements.sidebar && elements.sidebar.classList.contains('open')) {
                    elements.sidebar.classList.remove('open');
                    overlay.classList.remove('active');
                }
            });
        }
    }

    /**
     * Handles the theme toggle functionality.
     */
    function handleThemeToggle() {
        if (elements.themeToggle) {
            elements.themeToggle.addEventListener("click", () => {
                const currentTheme = elements.body.classList.contains('dark') ? 'light' : 'dark';
                setTheme(currentTheme);
            });
        }
    }

    /**
     * Updates the 3D book view.
     */
    function updateBookView() {
        if (!elements.pages || elements.pages.length === 0) return;

        elements.pages.forEach((page, index) => {
            if (index < currentPage) { // Pages that have been "turned"
                page.style.transform = 'rotateY(-180deg)';
                page.style.zIndex = elements.pages.length - index; // Ensure flipped pages go behind
            } else { // Pages yet to be turned or current page
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = elements.pages.length + (index === currentPage ? 1 : 0); // Current page on top
            }
        });

        // Enable/disable navigation buttons
        if (elements.prevPageButton) elements.prevPageButton.disabled = currentPage === 0;
        if (elements.nextPageButton) elements.nextPageButton.disabled = currentPage >= elements.pages.length - 1;
    }

    /**
     * Initializes 3D book viewer event listeners.
     */
    function initBookViewer() {
        if (elements.bookViewer && elements.closeBookButton) {
            // Open book viewer from gallery buttons (assuming data-start-page is used)
            document.querySelectorAll('.view-3d-button').forEach(button => {
                button.addEventListener('click', () => {
                    const startPage = parseInt(button.dataset.startPage || '0', 10);
                    currentPage = startPage;
                    elements.bookViewer.classList.add('active'); // Use 'active' for visibility
                    updateBookView();
                });
            });

            elements.closeBookButton.addEventListener('click', () => {
                elements.bookViewer.classList.remove('active');
                currentPage = 0; // Reset to first page when closing
                updateBookView();
            });

            if (elements.nextPageButton) {
                elements.nextPageButton.addEventListener('click', () => {
                    if (currentPage < elements.pages.length - 1) {
                        currentPage++;
                        updateBookView();
                    }
                });
            }

            if (elements.prevPageButton) {
                elements.prevPageButton.addEventListener('click', () => {
                    if (currentPage > 0) {
                        currentPage--;
                        updateBookView();
                    }
                });
            }
        }
    }

    /**
     * Initializes PDF viewer event listeners.
     */
    function initPdfViewer() {
        if (elements.pdfViewerModal && elements.closePdfViewerBtn && elements.pdfIframe) {
            document.querySelectorAll('.view-pdf-button').forEach(button => {
                button.addEventListener('click', () => {
                    const pdfLink = button.querySelector('a').href; // Get href from the nested <a>
                    elements.pdfIframe.src = pdfLink; // Set the PDF source
                    elements.pdfViewerModal.classList.add('active'); // Show the modal
                });
            });

            elements.closePdfViewerBtn.addEventListener('click', () => {
                elements.pdfViewerModal.classList.remove('active'); // Hide the modal
                elements.pdfIframe.src = ''; // Clear the iframe source to stop any loading
            });
        }
    }

    // --- Initialization ---

    // Calculate target date for countdown: 32 days from now
    targetCountdownDate = new Date();
    targetCountdownDate.setDate(targetCountdownDate.getDate() + 32);

    // Apply saved theme or default theme on load
    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme || config.defaultTheme);

    // --- Event Listeners and Initial Calls ---
    handleThemeToggle();
    handleSidebar();
    
    // Start changing word animation only if elements exist
    if (elements.changingWords.length > 0) {
        setInterval(handleChangingWord, 2500);
        handleChangingWord(); // Initial call to display first word immediately
    }

    // Start countdown only if elements exist
    if (elements.days && elements.hours && elements.minutes && elements.seconds) {
        updateCountdown(); // Initial call to avoid delay
        countdownInterval = setInterval(updateCountdown, 1000); // Store interval ID
    }

    initBookViewer(); // Initialize 3D book viewer
    initPdfViewer(); // Initialize PDF viewer
});
