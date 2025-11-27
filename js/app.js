// app.js - Main application logic

const App = {
    // Application state
    currentFilter: 'all',
    currentView: 'posts',
    enrichedPosts: [],

    // Initialize application
    async init() {
        try {
            // Fetch all data
            await DataStorage.fetchAllData();
            
            // Prepare enriched posts
            this.enrichedPosts = DataStorage.getEnrichedPosts();
            
            // Update UI
            this.updateDashboard();
            
            // Hide loading
            UI.hideLoading();
            
            // Initialize events
            Events.init(this);
            
        } catch (error) {
            console.error('Initialization error:', error);
            alert('Veriler yüklenemedi! Lütfen internet bağlantınızı kontrol edin.');
        }
    },

    // Update entire dashboard
    updateDashboard() {
        UI.updateStats(DataStorage.posts, DataStorage.comments, DataStorage.users);
        UI.createUserPostChart(DataStorage.posts);
        UI.createCommentChart(DataStorage.comments);
        this.displayPosts();
        
        // Set initial active state
        document.querySelector('[data-stat="posts"]').classList.add('active');
    },

    // Display posts based on current filter
    displayPosts() {
        let postsToDisplay = [];
        
        if (this.currentFilter === 'all') {
            postsToDisplay = this.enrichedPosts;
        } else if (this.currentFilter === 'popular') {
            postsToDisplay = this.enrichedPosts.filter(p => p.commentCount >= 5);
        } else if (this.currentFilter === 'recent') {
            postsToDisplay = this.enrichedPosts.slice(-20).reverse();
        }

        UI.renderPosts(postsToDisplay);
        document.getElementById('postCountBadge').textContent = postsToDisplay.length;
    },

    // Show stat detail view
    showStatDetail(statType) {
        // Update active state
        document.querySelectorAll('.stat-card').forEach(card => card.classList.remove('active'));
        document.querySelector(`[data-stat="${statType}"]`).classList.add('active');
        
        this.currentView = statType;
        
        const titleElement = document.getElementById('contentTitle');
        const badgeElement = document.getElementById('postCountBadge');
        
        if (statType === 'users') {
            titleElement.innerHTML = '<i class="bi bi-people-fill"></i> Tüm Kullanıcılar';
            badgeElement.textContent = DataStorage.users.length;
            UI.renderUsers(DataStorage.users, DataStorage.posts);
            
        } else if (statType === 'posts') {
            titleElement.innerHTML = '<i class="bi bi-trophy-fill text-warning"></i> Popüler Postlar';
            this.displayPosts();
            
        } else if (statType === 'comments') {
            titleElement.innerHTML = '<i class="bi bi-chat-dots-fill"></i> Tüm Yorumlar';
            badgeElement.textContent = DataStorage.comments.length;
            UI.renderComments(DataStorage.comments);
            
        } else if (statType === 'engagement') {
            titleElement.innerHTML = '<i class="bi bi-bar-chart-fill"></i> En Yüksek Engagement';
            const topEngagedPosts = this.enrichedPosts.slice(0, 20);
            badgeElement.textContent = topEngagedPosts.length;
            UI.renderPosts(topEngagedPosts);
        }
    },

    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        
        // Reset to posts view
        this.currentView = 'posts';
        document.querySelectorAll('.stat-card').forEach(card => card.classList.remove('active'));
        document.querySelector('[data-stat="posts"]').classList.add('active');
        document.getElementById('contentTitle').innerHTML = '<i class="bi bi-trophy-fill text-warning"></i> Popüler Postlar';
        document.getElementById('searchInput').value = '';
        
        this.displayPosts();
    },

    // Handle search
    handleSearch(searchTerm) {
        if (searchTerm === '') {
            if (this.currentView === 'posts') {
                this.displayPosts();
            } else {
                this.showStatDetail(this.currentView);
            }
            return;
        }

        const filtered = this.enrichedPosts.filter(post => {
            const titleMatch = post.title.toLowerCase().includes(searchTerm);
            const bodyMatch = post.body.toLowerCase().includes(searchTerm);
            const userMatch = post.user && post.user.name.toLowerCase().includes(searchTerm);
            const idMatch = post.id.toString().includes(searchTerm);
            
            return titleMatch || bodyMatch || userMatch || idMatch;
        });

        UI.renderPosts(filtered);
        document.getElementById('postCountBadge').textContent = filtered.length;
    },

    // Open post modal
    openPostModal(postId) {
        const enrichedPost = this.enrichedPosts.find(p => p.id === postId);
        if (!enrichedPost) return;

        const postComments = DataStorage.getCommentsForPost(postId);
        UI.showCommentsModal(enrichedPost, postComments);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
