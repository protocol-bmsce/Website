document.addEventListener("DOMContentLoaded", () => {
    // --- Element Selectors ---
    const elements = {
        themeToggle: document.getElementById("theme-toggle"),
        body: document.body,
        hamburger: document.getElementById('hamburger'),
        sidebar: document.getElementById('sidebar'),
        closeSidebar: document.getElementById('close-sidebar'),
        navbar: document.getElementById('navbar'),
        navLinks: document.querySelectorAll('#navbar a, .sidebar-nav a'),
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds"),
        changingWord: document.querySelector('.changing-word'),
        bookViewer: document.querySelector('.book-viewer'),
        closeBookButton: document.querySelector('.close-book'),
        view3DButtons: document.querySelectorAll('.view-3d-button'),
        pages: document.querySelectorAll('.book .page'),
        nextPageButton: document.getElementById('next-page'),
        prevPageButton: document.getElementById('prev-page'),
        imageViewer: document.querySelector('.image-viewer-container'),
        closeViewer: document.querySelector('.close-viewer')
    };

    // --- Configuration ---
    const config = {
        targetDate: new Date("2025-06-15T00:00:00"),
        words: ["Creativity", "Innovation", "Learning", "Technology"],
        fadeDuration: 500,
        wordChangeInterval: 2000,
        countdownInterval: 1000,
        defaultTheme: localStorage.getItem("theme") || 'light'
    };

    // --- State ---
    let wordIndex = 0;
    let currentPage = 0;
    const totalPages = elements.pages ? elements.pages.length : 0;

    // --- Helper Functions ---
    function setTheme(theme) {
        elements.body.classList.remove('light', 'dark');
        elements.body.classList.add(theme);
        localStorage.setItem("theme", theme);
        elements.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // --- Component Functions ---
    function handleChangingWord() {
        if (!elements.changingWord) return;
        
        elements.changingWord.classList.add('fade-out');
        setTimeout(() => {
            elements.changingWord.textContent = config.words[wordIndex];
            elements.changingWord.classList.remove('fade-out');
            elements.changingWord.classList.add('fade-in');
            setTimeout(() => elements.changingWord.classList.remove('fade-in'), config.fadeDuration);
        }, config.fadeDuration);
        wordIndex = (wordIndex + 1) % config.words.length;
    }

    function handleCountdown() {
        if (!elements.days || !elements.hours || !elements.minutes || !elements.seconds) return;
        
        const now = new Date();
        const diff = config.targetDate - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        elements.days.textContent = days.toString().padStart(2, "0");
        elements.hours.textContent = hours.toString().padStart(2, "0");
        elements.minutes.textContent = minutes.toString().padStart(2, "0");
        elements.seconds.textContent = seconds.toString().padStart(2, "0");
    }

    function handleSidebar() {
        if (!elements.hamburger || !elements.sidebar || !elements.closeSidebar) return;

        elements.hamburger.addEventListener('click', () => {
            elements.sidebar.classList.add('open');
            document.body.style.overflow = 'hidden';
        });

        elements.closeSidebar.addEventListener('click', () => {
            elements.sidebar.classList.remove('open');
            document.body.style.overflow = '';
        });

        elements.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                elements.sidebar.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    function handleThemeToggle() {
        if (!elements.themeToggle) return;
        
        elements.themeToggle.addEventListener("click", () => {
            const currentTheme = elements.body.classList.contains('dark') ? 'light' : 'dark';
            setTheme(currentTheme);
        });
    }

    function handleBookViewer() {
        if (!elements.view3DButtons || !elements.bookViewer || !elements.closeBookButton) return;

        function updateBookView() {
            elements.pages.forEach((page, index) => {
                if (index <= currentPage) {
                    page.style.transform = 'rotateY(-180deg)';
                    page.style.zIndex = totalPages - index;
                } else {
                    page.style.transform = 'rotateY(0deg)';
                    page.style.zIndex = index;
                }
            });
        }

        elements.view3DButtons.forEach(button => {
            button.addEventListener('click', () => {
                elements.bookViewer.classList.remove('hidden');
                currentPage = 0;
                updateBookView();
                document.body.style.overflow = 'hidden';
            });
        });

        // Fixed close book functionality
        elements.closeBookButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            elements.bookViewer.classList.add('hidden');
            document.body.style.overflow = '';
        });

        // Also close when clicking outside the book content
        elements.bookViewer.addEventListener('click', (e) => {
            if (e.target === elements.bookViewer) {
                elements.bookViewer.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });

        if (elements.nextPageButton) {
            elements.nextPageButton.addEventListener('click', () => {
                if (currentPage < totalPages - 1) {
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

    function handleImageViewer() {
        if (!elements.imageViewer || !elements.closeViewer) return;
        
        elements.closeViewer.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.imageViewer.style.display = 'none';
            document.body.style.overflow = '';
        });

        elements.imageViewer.addEventListener('click', (e) => {
            if (e.target === elements.imageViewer) {
                elements.imageViewer.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    // --- Initialization ---
    setTheme(config.defaultTheme);
    handleThemeToggle();
    handleSidebar();
    handleBookViewer();
    handleImageViewer();
    handleCountdown();
    
    // Set up intervals
    if (elements.changingWord) {
        setInterval(handleChangingWord, config.wordChangeInterval);
    }
    setInterval(handleCountdown, config.countdownInterval);
});

elements.closeBookButton.addEventListener('click', (e) => {
    console.log('Close button clicked'); // Debugging
    e.preventDefault();
    e.stopPropagation();
    elements.bookViewer.classList.add('hidden');
    document.body.style.overflow = '';
});


document.addEventListener("DOMContentLoaded", () => {
    // Book Viewer Functionality
    const bookViewer = document.getElementById('book-viewer');
    const closeBookButton = document.getElementById('close-book');
    const view3DButtons = document.querySelectorAll('.view-3d-button');
    const bookPages = document.querySelectorAll('.book .page');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const bookContainer = document.querySelector('.book-container');
    
    let currentPage = 0;
    const totalPages = bookPages.length;

    // Initialize book viewer
    function initBookViewer() {
        updateBookView();
        
        // Close book viewer only when clicking the close button
        closeBookButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeBookViewer();
        });

        // Prevent closing when clicking inside the book container
        bookContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Navigation buttons
        prevPageButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPage > 0) {
                currentPage--;
                updateBookView();
            }
        });

        nextPageButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentPage < totalPages - 1) {
                currentPage++;
                updateBookView();
            }
        });

        // View in 3D buttons
        view3DButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const imgSrc = button.closest('.photo-card').querySelector('img').src;
                const pageNumber = parseInt(button.dataset.page) - 1;
                
                loadImageIntoBookViewer(imgSrc, pageNumber);
                openBookViewer(pageNumber);
            });
        });
    }

    function loadImageIntoBookViewer(imgSrc, pageNumber) {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            bookPages[pageNumber].querySelector('img').src = imgSrc;
        }
    }

    function openBookViewer(startPage = 0) {
        currentPage = startPage;
        updateBookView();
        bookViewer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeBookViewer() {
        bookViewer.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function updateBookView() {
        bookPages.forEach((page, index) => {
            if (index <= currentPage) {
                page.style.transform = 'rotateY(-180deg)';
                page.style.zIndex = totalPages - index;
            } else {
                page.style.transform = 'rotateY(0deg)';
                page.style.zIndex = index;
            }
        });
    }

    if (bookViewer) {
        initBookViewer();
    }

    // Theme toggle functionality remains the same
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            themeToggle.textContent = document.body.classList.contains('dark') ? '🌞' : '🌓';
            localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
        });

        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.add(savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '🌞' : '🌓';
    }
});


// Example frontend handling
document.getElementById('articleUpload').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('articleTitle').value);
    formData.append('summary', document.getElementById('articleSummary').value);
    formData.append('content', document.getElementById('articleFile').files[0]);
    formData.append('image', document.getElementById('articleImage').files[0]);
    
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Article uploaded successfully!');
        // Refresh the article list
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  });


  // Article Manager with Google Drive Links
const ArticleManager = (() => {
    // DOM Elements
    const elements = {
      articleTitle: document.querySelector('#top-article-title'),
      articleSummary: document.querySelector('#article-summary'),
      readMoreBtn: document.querySelector('#read-more-btn'),
      uploadModal: document.querySelector('#upload-modal'),
      openUploadBtn: document.querySelector('#open-upload'),
      closeUploadBtn: document.querySelector('#close-upload'),
      uploadForm: document.querySelector('#upload-form'),
      googleDriveLink: document.querySelector('#google-drive-link'),
      articleList: document.querySelector('#article-list'),
      searchInput: document.querySelector('#search-input'),
      dateFilter: document.querySelector('#date-filter')
    };
  
    // State
    let state = {
      articles: [],
      currentArticle: null,
      filters: {
        search: '',
        date: ''
      }
    };
  
    // Initialize the app
    const init = () => {
      loadArticles();
      setupEventListeners();
      render();
    };
  
    // Load articles from localStorage
    const loadArticles = () => {
      const savedArticles = localStorage.getItem('articles');
      if (savedArticles) {
        state.articles = JSON.parse(savedArticles);
        if (state.articles.length > 0) {
          state.currentArticle = state.articles[0];
        }
      }
    };
  
    // Save articles to localStorage
    const saveArticles = () => {
      localStorage.setItem('articles', JSON.stringify(state.articles));
    };
  
    // Setup event listeners
    const setupEventListeners = () => {
      // Upload functionality
      elements.openUploadBtn.addEventListener('click', openUploadModal);
      elements.closeUploadBtn.addEventListener('click', closeUploadModal);
      elements.uploadForm.addEventListener('submit', handleUpload);
      
      // Search and filters
      elements.searchInput.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        applyFilters();
      });
      
      elements.dateFilter.addEventListener('change', (e) => {
        state.filters.date = e.target.value;
        applyFilters();
      });
    };
  
    // Render the UI
    const render = () => {
      renderCurrentArticle();
      renderArticleList();
    };
  
    // Render the current featured article
    const renderCurrentArticle = () => {
      if (state.currentArticle) {
        elements.articleTitle.textContent = state.currentArticle.title;
        elements.articleSummary.textContent = state.currentArticle.summary;
        elements.readMoreBtn.href = state.currentArticle.driveLink;
        elements.readMoreBtn.target = '_blank';
      } else {
        elements.articleTitle.textContent = 'No articles available';
        elements.articleSummary.textContent = 'Upload your first article using the button below';
        elements.readMoreBtn.href = '#';
      }
    };
  
    // Render the article list
    const renderArticleList = () => {
      elements.articleList.innerHTML = '';
      
      const filteredArticles = applyFilters();
      
      filteredArticles.forEach(article => {
        const articleEl = document.createElement('div');
        articleEl.className = 'article-item';
        articleEl.innerHTML = `
          <h3>${article.title}</h3>
          <p>${article.summary.substring(0, 100)}...</p>
          <a href="${article.driveLink}" target="_blank" class="open-link">Open in Drive</a>
          <button class="feature-btn" data-id="${article.id}">Feature</button>
          <button class="delete-btn" data-id="${article.id}">Delete</button>
        `;
        elements.articleList.appendChild(articleEl);
      });
      
      // Add event listeners to the new buttons
      document.querySelectorAll('.feature-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const articleId = e.target.getAttribute('data-id');
          featureArticle(articleId);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const articleId = e.target.getAttribute('data-id');
          deleteArticle(articleId);
        });
      });
    };
  
    // Apply search/filters
    const applyFilters = () => {
      let filtered = [...state.articles];
      
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(searchTerm) || 
          article.summary.toLowerCase().includes(searchTerm)
        );
      }
      
      if (state.filters.date) {
        filtered = filtered.filter(article => 
          new Date(article.date).toDateString() === new Date(state.filters.date).toDateString()
        );
      }
      
      return filtered;
    };
  
    // Upload modal functions
    const openUploadModal = () => {
      elements.uploadModal.style.display = 'block';
    };
  
    const closeUploadModal = () => {
      elements.uploadModal.style.display = 'none';
      elements.uploadForm.reset();
    };
  
    // Handle form submission
    const handleUpload = (e) => {
      e.preventDefault();
      
      const title = elements.uploadForm.querySelector('#article-title').value;
      const summary = elements.uploadForm.querySelector('#article-summary').value;
      const driveLink = elements.googleDriveLink.value;
      
      // Validate Google Drive link
      if (!isValidDriveLink(driveLink)) {
        alert('Please enter a valid Google Drive link');
        return;
      }
      
      const newArticle = {
        id: Date.now().toString(),
        title,
        summary,
        driveLink: formatDriveLink(driveLink),
        date: new Date().toISOString()
      };
      
      // Add to beginning of array
      state.articles.unshift(newArticle);
      state.currentArticle = newArticle;
      
      saveArticles();
      render();
      closeUploadModal();
      
      alert('Article added successfully!');
    };
  
    // Validate Google Drive link
    const isValidDriveLink = (link) => {
      return link.includes('drive.google.com') && 
            (link.includes('/file/d/') || link.includes('/open?id='));
    };
  
    // Format Google Drive link to direct view
    const formatDriveLink = (link) => {
      // If it's already a direct view link, return as is
      if (link.includes('/view')) return link;
      
      // Extract file ID
      let fileId = '';
      if (link.includes('/file/d/')) {
        fileId = link.split('/file/d/')[1].split('/')[0];
      } else if (link.includes('id=')) {
        fileId = link.split('id=')[1].split('&')[0];
      }
      
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/view`;
      }
      
      return link;
    };
  
    // Feature an article
    const featureArticle = (articleId) => {
      const article = state.articles.find(a => a.id === articleId);
      if (article) {
        state.currentArticle = article;
        saveArticles();
        render();
      }
    };
  
    // Delete an article
    const deleteArticle = (articleId) => {
      if (confirm('Are you sure you want to delete this article?')) {
        state.articles = state.articles.filter(a => a.id !== articleId);
        
        // If we deleted the current featured article, select a new one
        if (state.currentArticle && state.currentArticle.id === articleId) {
          state.currentArticle = state.articles.length > 0 ? state.articles[0] : null;
        }
        
        saveArticles();
        render();
      }
    };
  
    // Public API
    return {
      init
    };
  })();
  
  // Initialize the app when DOM is loaded
  document.addEventListener('DOMContentLoaded', ArticleManager.init);