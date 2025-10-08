// BukuKita Application JavaScript
class BukuKita {
    constructor() {
        this.apiUrl = 'https://www.googleapis.com/books/v1/volumes';
        this.currentBooks = [];
        this.favorites = this.loadFavorites();
        this.recentSearches = this.loadRecentSearches();
        this.currentView = 'grid';
        this.currentSort = 'relevance';
        this.currentPage = 'home';
        this.currentFilters = {
            language: 'all',
            publishedDate: 'all',
            minRating: '0'
        };
        this.carouselIndex = 0;
        this.carouselItems = [];
        
        this.initializeEventListeners();
        this.updateFavoritesUI();
        this.loadPopularBooks();
        this.updateRecentSearches();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.navigateToPage(e.target.dataset.page);
            });
        });

        // Hero search functionality
        document.getElementById('heroSearchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchFromHero();
            }
        });

        // Category cards on home page
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.exploreCategory(e.currentTarget.dataset.category);
            });
        });

        // Carousel controls
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousCarouselItem();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextCarouselItem();
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchBooks();
                }
            });
        }

        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchBooks();
            });
        }

        // Filter toggle
        const filterToggle = document.getElementById('filterToggle');
        if (filterToggle) {
            filterToggle.addEventListener('click', () => {
                this.toggleFilters();
            });
        }

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Sort functionality
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBooks(e.target.value);
            });
        }

        // Filter changes
        document.querySelectorAll('.filter-select, .filter-input').forEach(input => {
            input.addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Clear results
        const clearBtn = document.getElementById('clearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearResults();
            });
        }

        // Favorites toggle (support multiple buttons with same id in DOM)
        document.querySelectorAll('#favoritesToggle').forEach(btn => {
            btn.addEventListener('click', () => {
                this.toggleFavoritesSidebar();
            });
        });

        // Close favorites sidebar
        document.getElementById('closeFavorites').addEventListener('click', () => {
            this.closeFavoritesSidebar();
        });

        // Close sidebar when clicking overlay
        document.getElementById('overlay').addEventListener('click', () => {
            this.closeFavoritesSidebar();
        });

        // Category filter buttons
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterCategories(e.target.dataset.category);
            });
        });

        // Load suggestions on page load
        window.addEventListener('load', () => {
            this.loadSuggestions();
        });
    }

    // Load random suggestions
    loadSuggestions() {
        const suggestions = [
            'Harry Potter',
            'The Great Gatsby', 
            'To Kill a Mockingbird',
            '1984',
            'Pride and Prejudice',
            'The Catcher in the Rye',
            'Lord of the Rings',
            'The Hobbit',
            'Dune',
            'The Hunger Games',
            'Game of Thrones',
            'The Alchemist'
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        document.getElementById('searchInput').placeholder = 
            `Coba cari "${randomSuggestion}" atau ketik kata kunci lainnya...`;
    }

    // Show loading state
    showLoading() {
        document.getElementById('loading').style.display = 'block';
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('noResults').style.display = 'none';
    }

    // Hide loading state
    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // Show results
    showResults() {
        document.getElementById('resultsContainer').style.display = 'block';
        document.getElementById('clearBtn').style.display = 'inline-block';
        document.getElementById('filterToggle').style.display = 'inline-block';
    }

    // Show no results message
    showNoResults() {
        document.getElementById('noResults').style.display = 'block';
        document.getElementById('clearBtn').style.display = 'inline-block';
    }

    // Clear all results
    clearResults() {
        document.getElementById('resultsContainer').style.display = 'none';
        document.getElementById('noResults').style.display = 'none';
        document.getElementById('clearBtn').style.display = 'none';
        document.getElementById('filterToggle').style.display = 'none';
        document.getElementById('searchInput').value = '';
        document.getElementById('filterSection').classList.remove('active');
        this.currentBooks = [];
    }

    // Toggle filters section
    toggleFilters() {
        const filterSection = document.getElementById('filterSection');
        filterSection.classList.toggle('active');
    }

    // Switch between grid and list view
    switchView(view) {
        this.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Update display
        document.getElementById('booksGrid').classList.toggle('active', view === 'grid');
        document.getElementById('booksList').classList.toggle('active', view === 'list');
    }

    // Sort books
    sortBooks(sortBy) {
        this.currentSort = sortBy;
        
        switch(sortBy) {
            case 'newest':
                this.currentBooks.sort((a, b) => {
                    const dateA = new Date(a.volumeInfo.publishedDate || 0);
                    const dateB = new Date(b.volumeInfo.publishedDate || 0);
                    return dateB - dateA;
                });
                break;
            case 'oldest':
                this.currentBooks.sort((a, b) => {
                    const dateA = new Date(a.volumeInfo.publishedDate || 0);
                    const dateB = new Date(b.volumeInfo.publishedDate || 0);
                    return dateA - dateB;
                });
                break;
            case 'rating':
                this.currentBooks.sort((a, b) => {
                    const ratingA = a.volumeInfo.averageRating || 0;
                    const ratingB = b.volumeInfo.averageRating || 0;
                    return ratingB - ratingA;
                });
                break;
            case 'title':
                this.currentBooks.sort((a, b) => {
                    const titleA = (a.volumeInfo.title || '').toLowerCase();
                    const titleB = (b.volumeInfo.title || '').toLowerCase();
                    return titleA.localeCompare(titleB);
                });
                break;
            default:
                // Keep original order for relevance
                break;
        }
        
        this.displayBooks(this.currentBooks);
    }

    // Apply filters
    applyFilters() {
        const language = document.getElementById('languageFilter').value;
        const publishedDate = document.getElementById('dateFilter').value;
        const minRating = document.getElementById('ratingFilter').value;
        
        this.currentFilters = { language, publishedDate, minRating };
        
        let filteredBooks = [...this.currentBooks];
        
        // Filter by language
        if (language !== 'all') {
            filteredBooks = filteredBooks.filter(book => 
                book.volumeInfo.language === language
            );
        }
        
        // Filter by published date
        if (publishedDate !== 'all') {
            const currentYear = new Date().getFullYear();
            filteredBooks = filteredBooks.filter(book => {
                const publishedYear = new Date(book.volumeInfo.publishedDate || 0).getFullYear();
                const yearsAgo = currentYear - publishedYear;
                
                switch(publishedDate) {
                    case 'last5years':
                        return yearsAgo <= 5;
                    case 'last10years':
                        return yearsAgo <= 10;
                    case 'last20years':
                        return yearsAgo <= 20;
                    case 'older':
                        return yearsAgo > 20;
                    default:
                        return true;
                }
            });
        }
        
        // Filter by minimum rating
        if (minRating !== '0') {
            const minRatingValue = parseFloat(minRating);
            filteredBooks = filteredBooks.filter(book => 
                (book.volumeInfo.averageRating || 0) >= minRatingValue
            );
        }
        
        this.displayBooks(filteredBooks);
    }

    // Search books using Google Books API
    async searchBooks() {
        const query = document.getElementById('searchInput').value.trim();
        
        if (!query) {
            this.showError('Silakan masukkan kata kunci pencarian!');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}&maxResults=40`);
            const data = await response.json();

            this.hideLoading();

            if (data.items && data.items.length > 0) {
                this.currentBooks = data.items;
                this.displayBooks(data.items);
                this.showResults();
                this.updateResultsCount(data.items.length, data.totalItems);
            } else {
                this.showNoResults();
            }

        } catch (error) {
            this.hideLoading();
            console.error('Error fetching books:', error);
            this.showError('Terjadi kesalahan saat mencari buku. Silakan coba lagi.');
        }
    }

    // Display books in the UI
    displayBooks(books) {
        const booksGrid = document.getElementById('booksGrid');
        const booksList = document.getElementById('booksList');
        
        booksGrid.innerHTML = '';
        booksList.innerHTML = '';

        books.forEach(book => {
            const bookCard = this.createBookCard(book);
            const bookListItem = this.createBookCard(book, true);
            
            booksGrid.appendChild(bookCard);
            booksList.appendChild(bookListItem);
        });
    }

    // Create book card element
    createBookCard(book, isListView = false) {
        const card = document.createElement('div');
        card.className = `book-card ${isListView ? 'list-view' : ''}`;
        
        if (this.favorites.includes(book.id)) {
            card.classList.add('favorite');
        }

        const volumeInfo = book.volumeInfo || {};
        const title = volumeInfo.title || 'Judul tidak tersedia';
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Penulis tidak diketahui';
        const description = volumeInfo.description || 'Deskripsi tidak tersedia.';
        const imageLinks = volumeInfo.imageLinks || {};
        const preferredImage = imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail || imageLinks.smallThumbnail || '';
        const thumbnail = preferredImage ? preferredImage.replace('http:', 'https:') : '';
        const averageRating = volumeInfo.averageRating || 0;
        const ratingsCount = volumeInfo.ratingsCount || 0;
        const publishedDate = volumeInfo.publishedDate || '';
        const previewLink = volumeInfo.previewLink || '#';
        const infoLink = volumeInfo.infoLink || '#';
        const pageCount = volumeInfo.pageCount || 0;
        const language = volumeInfo.language || 'id';
        const categories = volumeInfo.categories || [];

        const stars = this.generateStars(averageRating);
        const year = publishedDate ? new Date(publishedDate).getFullYear() : 'Tahun tidak diketahui';

        card.innerHTML = `
            <div class="book-cover">
                ${thumbnail ? 
                    `<img src="${thumbnail}" alt="${title}" loading="lazy">` :
                    `<div class="book-cover-placeholder">
                        <div style="font-size: 2rem; margin-bottom: 10px;">📚</div>
                        <div>Tidak ada gambar</div>
                    </div>`
                }
            </div>
            <div class="book-details">
                <div class="book-title">${title}</div>
                <div class="book-authors">✍️ ${authors}</div>
                ${categories.length > 0 ? `<div style="color: #888; font-size: 0.8rem; margin-bottom: 10px;">🏷️ ${categories[0]}</div>` : ''}
                <div class="book-description">${description}</div>
                <div class="book-info">
                    <div class="book-rating">
                        <span class="stars">${stars}</span>
                        <span>(${ratingsCount})</span>
                    </div>
                    <div>📅 ${year} ${pageCount ? `• ${pageCount} halaman` : ''}</div>
                </div>
                <div class="book-actions">
                    <button class="action-btn primary" onclick="bookFinder.openPreview('${previewLink}')">
                        👁️ Preview
                    </button>
                    <button class="action-btn" onclick="bookFinder.openInfo('${infoLink}')">
                        ℹ️ Info
                    </button>
                    <button class="action-btn ${this.favorites.includes(book.id) ? 'favorite' : ''}" 
                            onclick="bookFinder.toggleFavorite('${book.id}')">
                        ${this.favorites.includes(book.id) ? '❤️ Favorit' : '🤍 Tambah Favorit'}
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    // Generate star rating HTML
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    // Update results count
    updateResultsCount(displayed, total) {
        document.getElementById('resultsCount').textContent = 
            `Menampilkan ${displayed} dari ${total} total hasil`;
    }

    // Open book preview
    openPreview(previewLink) {
        if (previewLink !== '#') {
            window.open(previewLink, '_blank');
        } else {
            this.showError('Preview tidak tersedia untuk buku ini.');
        }
    }

    // Open book info
    openInfo(infoLink) {
        if (infoLink !== '#') {
            window.open(infoLink, '_blank');
        }
    }

    // Toggle favorite status
    toggleFavorite(bookId) {
        const index = this.favorites.indexOf(bookId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(bookId);
        }
        
        this.saveFavorites();
        this.updateFavoritesUI();
        
        // Update the specific book card
        const bookCard = document.querySelector(`[onclick*="${bookId}"]`)?.closest('.book-card');
        if (bookCard) {
            bookCard.classList.toggle('favorite');
            const favoriteBtn = bookCard.querySelector('[onclick*="toggleFavorite"]');
            if (favoriteBtn) {
                favoriteBtn.innerHTML = this.favorites.includes(bookId) ? 
                    '❤️ Favorit' : '🤍 Tambah Favorit';
                favoriteBtn.className = `action-btn ${this.favorites.includes(bookId) ? 'favorite' : ''}`;
            }
        }
    }

    // Load favorites from localStorage
    loadFavorites() {
        const saved = localStorage.getItem('bookFinderFavorites');
        return saved ? JSON.parse(saved) : [];
    }

    // Save favorites to localStorage
    saveFavorites() {
        localStorage.setItem('bookFinderFavorites', JSON.stringify(this.favorites));
    }

    // Update favorites UI
    updateFavoritesUI() {
        const favoritesCount = document.getElementById('favoritesCount');
        if (favoritesCount) {
            favoritesCount.textContent = this.favorites.length;
        }
        
        this.updateFavoritesSidebar();
    }

    // Update favorites sidebar content
    updateFavoritesSidebar() {
        const favoritesContent = document.getElementById('favoritesContent');
        if (!favoritesContent) return;
        
        if (this.favorites.length === 0) {
            favoritesContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">📚</div>
                    <h3>Belum ada buku favorit</h3>
                    <p>Cari dan tambahkan buku ke favorit untuk melihatnya di sini</p>
                </div>
            `;
            return;
        }
        
        // This would need to store full book data or fetch it again
        // For now, we'll show a simple list
        favoritesContent.innerHTML = this.favorites.map(bookId => `
            <div class="favorite-item">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div>
                        <div class="book-title">Buku ID: ${bookId}</div>
                        <div class="book-authors">Klik untuk melihat detail</div>
                    </div>
                    <button class="remove-favorite" onclick="bookFinder.removeFavorite('${bookId}')">
                        ✖️
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Remove favorite
    removeFavorite(bookId) {
        const index = this.favorites.indexOf(bookId);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.updateFavoritesUI();
        }
    }

    // Toggle favorites sidebar
    toggleFavoritesSidebar() {
        const sidebar = document.getElementById('favoritesSidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    // Close favorites sidebar
    closeFavoritesSidebar() {
        const sidebar = document.getElementById('favoritesSidebar');
        const overlay = document.getElementById('overlay');
        
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    // Show error message
    showError(message) {
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = `
            <div class="error-message">${message}</div>
        `;
        resultsContainer.style.display = 'block';
        document.getElementById('clearBtn').style.display = 'inline-block';
    }

    // Navigation functions
    navigateToPage(page) {
        // Update active nav button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });

        // Show selected page
        document.getElementById(`${page}Page`).classList.add('active');
        this.currentPage = page;

        // Load page-specific content
        if (page === 'home') {
            this.loadPopularBooks();
            this.updateRecentSearches();
        }
    }

    // Search from hero section
    searchFromHero() {
        const query = document.getElementById('heroSearchInput').value.trim();
        if (query) {
            // Navigate to search page
            this.navigateToPage('search');
            // Set search input value
            document.getElementById('searchInput').value = query;
            // Perform search
            this.searchBooks();
        }
    }

    // Load popular books for carousel
    async loadPopularBooks() {
        try {
            const popularQueries = [
                'best seller fiction',
                'popular science books',
                'business leadership',
                'self help motivation',
                'history world war'
            ];

            const randomQuery = popularQueries[Math.floor(Math.random() * popularQueries.length)];
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(randomQuery)}&maxResults=10`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                this.carouselItems = data.items.slice(0, 6); // Show 6 books
                this.displayCarousel();
            }
        } catch (error) {
            console.error('Error loading popular books:', error);
        }
    }

    // Display carousel
    displayCarousel() {
        const carouselContainer = document.getElementById('carouselContainer');
        carouselContainer.innerHTML = '';

        this.carouselItems.forEach(book => {
            const card = this.createCarouselCard(book);
            carouselContainer.appendChild(card);
        });

        this.updateCarouselControls();
    }

    // Create carousel card
    createCarouselCard(book) {
        const card = document.createElement('div');
        card.className = 'carousel-book-card';

        const volumeInfo = book.volumeInfo || {};
        const title = volumeInfo.title || 'Judul tidak tersedia';
        const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Penulis tidak diketahui';
        const imageLinks = volumeInfo.imageLinks || {};
        const preferredImage = imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail || imageLinks.smallThumbnail || '';
        const thumbnail = preferredImage ? preferredImage.replace('http:', 'https:') : '';

        card.innerHTML = `
            <div class="carousel-book-cover">
                ${thumbnail ? 
                    `<img src="${thumbnail}" alt="${title}" loading="lazy">` :
                    `<div>📚<br>Tidak ada gambar</div>`
                }
            </div>
            <div class="carousel-book-title">${title}</div>
            <div class="carousel-book-authors">✍️ ${authors}</div>
        `;

        card.addEventListener('click', () => {
            this.openBookPreview(book);
        });

        return card;
    }

    // Carousel navigation
    nextCarouselItem() {
        const container = document.getElementById('carouselContainer');
        const itemWidth = 220; // 200px + 20px gap
        const maxItems = Math.floor(container.parentElement.offsetWidth / itemWidth);
        
        if (this.carouselIndex < this.carouselItems.length - maxItems) {
            this.carouselIndex++;
            container.style.transform = `translateX(-${this.carouselIndex * itemWidth}px)`;
            this.updateCarouselControls();
        }
    }

    previousCarouselItem() {
        if (this.carouselIndex > 0) {
            this.carouselIndex--;
            const itemWidth = 220;
            const container = document.getElementById('carouselContainer');
            container.style.transform = `translateX(-${this.carouselIndex * itemWidth}px)`;
            this.updateCarouselControls();
        }
    }

    // Update carousel controls
    updateCarouselControls() {
        const container = document.getElementById('carouselContainer');
        const itemWidth = 220;
        const maxItems = Math.floor(container.parentElement.offsetWidth / itemWidth);
        
        document.getElementById('prevBtn').disabled = this.carouselIndex === 0;
        document.getElementById('nextBtn').disabled = this.carouselIndex >= this.carouselItems.length - maxItems;
    }

    // Open book preview
    openBookPreview(book) {
        const previewLink = book.volumeInfo?.previewLink || book.volumeInfo?.infoLink;
        if (previewLink) {
            window.open(previewLink, '_blank');
        }
    }

    // Explore category
    exploreCategory(category) {
        this.navigateToPage('search');
        
        // Map category to search terms
        const categoryMap = {
            'fiction': 'fiction novel',
            'science': 'science technology',
            'history': 'history biography',
            'self-help': 'self help motivation',
            'business': 'business management',
            'children': 'children books'
        };

        const searchTerm = categoryMap[category] || category;
        document.getElementById('searchInput').value = searchTerm;
        this.searchBooks();
    }

    // Filter categories
    filterCategories(category) {
        // Update active filter button
        document.querySelectorAll('.category-filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter category cards
        const cards = document.querySelectorAll('.detailed-category-card');
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Load and save recent searches
    loadRecentSearches() {
        const saved = localStorage.getItem('bookFinderRecentSearches');
        return saved ? JSON.parse(saved) : [];
    }

    saveRecentSearches() {
        localStorage.setItem('bookFinderRecentSearches', JSON.stringify(this.recentSearches));
    }

    addRecentSearch(query) {
        // Remove if already exists
        this.recentSearches = this.recentSearches.filter(search => search !== query);
        // Add to beginning
        this.recentSearches.unshift(query);
        // Keep only last 10
        this.recentSearches = this.recentSearches.slice(0, 10);
        this.saveRecentSearches();
        this.updateRecentSearches();
    }

    updateRecentSearches() {
        const container = document.getElementById('recentSearches');
        if (!container) return;

        if (this.recentSearches.length === 0) {
            container.innerHTML = `
                <div class="no-recent">
                    <p>Belum ada pencarian terbaru. Mulai cari buku favorit Anda!</p>
                </div>
            `;
        } else {
            container.innerHTML = this.recentSearches.map(search => `
                <div class="recent-search-item" onclick="bookFinder.searchRecent('${search}')">
                    ${search}
                </div>
            `).join('');
        }
    }

    // Search from recent searches
    searchRecent(query) {
        this.navigateToPage('search');
        document.getElementById('searchInput').value = query;
        this.searchBooks();
    }

    // Override searchBooks to add recent search
    async searchBooks() {
        const query = document.getElementById('searchInput').value.trim();
        
        if (!query) {
            this.showError('Silakan masukkan kata kunci pencarian!');
            return;
        }

        // Add to recent searches
        this.addRecentSearch(query);

        this.showLoading();

        try {
            const response = await fetch(`${this.apiUrl}?q=${encodeURIComponent(query)}&maxResults=40`);
            const data = await response.json();

            this.hideLoading();

            if (data.items && data.items.length > 0) {
                this.currentBooks = data.items;
                this.displayBooks(data.items);
                this.showResults();
                this.updateResultsCount(data.items.length, data.totalItems);
            } else {
                this.showNoResults();
            }

        } catch (error) {
            this.hideLoading();
            console.error('Error fetching books:', error);
            this.showError('Terjadi kesalahan saat mencari buku. Silakan coba lagi.');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookFinder = new BukuKita();
});
