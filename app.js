document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------
    // Firebase Visitor Counter Logic
    // -------------------------------------------------------------------------
    
    // TODO: আপনার Firebase প্রজেক্ট থেকে পাওয়া কনফিগারেশন এখানে পেস্ট করুন।
    // এই কোডগুলো আপনার Firebase প্রজেক্টের "Project settings" > "General" ট্যাবে পাবেন।
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        databaseURL: "YOUR_DATABASE_URL",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    // Firebase অ্যাপ ইনিশিয়ালাইজ করুন
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // রেফারেন্স তৈরি করুন
    const totalVisitsRef = database.ref('visits/total');
    const todayVisitsRef = database.ref(`visits/daily/${getTodayDateString()}`);

    // আজকের তারিখ 'YYYY-MM-DD' ফরম্যাটে পাওয়ার জন্য ফাংশন
    function getTodayDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // ভিজিটর কাউন্ট আপডেট করার ফাংশন
    function updateVisitorCount() {
        // মোট ভিজিট সংখ্যা বাড়ান
        totalVisitsRef.transaction(currentValue => {
            return (currentValue || 0) + 1;
        });

        // আজকের ভিজিট সংখ্যা বাড়ান
        todayVisitsRef.transaction(currentValue => {
            return (currentValue || 0) + 1;
        });
    }

    // ডেটাবেস থেকে ভিজিট সংখ্যা নিয়ে প্রদর্শন করুন
    function displayVisitorCount() {
        totalVisitsRef.on('value', (snapshot) => {
            document.getElementById('total-visits').textContent = snapshot.val() || 0;
        });

        todayVisitsRef.on('value', (snapshot) => {
            document.getElementById('visits-today').textContent = snapshot.val() || 0;
        });
    }
    
    // ফাংশনগুলো কল করুন
    updateVisitorCount();
    displayVisitorCount();

    // -------------------------------------------------------------------------
    // Smooth Scrolling & Scroll-to-Top Button
    // -------------------------------------------------------------------------

    // Contact Me বাটনে ক্লিক করলে Contact সেকশনে স্মুথ স্ক্রল
    const contactBtn = document.querySelector('a[href="#contact"]');
    if (contactBtn) {
        contactBtn.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Scroll-to-Top বাটন
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    window.onscroll = function () {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            scrollToTopBtn.style.display = "block";
        } else {
            scrollToTopBtn.style.display = "none";
        }
    };

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // -------------------------------------------------------------------------
    // Scroll Animation Logic
    // -------------------------------------------------------------------------

    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // অ্যানিমেশন একবার দেখানোর পর observe করা বন্ধ করুন
            }
        });
    }, {
        threshold: 0.1 // এলিমেন্টের ১০% দেখা গেলে অ্যানিমেশন শুরু হবে
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

});