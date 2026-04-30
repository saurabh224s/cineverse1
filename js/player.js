// ==========================================
// CINEVERSE - VIDEO PLAYER
// ==========================================

const params = new URLSearchParams(window.location.search);
const movieId = params.get('id');
const mediaType = params.get('type') || 'movie';
const liveChannel = params.get('live');

let currentMovieData = null;
let trailerKey = null;

// Embed servers
const EMBED_SERVERS = [
  {
    name: '🎬 Server 1',
    getUrl: (id, type) => type === 'tv'
      ? `https://vidsrc.to/embed/tv/${id}`
      : `https://vidsrc.to/embed/movie/${id}`
  },
  {
    name: '📺 Server 2',
    getUrl: (id, type) => type === 'tv'
      ? `https://2embed.org/embed/tv?id=${id}`
      : `https://2embed.org/embed/movie?id=${id}`
  },
  {
    name: '🚀 Server 3',
    getUrl: (id, type) => type === 'tv'
      ? `https://www.2embed.cc/embedtv/${id}`
      : `https://www.2embed.cc/embed/${id}`
  },
  {
    name: '🎭 Trailer',
    getUrl: (id, type) => trailerKey
      ? `${CONFIG.YOUTUBE_EMBED}${trailerKey}?autoplay=1`
      : null
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  if (liveChannel) {
    loadLiveTVChannel(parseInt(liveChannel));
  } else if (movieId) {
    await loadMovie();
  }
  initNavbar();
  initMobileMenu();
});

async function loadMovie() {
  const data = mediaType === 'tv'
    ? await API.getTVDetails(movieId)
    : await API.getMovieDetails(movieId);

  if (!data) {
    showError();
    return;
  }

  currentMovieData = data;
  document.title = `${data.title || data.name} - CineVerse`;

  // Get trailer
  trailerKey = API.getTrailerKey(data.videos);

  // Update UI
  document.getElementById('playerTitle').textContent = data.title || data.name;
  document.getElementById('playerRating').textContent = API.formatRating(data.vote_average);
  document.getElementById('playerYear').textContent = API.formatYear(data.release_date || data.first_air_date);
  document.getElementById('playerRuntime').textContent = API.formatRuntime(data.runtime);
  document.getElementById('playerDesc').textContent = data.overview || 'No description available.';

  // Genres
  if (data.genres) {
    document.getElementById('playerGenres').innerHTML = data.genres.slice(0, 3)
      .map(g => `<span style="background:var(--glass);border:1px solid var(--glass-border);padding:0.2rem 0.6rem;border-radius:6px;font-size:0.8rem">${g.name}</span>`)
      .join(' ');
  }

  // Server tabs
  buildServerTabs();

  // Load first server
  loadServer(0);

  // Related movies
  loadRelated(data);

  // Show content
  document.getElementById('loadingPlayer').style.display = 'none';
  document.getElementById('playerContent').style.display = 'block';
}

function buildServerTabs() {
  const container = document.getElementById('serverTabs');
  if (!container) return;

  container.innerHTML = EMBED_SERVERS.map((server, i) => `
    <button class="server-tab ${i === 0 ? 'active' : ''}"
            onclick="loadServer(${i})" id="tab-${i}">
      ${server.name}
    </button>
  `).join('');
}

function loadServer(index) {
  const server = EMBED_SERVERS[index];
  const url = server.getUrl(movieId, mediaType);

  document.querySelectorAll('.server-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
  });

  const player = document.getElementById('mainPlayer');
  if (player) {
    player.src = url || `${CONFIG.YOUTUBE_EMBED}${trailerKey}?autoplay=1`;
  }

  showToast(`Playing on ${server.name}`, 'success');
}

function loadLiveTVChannel(channelId) {
  const channel = CONFIG.LIVE_CHANNELS.find(c => c.id === channelId);
  if (!channel) { showError(); return; }

  document.title = `${channel.name} - Live TV - CineVerse`;
  document.getElementById('loadingPlayer').style.display = 'none';
  document.getElementById('playerContent').style.display = 'block';

  document.getElementById('playerTitle').textContent = `📺 ${channel.name} — LIVE`;
  document.getElementById('playerDesc').textContent = `Currently playing: ${channel.program}`;
  document.getElementById('playerYear').textContent = 'LIVE';

  const player = document.getElementById('mainPlayer');
  if (player) player.src = channel.streamUrl;

  // Live server tabs
  const container = document.getElementById('serverTabs');
  if (container) {
    container.innerHTML = CONFIG.LIVE_CHANNELS.map((ch, i) => `
      <button class="server-tab ${ch.id === channelId ? 'active' : ''}"
              onclick="switchLiveChannel(${ch.id})">
        ${ch.emoji} ${ch.name}
      </button>
    `).join('');
  }
}

function switchLiveChannel(id) {
  window.location.href = `player.html?live=${id}`;
}

function loadRelated(data) {
  const related = data.similar?.results || data.recommendations?.results || [];
  const container = document.getElementById('relatedList');
  if (!container) return;

  container.innerHTML = related.slice(0, 10).map(item => `
    <div class="related-card" onclick="window.location.href='player.html?id=${item.id}&type=${mediaType}'">
      <img src="${API.getPosterUrl(item.poster_path, 'w200')}"
           alt="${item.title || item.name}"
           onerror="this.src='https://via.placeholder.com/90x60/1a1a2e/fff?text=No+Image'" />
      <div class="related-info">
        <div class="related-title">${item.title || item.name}</div>
        <div class="related-meta">
          <span class="related-rating"><i class="fas fa-star"></i> ${API.formatRating(item.vote_average)}</span>
          ${item.release_date ? ` • ${API.formatYear(item.release_date)}` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function showError() {
  document.getElementById('loadingPlayer').innerHTML = `
    <div style="text-align:center;padding:4rem">
      <i class="fas fa-exclamation-triangle" style="color:var(--primary);font-size:3rem;"></i>
      <h2 style="margin:1rem 0">Content Not Found</h2>
      <p style="color:var(--text-muted);margin-bottom:2rem">The requested content could not be loaded.</p>
      <a href="index.html" class="btn-glow">← Back to Home</a>
    </div>
  `;
}

function addToWatchlist() {
  if (!movieId) return;
  const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  if (!watchlist.includes(movieId)) {
    watchlist.push(movieId);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    showToast('✅ Added to Watchlist!', 'success');
  } else {
    showToast('Already in Watchlist', 'error');
  }
}

function shareMovie() {
  if (navigator.share) {
    navigator.share({
      title: currentMovieData?.title || currentMovieData?.name,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('🔗 Link copied to clipboard!', 'success');
  }
}

function downloadMovie() {
  showToast('⬇️ Download started...', 'success');
}

function postComment() {
  const input = document.getElementById('commentInput');
  const list = document.getElementById('commentsList');
  if (!input?.value.trim()) return;

  const comment = document.createElement('div');
  comment.className = 'comment-item';
  comment.innerHTML = `
    <div class="comment-author">You</div>
    <div class="comment-text">${input.value}</div>
  `;
  list.prepend(comment);
  input.value = '';
  showToast('💬 Comment posted!', 'success');
}

// Reuse from app.js
function initNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
}
function performSearch() {
  const query = document.getElementById('navSearch')?.value?.trim();
  if (query) window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}
