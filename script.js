const tracks = [
  {
    title: 'Midnight Signal',
    artist: 'Astra Nova',
    length: '03:48',
    progressPct: 37,
    tags: ['boost', 'favorite'],
    tagLine: 'Synthwave • Night Run • Neon',
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
    progressPct: 22,
    tags: ['boost'],
    tagLine: 'Pulse Bass • Velocity • Chrome',
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
    progressPct: 41,
    tags: ['calm', 'favorite'],
    tagLine: 'Cat Echo • Dreamwave • Soft Glow',
    lyrics: [
      'Sessizce süzülen kedi gölgesi duvarda',
      'Veri izleri dolaşıyor dijital rüyada',
      'Bir miyav gibi yumuşak ama futuristik',
      'Quantum paws ile ritim hiper gerçeklik'
    ]
  },
  {
    title: 'Solar Drift',
    artist: 'Nova Vale',
    length: '03:20',
    progressPct: 18,
    tags: ['calm'],
    tagLine: 'Ambient • Slow Orbit • Sunset',
    lyrics: [
      'Yavaşça düşen ışıklar günün sonunu örter',
      'Sonsuzluk ekranında sakin frekans belirir',
      'Kalabalık susar, iç ses veriyle birleşir',
      'Solar drift ile sistem huzura erişir'
    ]
  }
];

const features = [
  ['LiveStream Engine', 'online', '22 ms', 'Ultra düşük latency'],
  ['Audio Sync AI', 'standby', '08 ms', 'Gerçek zamanlı lyrics'],
  ['Game Showcase Hub', 'online', '15 ms', 'Etkileşimli launch kartları'],
  ['hnfak Assistant', 'beta', '41 ms', 'Bağlamsal AI cevapları'],
  ['Automation Deck', 'online', '12 ms', 'Task ve rutin yönetimi'],
  ['Command Matrix', 'online', '11 ms', 'Tek tıkla panel senaryoları']
];

const scenes = {
  night: {
    title: 'Cyber City Night Drive',
    description: 'Neon şehir akışını gerçek zamanlı izleyin. Adaptif ışıklar ve panoramik sahneler eşliğinde yayın deneyimi.',
    viewers: '128.4K izleyici',
    channels: '09',
    latency: '22 ms',
    satisfaction: '96%',
    status: 'Auto Mix'
  },
  arena: {
    title: 'Arena Live Championship',
    description: 'E-spor arenasından canlı karşılaşmalar, izleyici tezahüratları ve maç içi veri katmanları.',
    viewers: '302.1K izleyici',
    channels: '14',
    latency: '17 ms',
    satisfaction: '98%',
    status: 'Crowd Sync'
  },
  lounge: {
    title: 'Lo-Fi Lounge Rooftop',
    description: 'Yağmurlu neon terasta sakin müzik, gece manzarası ve ambient yayın akışı.',
    viewers: '88.9K izleyici',
    channels: '06',
    latency: '12 ms',
    satisfaction: '94%',
    status: 'Chill Loop'
  }
};

const state = {
  currentTrack: 0,
  lyricIndex: 0,
  lyricInterval: null,
  isPlaying: true,
  playlistFilter: 'all',
  favorites: new Set(tracks.flatMap((track, index) => (track.tags.includes('favorite') ? [index] : []))),
  tasks: [
    { id: 1, text: 'Ana yayını full-screen moda al', done: true },
    { id: 2, text: 'Boost playlist ile enerji seviyesini yükselt', done: false },
    { id: 3, text: 'hnfak günlük özetini iste', done: false }
  ]
};

const playlistEl = document.getElementById('playlist');
const lyricsEl = document.getElementById('lyrics-lines');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const trackTags = document.getElementById('track-tags');
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
const featureTableBody = document.getElementById('feature-table-body');
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCounter = document.getElementById('task-counter');
const routineNote = document.getElementById('routine-note').querySelector('p');
const commandFeedback = document.getElementById('command-feedback');
const favoriteTrackBtn = document.getElementById('favorite-track-btn');

function formatTimeFromProgress(percent, total) {
  const [minutes, seconds] = total.split(':').map(Number);
  const totalSeconds = minutes * 60 + seconds;
  const currentSeconds = Math.round((percent / 100) * totalSeconds);
  const currentMinutes = String(Math.floor(currentSeconds / 60)).padStart(2, '0');
  const currentRemainder = String(currentSeconds % 60).padStart(2, '0');
  return `${currentMinutes}:${currentRemainder}`;
}

function filteredTracks() {
  return tracks
    .map((track, index) => ({ ...track, index }))
    .filter((track) => {
      if (state.playlistFilter === 'all') return true;
      if (state.playlistFilter === 'favorite') return state.favorites.has(track.index);
      return track.tags.includes(state.playlistFilter);
    });
}

function renderPlaylist() {
  const renderedTracks = filteredTracks();
  playlistEl.innerHTML = renderedTracks.map((track) => `
    <article class="playlist-item ${track.index === state.currentTrack ? 'active' : ''} ${state.favorites.has(track.index) ? 'favorite' : ''}" data-index="${track.index}">
      <div>
        <span>${track.title}</span>
        <span class="track-meta">${track.artist} • ${track.tags.join(' • ')}</span>
      </div>
      <strong>${track.length}</strong>
    </article>
  `).join('');

  playlistEl.querySelectorAll('.playlist-item').forEach((item) => {
    item.addEventListener('click', () => {
      state.currentTrack = Number(item.dataset.index);
      state.lyricIndex = 0;
      renderTrack();
    });
  });
}

function renderTrack() {
  const track = tracks[state.currentTrack];
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  trackTags.textContent = track.tagLine;
  progressBar.style.width = `${track.progressPct}%`;
  progressCurrent.textContent = formatTimeFromProgress(track.progressPct, track.length);
  progressTotal.textContent = track.length;
  lyricTimestamp.textContent = formatTimeFromProgress(track.progressPct, track.length);
  lyricsEl.innerHTML = track.lyrics.map((line, index) => `<p class="lyric-line ${index === state.lyricIndex ? 'active' : ''}">${line}</p>`).join('');
  favoriteTrackBtn.textContent = state.favorites.has(state.currentTrack) ? '★ Favorite' : '☆ Favorite';
  renderPlaylist();
}

function cycleLyrics() {
  clearInterval(state.lyricInterval);
  state.lyricInterval = setInterval(() => {
    if (!state.isPlaying) return;
    state.lyricIndex = (state.lyricIndex + 1) % tracks[state.currentTrack].lyrics.length;
    const track = tracks[state.currentTrack];
    track.progressPct = (track.progressPct + 4) % 100 || 8;
    renderTrack();
  }, 2200);
}

function setPlayingState(nextState) {
  state.isPlaying = nextState;
  playBtn.textContent = state.isPlaying ? '❚❚' : '▶';
  playToggle.style.transform = state.isPlaying ? 'scale(1.02)' : 'scale(.95)';
  playToggle.style.boxShadow = state.isPlaying
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

function buildBotReply(prompt) {
  const lower = prompt.toLowerCase();

  if (lower.includes('izle')) return 'Bugün Arena Live Championship ve ardından Lo-Fi Lounge Rooftop geçişi öneriyorum.';
  if (lower.includes('enerji') || lower.includes('parça')) return 'Velvet Overdrive ve Midnight Signal şu an için en enerjik kombinasyon.';
  if (lower.includes('özet') || lower.includes('dashboard')) {
    return `Kısa özet: ${document.getElementById('viewer-count').textContent}, ${taskCounter.textContent}, aktif parça ${tracks[state.currentTrack].title}.`;
  }
  if (lower.includes('görev')) return 'Öncelikli görevler: boost playlist, AI brief ve wishlist güncellemesi.';

  return `"${prompt}" için önerim: canlı yayın kapsülünü aç, ${tracks[state.currentTrack].title} parçasını dinle ve ardından AI Brief komutunu çalıştır.`;
}

function botReply(prompt) {
  appendMessage(buildBotReply(prompt), 'bot');
}

function renderFeatures() {
  featureTableBody.innerHTML = features.map(([module, status, latency, benefit]) => `
    <tr>
      <td>${module}</td>
      <td><span class="status ${status}">${status === 'online' ? 'Aktif' : status === 'standby' ? 'Optimize' : 'Beta+'}</span></td>
      <td>${latency}</td>
      <td>${benefit}</td>
    </tr>
  `).join('');
}

function renderTasks() {
  taskList.innerHTML = state.tasks.map((task) => `
    <article class="task-item ${task.done ? 'done' : ''}" data-id="${task.id}">
      <label class="task-main">
        <input type="checkbox" ${task.done ? 'checked' : ''} />
        <span>${task.text}</span>
      </label>
      <button class="ghost-btn task-delete" type="button">Sil</button>
    </article>
  `).join('');

  taskList.querySelectorAll('.task-item').forEach((item) => {
    const id = Number(item.dataset.id);
    item.querySelector('input').addEventListener('change', () => {
      const task = state.tasks.find((entry) => entry.id === id);
      task.done = !task.done;
      renderTasks();
    });
    item.querySelector('.task-delete').addEventListener('click', () => {
      state.tasks = state.tasks.filter((entry) => entry.id !== id);
      renderTasks();
    });
  });

  const doneCount = state.tasks.filter((task) => task.done).length;
  taskCounter.textContent = `${doneCount} tamamlandı`;
  routineNote.textContent = doneCount >= 2
    ? 'Harika ilerliyorsun. Şimdi AI Brief ve game hype komutları ile akışı güçlendirebilirsin.'
    : 'Önce canlı yayını başlat, ardından boost playlist ve AI özet akışını aç.';
}

function updateSearchState() {
  const query = searchInput.value.trim().toLowerCase();
  let focusedFound = false;
  sections.forEach((section) => {
    const haystack = `${section.textContent} ${section.dataset.tags || ''}`.toLowerCase();
    const matches = !query || haystack.includes(query);
    section.classList.toggle('dimmed', !matches);
    const shouldFocus = matches && query && !focusedFound;
    section.classList.toggle('focused', shouldFocus);
    if (shouldFocus) focusedFound = true;
  });
}

function focusPanel(selector) {
  document.querySelectorAll('.focused-panel').forEach((element) => element.classList.remove('focused-panel'));
  if (!selector) return;
  const panel = document.querySelector(selector);
  if (panel) {
    panel.classList.add('focused-panel');
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function applyScene(sceneKey) {
  const scene = scenes[sceneKey];
  if (!scene) return;
  document.getElementById('stream-title').textContent = scene.title;
  document.getElementById('stream-description').textContent = scene.description;
  document.getElementById('viewer-count').textContent = scene.viewers;
  document.getElementById('active-channel-count').textContent = scene.channels;
  document.getElementById('latency-indicator').textContent = scene.latency;
  document.getElementById('satisfaction-indicator').textContent = scene.satisfaction;
  document.getElementById('scene-status').textContent = scene.status;
  document.querySelectorAll('.scene-btn').forEach((button) => button.classList.toggle('active', button.dataset.scene === sceneKey));
}

function runCommand(command) {
  const actions = {
    'boost-audio': () => {
      state.playlistFilter = 'boost';
      syncPlaylistFilters();
      focusPanel('.music-panel');
      commandFeedback.textContent = 'Audio Boost aktif';
    },
    'cinema-mode': () => {
      focusPanel('.hero-panel');
      document.body.classList.add('glow-mode');
      commandFeedback.textContent = 'Cinema Mode aktif';
    },
    'sync-lyrics': () => {
      state.lyricIndex = 0;
      tracks[state.currentTrack].progressPct = 10;
      renderTrack();
      commandFeedback.textContent = 'Lyrics senkronlandı';
    },
    'game-hype': () => {
      document.getElementById('game-rating').textContent = '9.9 Meta Pulse';
      document.getElementById('game-players').textContent = '1.4M oyuncu';
      document.getElementById('game-events').textContent = '16 global event';
      document.getElementById('game-bonus').textContent = '+5 XP boost';
      focusPanel('.games-panel');
      commandFeedback.textContent = 'Game Hype aktif';
    },
    'focus-reset': () => {
      focusPanel(null);
      document.body.classList.remove('focus-mode');
      searchInput.value = '';
      updateSearchState();
      commandFeedback.textContent = 'Panel görünümü sıfırlandı';
    },
    'ai-brief': () => {
      botReply('dashboard özeti ver');
      focusPanel('.chatbot-panel');
      commandFeedback.textContent = 'AI brief üretildi';
    }
  };

  if (actions[command]) actions[command]();
}

function syncPlaylistFilters() {
  document.querySelectorAll('.playlist-filter').forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === state.playlistFilter);
  });
  renderPlaylist();
}

searchInput.addEventListener('input', updateSearchState);

pulseSearch.addEventListener('click', () => {
  searchInput.focus();
  document.querySelector('.topbar').animate([
    { boxShadow: '0 20px 60px rgba(0,0,0,.45)' },
    { boxShadow: '0 0 0 1px rgba(255,122,24,.35), 0 0 35px rgba(155,92,255,.25)' },
    { boxShadow: '0 20px 60px rgba(0,0,0,.45)' }
  ], { duration: 900, easing: 'ease-out' });
});

document.getElementById('shuffle-btn').addEventListener('click', () => {
  state.currentTrack = Math.floor(Math.random() * tracks.length);
  state.lyricIndex = 0;
  renderTrack();
});

document.getElementById('prev-btn').addEventListener('click', () => {
  state.currentTrack = (state.currentTrack - 1 + tracks.length) % tracks.length;
  state.lyricIndex = 0;
  renderTrack();
});

document.getElementById('next-btn').addEventListener('click', () => {
  state.currentTrack = (state.currentTrack + 1) % tracks.length;
  state.lyricIndex = 0;
  renderTrack();
});

[playBtn, playToggle].forEach((element) => element.addEventListener('click', () => setPlayingState(!state.isPlaying)));

document.getElementById('favorite-track-btn').addEventListener('click', () => {
  if (state.favorites.has(state.currentTrack)) state.favorites.delete(state.currentTrack);
  else state.favorites.add(state.currentTrack);
  renderTrack();
});

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = chatInput.value.trim();
  if (!value) return;
  appendMessage(value, 'user');
  chatInput.value = '';
  window.setTimeout(() => botReply(value), 400);
});

document.querySelectorAll('.suggestion-btn').forEach((button) => {
  button.addEventListener('click', () => {
    appendMessage(button.textContent, 'user');
    window.setTimeout(() => botReply(button.textContent), 300);
  });
});

document.querySelectorAll('.playlist-filter').forEach((button) => {
  button.addEventListener('click', () => {
    state.playlistFilter = button.dataset.filter;
    syncPlaylistFilters();
  });
});

document.querySelectorAll('.scene-btn').forEach((button) => {
  button.addEventListener('click', () => applyScene(button.dataset.scene));
});

document.querySelectorAll('.command-card').forEach((button) => {
  button.addEventListener('click', () => runCommand(button.dataset.command));
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();
  if (!value) return;
  state.tasks.unshift({ id: Date.now(), text: value, done: false });
  taskInput.value = '';
  renderTasks();
});

document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('glow-mode');
});

document.getElementById('focus-mode').addEventListener('click', () => {
  document.body.classList.toggle('focus-mode');
  focusPanel('.hero-panel');
});

document.getElementById('trailer-btn').addEventListener('click', () => {
  appendMessage('Fragman modunu aç.', 'user');
  window.setTimeout(() => appendMessage('Fragman kuyruğa alındı. Arena Live sonrası otomatik başlatılacak.', 'bot'), 300);
});

document.getElementById('wishlist-btn').addEventListener('click', () => {
  const button = document.getElementById('wishlist-btn');
  button.textContent = button.textContent === 'Wishlist' ? 'Wishlisted ✓' : 'Wishlist';
});

renderFeatures();
renderTrack();
syncPlaylistFilters();
renderTasks();
cycleLyrics();
setPlayingState(true);
applyScene('night');
updateSearchState();
