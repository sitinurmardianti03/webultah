// AUDIO SYSTEM & CONTROLLER
const bgm = document.getElementById('bgm');
const musicStatus = document.getElementById('music-status');
let isMusicPlaying = false;

// Audio Synthesizer (SFX Murni tanpa file tambahan)
function playSound(type) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'click') {
            osc.frequency.setValueAtTime(400, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } else if (type === 'blow') {
            // Suara tiup lilin
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.15);
        }
    } catch (e) {
        // Fallback jika AudioContext tidak didukung
    }
}

function startStoryWithMusic() {
    playSound('click');
    playMusic();
    goToSection('story');
}

function playMusic() {
    if (bgm) {
        bgm.play().then(() => {
            isMusicPlaying = true;
            musicStatus.innerText = "Pause";
        }).catch(err => {
            console.log("Audio autoplay diblokir oleh browser:", err);
        });
    }
}

function toggleMusic() {
    playSound('click');
    if (!bgm) return;

    if (isMusicPlaying) {
        bgm.pause();
        isMusicPlaying = false;
        musicStatus.innerText = "Play";
    } else {
        bgm.play();
        isMusicPlaying = true;
        musicStatus.innerText = "Pause";
    }
}

// 1. LOADING SCREEN PROGRESS
document.addEventListener("DOMContentLoaded", () => {
    let progress = 0;
    const fill = document.getElementById("progress-fill");
    const number = document.getElementById("progress-number");

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById("loading-screen").classList.add("hidden");
                document.getElementById("main-content").classList.remove("hidden");
            }, 500);
        }
        fill.style.width = progress + "%";
        number.innerText = progress + "%";
    }, 150);
});

// 2. NAVIGATION BETWEEN SECTIONS
function goToSection(sectionId) {
    playSound('click');
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if(targetSection) {
        targetSection.classList.add('active');
    }

    if(sectionId === 'surprise') {
        startSurpriseSequence();
    }
}

// 3. POLAROID MODAL
function openModal(imgSrc, caption) {
    playSound('click');
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");

    modal.style.display = "flex";
    modalImg.src = imgSrc;
    modalCaption.innerText = caption;
}

function closeModal() {
    playSound('click');
    document.getElementById("image-modal").style.display = "none";
}

// 4. SPECIAL MESSAGE TYPING EFFECT
const messageText = `Happy Birthday, Lutfi! 🎂🎉

Kalau dipikir-pikir lucu juga gimana awalnya kita bisa kenal.
Aku awalnya cuma nggak sengaja ketemu Jeje di map Cidro Roblox. Terus dari Jeje aku malah dikenalin sama kamu.

Awalnya cuma pertemuan random di game, tapi ternyata dari situ kita bisa jadi teman sampai sekarang.
Mungkin kalau waktu itu aku nggak ketemu Jeje di Cidro, belum tentu kita bakal saling kenal 😂

Jadi di hari ulang tahun kamu ini, aku cuma mau bilang semoga kamu selalu sehat, bahagia, dan semua hal baik datang ke kamu.

Semoga di umur yang baru ini makin banyak pengalaman seru, makin banyak hal yang bisa dibanggakan, dan tentunya makin banyak momen random yang bisa kita ceritain nanti.

Sekali lagi, Happy Birthday, Lutfi! 🎂🎉
Semoga pertemanan random yang awalnya dari Roblox ini bisa terus berlanjut sampai lama.

— Dari temanmu yang awalnya cuma random ketemu Jeje di Cidro 😂❤️`;

let isTyped = false;

function openEnvelope() {
    if(isTyped) return;
    playSound('click');
    
    document.querySelector('.envelope-wrapper').style.display = 'none';
    document.getElementById('typed-message-container').classList.remove('hidden');

    let i = 0;
    const speed = 35;
    const target = document.getElementById("typed-text");

    function typeWriter() {
        if (i < messageText.length) {
            target.innerHTML += messageText.charAt(i) === '\n' ? '<br>' : messageText.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        } else {
            document.getElementById('cake-btn').classList.remove('hidden');
        }
    }
    typeWriter();
    isTyped = true;
}

// 5. CANDLE BLOWING INTERACTION
let candlesBlown = 0;

function blowCandle(candleElement) {
    const flame = candleElement.querySelector('.flame');
    if (!flame.classList.contains('off')) {
        playSound('blow');
        flame.classList.add('off');
        candlesBlown++;

        if (candlesBlown === 3) {
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });

                document.getElementById('wish-status').classList.remove('hidden');
            }, 400);
        }
    }
}

// 6. FINAL SURPRISE SEQUENCE
function startSurpriseSequence() {
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    let delay = 900;

    steps.forEach((stepId, index) => {
        setTimeout(() => {
            document.getElementById(stepId).classList.add('show');
        }, delay * (index + 1));
    });

    setTimeout(() => {
        document.getElementById('surprise-text-sequence').classList.add('hidden');
        document.getElementById('final-reveal').classList.remove('hidden');

        confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.5 }
        });
    }, delay * (steps.length + 1));
}

// 7. REPLAY STORY
function restartStory() {
    playSound('click');
    candlesBlown = 0;
    document.querySelectorAll('.flame').forEach(f => f.classList.remove('off'));
    document.getElementById('wish-status').classList.add('hidden');

    document.getElementById('surprise-text-sequence').classList.remove('hidden');
    document.getElementById('final-reveal').classList.add('hidden');
    const steps = ['step1', 'step2', 'step3', 'step4', 'step5'];
    steps.forEach(stepId => document.getElementById(stepId).classList.remove('show'));

    goToSection('opening');
}