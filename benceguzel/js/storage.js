// storage.js - Veri saklama ve API işlemleri

const DataStorage = {
    // API Base URL
    API_URL: 'https://jsonplaceholder.typicode.com',
    
    // Data stores
    posts: [],
    comments: [],
    users: [],
    
    // Fetch all data from API
    async fetchAllData() {
        try {
            const [postsRes, commentsRes, usersRes] = await Promise.all([
                fetch(`${this.API_URL}/posts`),
                fetch(`${this.API_URL}/comments`),
                fetch(`${this.API_URL}/users`)
            ]);

            this.posts = await postsRes.json();
            this.comments = await commentsRes.json();
            this.users = await usersRes.json();

            // Add featured post and comments
            this.addFeaturedContent();
            
            return {
                posts: this.posts,
                comments: this.comments,
                users: this.users
            };
        } catch (error) {
            console.error('Veri yüklenirken hata:', error);
            throw error;
        }
    },
    
    // Add featured post and comments
    addFeaturedContent() {
        const featuredPost = {
            userId: 11,
            id: 999,
            title: "🚀 JSONPlaceholder API ile Muhteşem Dashboard Projesi - Tüm Özellikleriyle!",
            body: "Bu proje, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir sosyal medya analiz dashboard'udur. Bootstrap 5, Chart.js ve vanilla JavaScript ile oluşturulmuştur. Gerçek zamanlı veri çekme, interaktif grafikler, animasyonlu kartlar, gelişmiş arama ve filtreleme özellikleri içermektedir. Responsive tasarımı sayesinde tüm cihazlarda mükemmel görünür!"
        };

        const featuredComments = [
            { postId: 999, id: 9991, name: "Muhteşem Çalışma!", email: "ahmet@example.com", body: "Bu dashboard gerçekten harika! Animasyonlar çok smooth ve kullanıcı deneyimi mükemmel. Chart.js entegrasyonu da çok başarılı." },
            { postId: 999, id: 9992, name: "Profesyonel İş", email: "ayse@example.com", body: "Bootstrap kullanımı ve responsive tasarım çok iyi. Modal yapısı ve yorum sistemi de gayet kullanışlı." },
            { postId: 999, id: 9993, name: "Çok Beğendim!", email: "mehmet@example.com", body: "Filtreleme sistemi ve arama özelliği harika çalışıyor. Gradient renkler ve animasyonlar projeye çok güzel bir hava katmış." },
            { postId: 999, id: 9994, name: "Mükemmel Performans", email: "zeynep@example.com", body: "API çağrıları çok hızlı ve verimli yapılmış. Loading animasyonu da kullanıcı deneyimini iyileştirmiş." },
            { postId: 999, id: 9995, name: "Tasarım Harikası", email: "can@example.com", body: "Gradient kullanımı ve hover efektleri çok şık. Özellikle stat kartlarının animasyonları çok etkileyici!" },
            { postId: 999, id: 9996, name: "Kod Kalitesi Yüksek", email: "elif@example.com", body: "JavaScript kodu temiz ve okunabilir. Fonksiyonlar düzgün organize edilmiş ve maintainable bir yapı var." },
            { postId: 999, id: 9997, name: "UX/UI Başarılı", email: "burak@example.com", body: "Kullanıcı arayüzü çok sezgisel. Her şeyin nerede olduğunu kolayca bulabiliyorum. İkonlar da çok uyumlu seçilmiş." },
            { postId: 999, id: 9998, name: "Interaktif ve Eğlenceli", email: "selin@example.com", body: "Post kartlarına tıklayınca açılan modal çok güzel. Yorumların animasyonlu şekilde gelmesi de harika bir detay!" },
            { postId: 999, id: 9999, name: "Eğitici Proje", email: "deniz@example.com", body: "Bu projeyi inceleyerek çok şey öğrendim. API kullanımı, modern JavaScript, ve CSS animasyonları için harika bir örnek." },
            { postId: 999, id: 99910, name: "Detaylara Özen", email: "emre@example.com", body: "Her detay düşünülmüş. Loading spinner'dan tutun da hover efektlerine kadar her şey çok özenli yapılmış. Tebrikler!" },
            { postId: 999, id: 99911, name: "Modern ve Güncel", email: "irem@example.com", body: "Bootstrap 5 ve Chart.js 4 gibi güncel kütüphaneler kullanılmış. Kod modern JavaScript standartlarına uygun." },
            { postId: 999, id: 99912, name: "Kapsamlı Dashboard", email: "onur@example.com", body: "Sadece basit bir dashboard değil, gerçekten kapsamlı bir analiz platformu. İstatistikler, grafikler, arama, filtreleme... Her şey var!" },
            { postId: 999, id: 99913, name: "Mobil Uyumlu", email: "nazli@example.com", body: "Telefonda da mükemmel çalışıyor. Responsive tasarım gerçekten işlevsel, sadece görüntü için değil." },
            { postId: 999, id: 99914, name: "Harika Animasyonlar", email: "berk@example.com", body: "CSS animasyonları çok smooth. Özellikle fadeInUp ve slideDown animasyonları sayfaya çok güzel bir dinamizm katmış." },
            { postId: 999, id: 99915, name: "İlham Verici", email: "gizem@example.com", body: "Kendi projelerim için çok ilham aldım. Özellikle renk paleti ve layout seçimleri çok başarılı. Teşekkürler! 🎉" }
        ];

        const featuredUser = {
            id: 11,
            name: "Dashboard Creator",
            username: "dashmaster",
            email: "creator@dashboard.com",
            phone: "+90 555 123 4567",
            website: "dashboard-creator.com",
            company: { name: "Tech Innovations" }
        };

        this.posts.unshift(featuredPost);
        this.comments.push(...featuredComments);
        this.users.push(featuredUser);
    },
    
    // Get posts with comment counts and user info
    getEnrichedPosts() {
        const postCommentCount = {};
        this.comments.forEach(comment => {
            postCommentCount[comment.postId] = (postCommentCount[comment.postId] || 0) + 1;
        });

        return this.posts.map(post => ({
            ...post,
            commentCount: postCommentCount[post.id] || 0,
            user: this.users.find(u => u.id === post.userId),
            isFeatured: post.id === 999
        })).sort((a, b) => b.commentCount - a.commentCount);
    },
    
    // Get comments for a specific post
    getCommentsForPost(postId) {
        return this.comments.filter(c => c.postId === postId);
    },
    
    // Get post by ID
    getPostById(postId) {
        return this.posts.find(p => p.id === postId);
    }
};
