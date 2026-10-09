document.addEventListener('DOMContentLoaded', function() {

    // --- Live Age Counter ---
    const birthDate = new Date('2004-10-10T00:00:00');
    const countdownElement = document.getElementById('countdown');

    function updateAge() {
        const now = new Date();

        let years = now.getFullYear() - birthDate.getFullYear();
        let months = now.getMonth() - birthDate.getMonth();
        let days = now.getDate() - birthDate.getDate();
        let hours = now.getHours() - birthDate.getHours();
        let minutes = now.getMinutes() - birthDate.getMinutes();
        let seconds = now.getSeconds() - birthDate.getSeconds();

        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) { months += 12; years--; }

        countdownElement.innerHTML = `${years}y ${months}m ${days}d <br> ${hours}h ${minutes}m ${seconds}s`;
    }
    setInterval(updateAge, 1000);
    updateAge();

    // --- Initialize AOS (Animate on Scroll) ---
    AOS.init({
        duration: 800,
        once: true,
    });

    // --- Initialize LightGallery ---
    lightGallery(document.getElementById('lightgallery'), {
        speed: 500,
        download: false
    });

    // --- Hall of Fame Scroller ---
    const scroller = document.getElementById('hall-of-fame-scroller');
    const scrollLeftBtn = document.getElementById('scroll-left-btn');
    const scrollRightBtn = document.getElementById('scroll-right-btn');
    if (scroller && scrollLeftBtn && scrollRightBtn) {
        const card = scroller.querySelector('.snap-center');
        const cardWidth = card.offsetWidth + parseInt(getComputedStyle(card.parentElement).gap);

        scrollRightBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });
        scrollLeftBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });
    }

    // --- Video Uploader ---
    const videoUploadInput = document.getElementById('video-upload');
    const videoPlayer = document.getElementById('video-player');
    const videoUploadLabel = document.getElementById('video-upload-label');

    if (videoUploadInput && videoPlayer && videoUploadLabel) {
        videoUploadLabel.addEventListener('click', () => {
            videoUploadInput.click();
        });

        videoUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const videoURL = URL.createObjectURL(file);
                videoPlayer.src = videoURL;
                videoPlayer.classList.remove('hidden');
                videoUploadLabel.classList.add('hidden');
                videoPlayer.play();
            }
        });
    }


    // --- Falling Stars Animation ---
    // (The canvas keeps the id "sakura-canvas" so your HTML and CSS work unchanged.)
    const canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        const numStars = 50;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function Star() {
            this.reset(true);
        }

        Star.prototype.reset = function(initial) {
            this.x = Math.random() * canvas.width;
            this.y = initial ? Math.random() * canvas.height : -20;
            this.size = 6 + Math.random() * 8;         // outer radius of the star
            this.xSpeed = 0.3 + Math.random() * 0.8;   // gentle sideways drift
            this.ySpeed = 0.8 + Math.random() * 1.2;   // falling speed
            this.rotation = Math.random() * Math.PI;
            this.rotSpeed = (Math.random() - 0.5) * 0.04;
            this.twinkle = Math.random() * Math.PI * 2;
            this.twinkleSpeed = 0.03 + Math.random() * 0.05;
        };

        Star.prototype.draw = function() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(this.twinkle)); // twinkling
            ctx.shadowColor = '#FFE066';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#FFD700';

            // 5-pointed star
            ctx.beginPath();
            for (let i = 0; i < 10; i++) {
                const radius = i % 2 === 0 ? this.size : this.size / 2.5;
                const angle = (Math.PI / 5) * i - Math.PI / 2;
                ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };

        Star.prototype.update = function() {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.rotation += this.rotSpeed;
            this.twinkle += this.twinkleSpeed;

            if (this.y > canvas.height + 20 || this.x > canvas.width + 20) {
                this.reset(false);
            }
            this.draw();
        };

        function createStars() {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                stars.push(new Star());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.update();
            });
            requestAnimationFrame(animate);
        }

        createStars();
        animate();
    }
});