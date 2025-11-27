// events.js - Event handlers

const Events = {
    // Initialize all event listeners
    init(app) {
        this.app = app;
        this.attachStatCardEvents();
        this.attachFilterEvents();
        this.attachSearchEvents();
        this.attachPostClickEvents();
        this.attachRefreshEvent();
    },

    // Stat card click events
    attachStatCardEvents() {
        document.querySelectorAll('.stat-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const statType = e.currentTarget.dataset.stat;
                this.app.showStatDetail(statType);
            });
        });
    },

    // Filter button events
    attachFilterEvents() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                Events.app.setFilter(filter);
            });
        });
    },

    // Search input events
    attachSearchEvents() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            this.app.handleSearch(searchTerm);
        });
    },

    // Post card click events (delegated)
    attachPostClickEvents() {
        document.getElementById('topPostsList').addEventListener('click', (e) => {
            const postCard = e.target.closest('.post-card');
            if (postCard) {
                const postId = parseInt(postCard.dataset.postId);
                this.app.openPostModal(postId);
            }
        });
    },

    // Refresh button event
    attachRefreshEvent() {
        document.getElementById('refreshBtn').addEventListener('click', () => {
            UI.showLoading();
            setTimeout(() => {
                location.reload();
            }, 500);
        });
    }
};
