const tracks = [
  {
    title: 'Midnight Signal',
    artist: 'Astra Nova',
    length: '03:48',
    progress: '01:24',
    progressPct: 37,
    lyrics: [
      'Neon ışıklar altında şehir nefes alıyor',
      'Karanlıkta akan veri yolları parlıyor',
      'Ritim yükselirken kalp senkron oluyor',
      'Midnight signal, beni sonsuza çağırıyor'
    ]
  },
  {
    title: 'Velvet Overdrive',
    artist: 'Kairo Flux',
    length: '04:12',
    progress: '00:56',
    progressPct: 22,
    lyrics: [
      'Gölgeler mor, ufuk çizgisi turuncu',
      'Cam duvarlarda yankılanan düşük uğultu',
      'Her beat ile modüller yeniden doğuyor',
      'Velvet overdrive, sistemi ileri taşıyor'
    ]
  },
  {
    title: 'Quantum Paws',
    artist: 'Luna Circuit',
    length: '02:59',
    progress: '01:08',
    progressPct: 41,
    lyrics: [
      'Sessizce süzülen kedi gölgesi duvarda',
      'Veri izleri dolaşıyor dijital rüyada',
      'Bir miyav gibi yumuşak ama futuristik',
      'Quantum paws ile ritim hiper gerçeklik'
    ]
  }
];

const playlistEl = document.getElementById('playlist');
const lyricsEl = document.getElementById('lyrics-lines');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressBar = document.getElementById('progress-bar');
const progressCurrent = document.getElementById('progress-current');
const progressTotal = document.getElementById('progress-total');
const lyricTimestamp = document.getElementById('lyric-timestamp');
const searchInput = document.getElementById('global-search');
const sections = [...document.querySelectorAll('.searchable')];
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatWindow = document.getElementById('chat-window');
const pulseSearch = document.getElementById('pulse-search');
const playToggle = document.getElementById('play-toggle');
const playBtn = document.getElementById('play-btn');

let currentTrack = 0;
let lyricIndex = 0;
let lyricInterval;
let isPlaying = true;

function renderPlaylist() {
  playlistEl.innerHTML = tracks.map((track, index) => `
    <article class="playlist-item ${index === currentTrack ? 'active' : ''}" data-index="${index}">
      <div>
        <span>${track.title}</span>
        <span class="track-meta">${track.artist}</span>
      </div>
      <strong>${track.length}</strong>
    </article>
  `).join('');

  playlistEl.querySelectorAll('.playlist-item').forEach((item) => {
    item.addEventListener('click', () => {
      currentTrack = Number(item.dataset.index);
      lyricIndex = 0;
      renderTrack();
    });
  });
}

function renderTrack() {
  const track = tracks[currentTrack];
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  progressBar.style.width = `${track.progressPct}%`;
  progressCurrent.textContent = track.progress;
  progressTotal.textContent = track.length;
  lyricTimestamp.textContent = track.progress;
  lyricsEl.innerHTML = track.lyrics.map((line, index) => `<p class="lyric-line ${index === lyricIndex ? 'active' : ''}">${line}</p>`).join('');
  renderPlaylist();
}

function cycleLyrics() {
  clearInterval(lyricInterval);
  lyricInterval = setInterval(() => {
    if (!isPlaying) return;
    lyricIndex = (lyricIndex + 1) % tracks[currentTrack].lyrics.length;
    renderTrack();
  }, 2200);
}

function setPlayingState(nextState) {
  isPlaying = nextState;
  playBtn.textContent = isPlaying ? '❚❚' : '▶';
  playToggle.style.transform = isPlaying ? 'scale(1.02)' : 'scale(.95)';
  playToggle.style.boxShadow = isPlaying
    ? '0 0 50px rgba(155,92,255,.24)'
    : '0 0 25px rgba(255,122,24,.18)';
}

function appendMessage(text, author = 'user') {
  const article = document.createElement('article');
  article.className = `message ${author}`;
  article.innerHTML = `
    <span class="avatar">${author === 'bot' ? 'h' : 'u'}</span>
    <div>
      <p class="message-author">${author === 'bot' ? 'hnfak' : 'Kullanıcı'}</p>
      <p>${text}</p>
    </div>
  `;
  chatWindow.appendChild(article);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function botReply(prompt) {
  const responses = [
    `"${prompt}" için önerim: Live TV kapsülünü tam ekran açıp ardından Quantum Paws parçasına geçiş yapman.`,
    `Aradığın deneyime göre oyun vitrini ve lyrics senkron panelini eşzamanlı kullanabilirsin.`,
    `hnfak analizi: Şu an en iyi kombinasyon neon turuncu tema + düşük gecikmeli yayın + shuffle modu.`
  ];
  appendMessage(responses[Math.floor(Math.random() * responses.length)], 'bot');
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  let focusedFound = false;
  sections.forEach((section) => {
    const haystack = `${section.textContent} ${section.dataset.tags || ''}`.toLowerCase();
    const matches = !query || haystack.includes(query);
    section.classList.toggle('dimmed', !matches);
    section.classList.toggle('focused', matches && query && !focusedFound);
    if (matches && query && !focusedFound) focusedFound = true;
    else section.classList.remove('focused');
  });
});

pulseSearch.addEventListener('click', () => {
  searchInput.focus();
  document.querySelector('.topbar').animate([
    { boxShadow: '0 20px 60px rgba(0,0,0,.45)' },
    { boxShadow: '0 0 0 1px rgba(255,122,24,.35), 0 0 35px rgba(155,92,255,.25)' },
    { boxShadow: '0 20px 60px rgba(0,0,0,.45)' }
  ], { duration: 900, easing: 'ease-out' });
});

document.getElementById('shuffle-btn').addEventListener('click', () => {
  currentTrack = Math.floor(Math.random() * tracks.length);
  lyricIndex = 0;
  renderTrack();
});

document.getElementById('prev-btn').addEventListener('click', () => {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  lyricIndex = 0;
  renderTrack();
});

document.getElementById('next-btn').addEventListener('click', () => {
  currentTrack = (currentTrack + 1) % tracks.length;
  lyricIndex = 0;
  renderTrack();
});

[playBtn, playToggle].forEach((el) => el.addEventListener('click', () => setPlayingState(!isPlaying)));

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  appendMessage(value, 'user');
  chatInput.value = '';
  window.setTimeout(() => botReply(value), 500);
});

renderTrack();
cycleLyrics();
setPlayingState(true);
