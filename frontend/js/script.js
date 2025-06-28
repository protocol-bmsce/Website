document.addEventListener("DOMContentLoaded", () => {
    // --- Element Selectors ---
    const elements = {
        themeToggle: document.getElementById("theme-toggle"),
        body: document.body,
        hamburger: document.getElementById('hamburger'),
        sidebar: document.getElementById('sidebar'),
        closeSidebar: document.getElementById('close-sidebar'),
        navbar: document.getElementById('navbar'),
        navLinks: document.querySelectorAll('#navbar a'),
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds"),
        changingWords: document.querySelectorAll('.changing-word'),
    };

    // --- Configuration ---
    const config = {
        targetDate: new Date("2025-06-15T00:00:00"),
        words: ["Creativity", "Innovation", "Learning", "Technology"],
        fadeDuration: 500, // Consistent variable for fade duration
        sidebarSlideDuration: '0.3s', //Added CSS transition duration
        defaultTheme: 'light',
    };

    // --- State ---
    let wordIndex = 0;

    // --- Helper Functions ---

    /**
     * Applies a theme to the body and stores it in localStorage.
     * @param {string} theme - The theme to apply ('light' or 'dark').
     */
    function setTheme(theme) {
        elements.body.classList.remove('light', 'dark'); // Remove both to be safe
        elements.body.classList.add(theme);
        localStorage.setItem("theme", theme);
    }

    // --- Component Functions ---
    /**
 * Applies a custom theme to the body and stores it in localStorage.
 * @param {object} customTheme - An object containing CSS property-value pairs for the theme.
 */
function setTheme(customTheme) {
    const body = document.body;

    // Remove any existing theme classes (optional, if you have them)
    body.classList.remove('light', 'dark');

    // Apply the custom styles directly to the body
    for (const property in customTheme) {
        body.style.setProperty(property, customTheme[property]);
    }

    // Store the custom theme in localStorage.  Important:  stringify the object.
    localStorage.setItem("theme", JSON.stringify(customTheme));
}

    /**
     * Handles the changing word animation.
     */
    function handleChangingWord() {
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
     */
    function handleCountdown() {
        const now = new Date();
        const diff = config.targetDate - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (elements.days) elements.days.textContent = days.toString().padStart(2, "0");
        if (elements.hours) elements.hours.textContent = hours.toString().padStart(2, "0");
        if (elements.minutes) elements.minutes.textContent = minutes.toString().padStart(2, "0");
        if (elements.seconds) elements.seconds.textContent = seconds.toString().padStart(2, "0");
    }

    /**
     * Handles the sidebar functionality.
     */
    function handleSidebar() {
        elements.hamburger.addEventListener('click', () => {
            elements.sidebar.style.left = '0';
        });

        elements.closeSidebar.addEventListener('click', () => {
            elements.sidebar.style.left = '-250px';
        });

        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                elements.sidebar.style.left = '-250px';
            });
        });
    }

    /**
     * Handles the theme toggle functionality.
     */
    function handleThemeToggle() {
        elements.themeToggle.addEventListener("click", () => {
            const currentTheme = elements.body.classList.contains('dark') ? 'light' : 'dark';
            setTheme(currentTheme);
        });
    }

    // --- Initialization ---

    // Apply saved theme or default theme on load
    const savedTheme = localStorage.getItem("theme");
    setTheme(savedTheme || config.defaultTheme);

    // --- Event Listeners ---
    handleThemeToggle();
    handleSidebar();
    setInterval(handleChangingWord, 2500);
    setInterval(handleCountdown, 1000);
    handleCountdown(); // Initial call to avoid delay

    // --- CSS ---
    // No need to manipulate CSS from JS, but if you had to, you could add a function here
    // and call it during initialization.  For example:
    // function addCustomStyles() { ... }
    // addCustomStyles();
});
// --- CSS Transition for Sidebar ---

const darkTheme = {
    backgroundColor: '#2c022c',  // Dark background
    color: '#ffffff',          // White text
    // Add other dark theme styles as needed
    // e.g.,
    //  '--link-color': '#c5a1e4',
    //  '--heading-color': '#f0f0f0',
};

const lightTheme = {
    backgroundColor: '#ffffff',  // Light background
    color: '#2c022c',          // Dark text
    // Add other light theme styles
    // e.g.,
    //  '--link-color': '#007bff',
    //  '--heading-color': '#333',
};

/**
 * Applies a custom theme to the body and stores it in localStorage.
 * @param {object} customTheme - An object containing CSS property-value pairs for the theme.
 */
function setTheme(customTheme) {
    const body = document.body;

    // Remove any existing theme classes (optional, if you have them)
    body.classList.remove('light', 'dark');

    // Apply the custom styles directly to the body
    for (const property in customTheme) {
        body.style.setProperty(property, customTheme[property]);
    }

    // Store the custom theme in localStorage.  Important:  stringify the object.
    localStorage.setItem("theme", JSON.stringify(customTheme));
}

// --- Example Usage ---

// Switch to dark theme
setTheme(darkTheme);

// Switch to light theme
// setTheme(lightTheme);
document.getElementById('theme-toggle').addEventListener('click', function () {
    const body = document.body;
    const themeIcon = document.getElementById('theme-toggle');

    // Toggle the dark class on the body
    body.classList.toggle('dark');

    // Change the icon
    if (body.classList.contains('dark')) {
        themeIcon.textContent = '☀️'; // Light mode icon
    } else {
        themeIcon.textContent = '🌙'; // Dark mode icon
    }
});

document.querySelectorAll('.view-3d-button').forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById('book-viewer').classList.remove('hidden');
      currentPage = 0;
      updateBookView();
    });
  });
  
  document.querySelector('.close-book').addEventListener('click', () => {
    document.getElementById('book-viewer').classList.add('hidden');
  });
  
  let currentPage = 0;
  
  const pages = document.querySelectorAll('.book .page');
  const totalPages = pages.length;
  
  function updateBookView() {
    pages.forEach((page, index) => {
      if (index <= currentPage) {
        page.style.transform = 'rotateY(-180deg)';
        page.style.zIndex = totalPages - index;
      } else {
        page.style.transform = 'rotateY(0deg)';
        page.style.zIndex = index;
      }
    });
  }
  
  document.getElementById('next-page').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      updateBookView();
    }
  });
  
  document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      updateBookView();
    }
  });
  

  document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    const closeSidebar = document.querySelector('.close-sidebar');
  
    if (hamburger && sidebar && closeSidebar) {
      hamburger.addEventListener('click', function() {
        sidebar.classList.add('open');
      });
  
      closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('open');
      });
    }
  
    // Close 3D Book Viewer Functionality
    const closeBookButton = document.querySelector('.close-book');
    const bookViewer = document.querySelector('.book-viewer');
  
    if (closeBookButton && bookViewer) {
      closeBookButton.addEventListener('click', function() {
        bookViewer.classList.add('hidden');
      });
    }
  });