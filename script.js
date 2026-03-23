// Şarkılar ve sözler (dinamik liste için)
const songs = [
    { id: 0, title: "Neon Lights", artist: "DJ Nova", lyrics: ["Burning neon in the rain,","Chasing shadows through the lane,","Electric hearts, we never slow,","Glowing bright, we steal the show."] },
    { id: 1, title: "Midnight Pulse", artist: "Elektra", lyrics: ["Midnight pulse under moonlit skies,","Synthwave dreams in your eyes,","Lost in the grid, we navigate,","Digital love, it's not too late."] },
    { id: 2, title: "Cyber Dreams", artist: "Synthwave X", lyrics: ["I see the code inside my mind,","A future world for all mankind,","Holograms and chrome delight,","We ride the laser light."] },
    { id: 3, title: "Glitch Heart", artist: "Data Pulse", lyrics: ["Glitch in my heart, error 404,","Your love is what I'm searching for,","Reboot my soul, rewrite the past,","In this matrix, make it last."] }
];

let currentSongIndex = 0;
let syncInterval = null;
let syncActive = false;
let currentLineIndex = 0;

const playlistContainer = document.getElementById('playlistContainer');
const lyricsTextDiv = document.getElementById('lyricsText');
const syncBtn = document.getElementById('syncLyricsBtn');

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    songs.forEach((song, idx) => {
        const item = document.createElement('div');
        item.classList.add('playlist-item');
        if (idx === currentSongIndex) item.classList.add('active');
        item.innerHTML = `
            <div class="song-info">
                <div>${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <i class="fas fa-play-circle play-icon"></i>
        `;
        item.addEventListener('click', () => {
            if (syncInterval) stopSync();
            currentSongIndex = idx;
            renderPlaylist();
            displayLyricsForCurrentSong();
            syncBtn.innerText = "Senkronizasyon Başlat";
            syncActive = false;
            if (syncInterval) clearInterval(syncInterval);
            syncInterval = null;
        });
        playlistContainer.appendChild(item);
    });
}

function displayLyricsForCurrentSong() {
    const song = songs[currentSongIndex];
    const lyricsHtml = song.lyrics.map((line, idx) => `<div class="lyrics-line" data-lineidx="${idx}">${line}</div>`).join('');
    lyricsTextDiv.innerHTML = lyricsHtml;
}

function startLyricsSync() {
    if (syncInterval) clearInterval(syncInterval);
    const lines = document.querySelectorAll('.lyrics-line');
    if (!lines.length) return;
    lines.forEach(l => l.classList.remove('active-sync'));
    currentLineIndex = 0;
    if (lines[currentLineIndex]) lines[currentLineIndex].classList.add('active-sync');

    syncInterval = setInterval(() => {
        const currentLines = document.querySelectorAll('.lyrics-line');
        if (!currentLines.length) { stopSync(); return; }
        if (currentLines[currentLineIndex]) currentLines[currentLineIndex].classList.remove('active-sync');
        currentLineIndex = (currentLineIndex + 1) % currentLines.length;
        if (currentLines[currentLineIndex]) {
            currentLines[currentLineIndex].classList.add('active-sync');
            currentLines[currentLineIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 2800);
    syncActive = true;
    syncBtn.innerText = "Senkronizasyon Durdur";
}

function stopSync() {
    if (syncInterval) clearInterval(syncInterval);
    syncInterval = null;
    syncActive = false;
    syncBtn.innerText = "Senkronizasyon Başlat";
    document.querySelectorAll('.lyrics-line').forEach(l => l.classList.remove('active-sync'));
}

function toggleSync() {
    if (syncActive) stopSync();
    else startLyricsSync();
}

// --- hnfak Chatbot (API yok, akıllı cevaplar) ---
const chatMessagesDiv = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendChatBtn');

function addMessage(sender, text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', isUser ? 'user-msg' : 'bot-msg');
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.innerText = text;
    msgDiv.appendChild(bubble);
    chatMessagesDiv.appendChild(msgDiv);
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
}

function botResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();
    let reply = "";
    if (lowerMsg.includes("merhaba") || lowerMsg.includes("selam")) reply = "Selam! Ben hnfak, tüm platform özelliklerine yardımcı olurum. 🐱";
    else if (lowerMsg.includes("nasılsın")) reply = "Işık hızında çalışıyorum! Size nasıl destek olabilirim?";
    else if (lowerMsg.includes("oyun") || lowerMsg.includes("elden ring")) reply = "Elden Ring genişlemesi için fragmanı butondan izleyebilirsin!";
    else if (lowerMsg.includes("müzik") || lowerMsg.includes("spotify")) reply = "Spotify oynatma listesi sağ üstte hazır! Dinamik çalarımız da şarkı sözü senkronu yapıyor.";
    else if (lowerMsg.includes("tv") || lowerMsg.includes("canlı")) reply = "Canlı TV yayınımız YouTube üzerinden aktif, izleyebilirsin.";
    else if (lowerMsg.includes("sinema") || lowerMsg.includes("film")) reply = "Sinema bölümünde vizyondaki fragmanları bulabilirsin.";
    else reply = "Harika bir soru! Ben hnfak AI'sıyım, panelde gezinerek aradığın her şeyi bulabilirsin. 🚀";
    setTimeout(() => addMessage("hnfak", reply, false), 400);
}

function sendUserMessage() {
    const msg = chatInput.value.trim();
    if (!msg) return;
    addMessage("Siz", msg, true);
    chatInput.value = "";
    botResponse(msg);
}

// --- Diğer interaktiflik ---
document.getElementById('gameDemoBtn').addEventListener('click', () => {
    window.open('https://www.youtube.com/watch?v=K_03kFqWfqs', '_blank');
});

const searchInput = document.getElementById('globalSearch');
searchInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') alert(`Aradığınız: "${searchInput.value}" – içerikler yakında eklenecek.`);
});

// Başlangıç
window.addEventListener('DOMContentLoaded', () => {
    renderPlaylist();
    displayLyricsForCurrentSong();
    syncBtn.addEventListener('click', toggleSync);
    sendBtn.addEventListener('click', sendUserMessage);
    chatInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') sendUserMessage(); });
});
