// ui.js - UI rendering functions

const UI = {
    // Animate numbers
    animateNumber(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.round(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 20);
    },

    // Update stats cards
    updateStats(posts, comments, users) {
        const totalPosts = posts.length;
        const totalComments = comments.length;
        const totalUsers = users.length;
        const avgEngagement = (totalComments / totalPosts).toFixed(1);

        this.animateNumber(document.getElementById('totalPosts'), totalPosts);
        this.animateNumber(document.getElementById('totalComments'), totalComments);
        this.animateNumber(document.getElementById('totalUsers'), totalUsers);
        document.getElementById('avgEngagement').textContent = avgEngagement;
    },

    // Create User Post Chart
    createUserPostChart(posts) {
        const userPostCount = {};
        posts.forEach(post => {
            userPostCount[post.userId] = (userPostCount[post.userId] || 0) + 1;
        });

        const ctx = document.getElementById('userPostChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(userPostCount).map(id => `User ${id}`),
                datasets: [{
                    label: 'Post Sayısı',
                    data: Object.values(userPostCount),
                    backgroundColor: 'rgba(102, 126, 234, 0.8)',
                    borderColor: 'rgba(102, 126, 234, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    },

    // Create Comment Chart
    createCommentChart(comments) {
        const postCommentCount = {};
        comments.forEach(comment => {
            postCommentCount[comment.postId] = (postCommentCount[comment.postId] || 0) + 1;
        });

        const sortedPosts = Object.entries(postCommentCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        const ctx = document.getElementById('commentChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedPosts.map(([id]) => `Post ${id}`),
                datasets: [{
                    label: 'Yorum Sayısı',
                    data: sortedPosts.map(([, count]) => count),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(199, 199, 199, 0.8)',
                        'rgba(83, 102, 255, 0.8)',
                        'rgba(255, 99, 255, 0.8)',
                        'rgba(99, 255, 132, 0.8)'
                    ],
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        borderRadius: 8
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    y: {
                        grid: { display: false }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    },

    // Render posts
    renderPosts(postsArray) {
        const html = postsArray.map((post) => `
            <div class="post-card ${post.isFeatured ? 'featured' : ''}" data-post-id="${post.id}">
                <div class="d-flex align-items-start">
                    <div class="user-avatar me-3">
                        ${post.user ? post.user.name.charAt(0) : 'U'}
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="mb-1">
                                ${post.title}
                                ${post.isFeatured ? '<i class="bi bi-star-fill featured-star"></i>' : ''}
                            </h5>
                            <span class="badge bg-primary badge-custom">
                                <i class="bi bi-chat-fill"></i> ${post.commentCount}
                            </span>
                        </div>
                        <p class="text-muted mb-2">${post.body.substring(0, 120)}...</p>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-secondary me-2">
                                <i class="bi bi-person"></i> ${post.user ? post.user.name : 'Unknown'}
                            </span>
                            <span class="badge bg-info">
                                <i class="bi bi-hash"></i> Post ${post.id}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        document.getElementById('topPostsList').innerHTML = html || '<p class="text-center text-muted">Sonuç bulunamadı.</p>';
    },

    // Render users list
    renderUsers(users, posts) {
        const html = users.map(user => `
            <div class="user-list-item">
                <div class="d-flex align-items-center">
                    <div class="user-list-avatar me-3">
                        ${user.name.charAt(0)}
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${user.name}</h6>
                        <div class="d-flex flex-wrap gap-2">
                            <span class="badge bg-secondary">
                                <i class="bi bi-person-circle"></i> @${user.username}
                            </span>
                            <span class="badge bg-info">
                                <i class="bi bi-envelope"></i> ${user.email}
                            </span>
                            ${user.phone ? `<span class="badge bg-success"><i class="bi bi-telephone"></i> ${user.phone}</span>` : ''}
                            ${user.website ? `<span class="badge bg-warning"><i class="bi bi-globe"></i> ${user.website}</span>` : ''}
                        </div>
                        ${user.company ? `<small class="text-muted mt-1 d-block"><i class="bi bi-building"></i> ${user.company.name}</small>` : ''}
                    </div>
                    <div class="text-end">
                        <span class="badge bg-primary badge-custom">
                            <i class="bi bi-file-post"></i> ${posts.filter(p => p.userId === user.id).length} post
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
        
        document.getElementById('topPostsList').innerHTML = html;
    },

    // Render comments list
    renderComments(comments) {
        const html = comments.slice(0, 50).map(comment => `
            <div class="comment-item">
                <div class="d-flex align-items-start">
                    <div class="comment-avatar me-3">
                        ${comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="flex-grow-1">
                        <div class="comment-name">${comment.name}</div>
                        <div class="comment-email">
                            <i class="bi bi-envelope"></i> ${comment.email}
                        </div>
                        <div class="comment-body">${comment.body}</div>
                        <small class="text-muted"><i class="bi bi-link-45deg"></i> Post ID: ${comment.postId}</small>
                    </div>
                </div>
            </div>
        `).join('');
        
        document.getElementById('topPostsList').innerHTML = html;
    },

    // Show comments modal
    showCommentsModal(post, comments) {
        document.getElementById('modalPostTitle').textContent = post.title;
        document.getElementById('modalPostAuthor').textContent = post.user ? post.user.name : 'Unknown';
        document.getElementById('modalPostBody').textContent = post.body;
        document.getElementById('modalCommentCount').textContent = comments.length;

        const commentsHTML = comments.length > 0 ? comments.map((comment) => `
            <div class="comment-item">
                <div class="d-flex align-items-start">
                    <div class="comment-avatar me-3">
                        ${comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div class="flex-grow-1">
                        <div class="comment-name">${comment.name}</div>
                        <div class="comment-email">
                            <i class="bi bi-envelope"></i> ${comment.email}
                        </div>
                        <div class="comment-body">${comment.body}</div>
                    </div>
                </div>
            </div>
        `).join('') : '<div class="no-comments"><i class="bi bi-chat-dots" style="font-size: 48px;"></i><p class="mt-3">Henüz yorum yapılmamış.</p></div>';

        document.getElementById('commentsContainer').innerHTML = commentsHTML;

        const modal = new bootstrap.Modal(document.getElementById('commentsModal'));
        modal.show();
    },

    // Hide loading overlay
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 500);
    },

    // Show loading overlay
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('hidden');
        overlay.style.opacity = '1';
    }
};
