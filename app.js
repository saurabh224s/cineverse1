// ==========================================
// CINEVERSE - MAIN APPLICATION
// ==========================================

let heroMovies = [];
let currentHeroIndex = 0;
let heroInterval;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  initParticles();
  initNavbar();
  initMobileMenu();

  // Load all content
  await Promise.all([
    loadHeroSection(),
    loadTrendingMovies(),
    loadTopRatedMovies(),
    loadPopularTV(),
    loadUpcomingMovies(),
    loadCategories(),
    loadLiveChannels(),
    loadLiveTicker()
  ]);

  // Hide loader
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }, 2500);
});

// ===== PARTICLE BACKGROUND (Three.js) =====
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Create stars
  const starGeo = new THREE.BufferGeometry();
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

    const color = Math.random() > 0.8
      ? new THREE.Color(0xe50914)
      : Math.random() > 0.6
        ? new THREE.Color(0x00d2ff)
        : new THREE.Color(0xffffff);
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const starMat = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
  });

  // Animate
  const animate = () => {
    requestAnimationFrame(animate);
    stars.rotation.x += 0.0002;
    stars.rotation.y += 0.0003;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    renderer.render(scene, camera);
  };
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ===== NAVBAR =====
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

// ===== HERO SECTION =====
async function loadHeroSection() {
  const data = await API.getTrending();
  if (!data?.results) return;

  heroMovies = data.results.slice(0, 8);
  const indicators = document.getElementById('heroIndicators');
  if (indicators) {
    indicators.innerHTML = heroMovies.map((_, i) =>
      `<div class="hero-dot ${i === 0 ? 'active' : ''}" onclick="setHero(${i})"></div>`
    ).join('');
  }

  updateHero(0);
  heroInterval = setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroMovies.length;
    updateHero(currentHeroIndex);
  }, 6000);
}

function updateHero(index) {
  const movie = heroMovies[index];
  if (!movie) return;

  const heroBg = document.getElementById('heroBg');
  const heroPoster = document.getElementById('heroPoster');
  const heroTitle = document.getElementById('heroTitle');
  const heroDesc = document.getElementById('heroDesc');
  const heroRating = document.getElementById('heroRating');
  const heroYear = document.getElementById('heroYear');
  const heroGenre = document.getElementById('heroGenre');

  if (heroBg) heroBg.style.backgroundImage = `url(${API.getBackdropUrl(movie.backdrop_path)})`;
  if (heroPoster) heroPoster.src = API.getPosterUrl(movie.poster_path);
  if (heroTitle) heroTitle.textContent = movie.title || movie.name;
  if (heroDesc) heroDesc.textContent = movie.overview || 'No description available.';
  if (heroRating) heroRating.textContent = API.formatRating(movie.vote_average);
  if (heroYear) heroYear.textContent = API.formatYear(movie.release_date || movie.first_air_date);

  // Genre
  const genreId = movie.genre_ids?.[0];
  if (heroGenre && genreId && CONFIG.GENRES[genreId]) {
    heroGenre.textContent = CONFIG.GENRES[genreId].name;
  }

  // Store movie data for buttons
  document.getElementById('heroPlay')?.setAttribute('data-id', movie.id);
  document.getElementById('heroPlay')?.setAttribute('data-type', movie.media_type || 'movie');
  document.getElementById('heroTrailer')?.setAttribute('data-id', movie.id);
  document.getElementById('heroTrailer')?.setAttribute('data-type', movie.media_type || 'movie');

  // Update indicators
  document.querySelectorAll('.hero-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  currentHeroIndex = index;
}

function setHero(index) {
  clearInterval(heroInterval);
  updateHero(index);
  heroInterval = setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroMovies.length;
    updateHero(currentHeroIndex);
  }, 6000);
}

function changeHero(dir) {
  const newIndex = (currentHeroIndex + dir + heroMovies.length) % heroMovies.length;
  setHero(newIndex);
}

function playHero() {
  const btn = document.getElementById('heroPlay');
  const id = btn?.getAttribute('data-id');
  const type = btn?.getAttribute('data-type') || 'movie';
  if (id) window.location.href = `player.html?id=${id}&type=${type}`;
}

async function watchTrailer() {
  const btn = document.getElementById('heroTrailer');
  const id = btn?.getAttribute('data-id');
  const type = btn?.getAttribute('data-type') || 'movie';
  if (!id) return;

  const data = type === 'tv' ? await API.getTVVideos(id) : await API.getMovieVideos(id);
  const key = API.getTrailerKey(data);

  if (key) {
    openTrailerModal(key);
  } else {
    showToast('No trailer available', 'error');
  }
}

function addToWatchlist() {
  const btn = document.getElementById('heroPlay');
  const id = btn?.getAttribute('data-id');
  if (!id) return;

  const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  if (!watchlist.includes(id)) {
    watchlist.push(id);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    showToast('✅ Added to Watchlist!', 'success');
  } else {
    showToast('Already in Watchlist', 'error');
  }
}

// ===== CREATE MOVIE CARD =====
function createMovieCard(item) {
  const title = item.title || item.name || 'Unknown';
  const poster = API.getPosterUrl(item.poster_path);
  const rating = API.formatRating(item.vote_average);
  const year = API.formatYear(item.release_date || item.first_air_date);
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  const genreId = item.genre_ids?.[0];
  const genre = genreId && CONFIG.GENRES[genreId] ? CONFIG.GENRES[genreId].name : '';

  return `
    <div class="swiper-slide">
      <div class="movie-card" onclick="goToPlayer(${item.id}, '${type}')">
        <div class="movie-card-rating-badge"><i class="fas fa-star"></i> ${rating}</div>
        ${year ? `<div class="movie-card-badge">${year}</div>` : ''}
        <img class="movie-card-poster" src="${poster}" alt="${title}" loading="lazy" />
        <div class="movie-card-overlay">
          <div class="movie-card-title">${title}</div>
          <div class="movie-card-meta">
            <span class="movie-card-rating"><i class="fas fa-star"></i> ${rating}</span>
            ${year ? `<span>${year}</span>` : ''}
            ${genre ? `<span>${genre}</span>` : ''}
          </div>
          <div class="movie-card-btns">
            <button class="card-btn-play" onclick="event.stopPropagation(); goToPlayer(${item.id}, '${type}')">
              <i class="fas fa-play"></i> Watch
            </button>
            <button class="card-btn-add" onclick="event.stopPropagation(); quickAddWatchlist(${item.id})">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== LOAD SECTIONS =====
async function loadTrendingMovies() {
  const data = await API.getTrending();
  const container = document.getElementById('trendingMovies');
  if (!data?.results || !container) return;

  container.innerHTML = data.results.map(createMovieCard).join('');
  initSwiper('.trendingSwiper');
}

async function loadTopRatedMovies() {
  const data = await API.getTopRatedMovies();
  const container = document.getElementById('topRatedMovies');
  if (!data?.results || !container) return;

  container.innerHTML = data.results.map(createMovieCard).join('');
  initSwiper('.topRatedSwiper');
}

async function loadPopularTV() {
  const data = await API.getPopularTV();
  const container = document.getElementById('popularTV');
  if (!data?.results || !container) return;

  container.innerHTML = data.results.map(item => createMovieCard({...item, media_type: 'tv'})).join('');
  initSwiper('.tvShowsSwiper');
}

async function loadUpcomingMovies() {
  const data = await API.getUpcomingMovies();
  const container = document.getElementById('upcomingMovies');
  if (!data?.results || !container) return;

  container.innerHTML = data.results.map(item => ({
    ...item,
    media_type: 'movie'
  })).map(createMovieCard).join('');
  initSwiper('.upcomingSwiper');
}

async function loadCategories() {
  const container = document.getElementById('categoriesGrid');
  if (!container) return;

  container.innerHTML = Object.entries(CONFIG.GENRES).map(([id, genre]) => `
    <div class="category-card" style="--cat-color: ${genre.color}"
         onclick="window.location.href='movies.html?genre=${id}'">
      <span class="category-icon">${genre.icon}</span>
      <div class="category-name">${genre.name}</div>
      <div class="category-count">Explore →</div>
    </div>
  `).join('');
}

function loadLiveChannels() {
  const container = document.getElementById('liveChannels');
  if (!container) return;

  container.innerHTML = CONFIG.LIVE_CHANNELS.map(ch => `
    <div class="live-channel-card" onclick="goToLiveTV(${ch.id})">
      <div class="live-channel-thumb" style="background: ${ch.color}20; font-size: 3rem; display:flex; align-items:center; justify-content:center;">
        ${ch.emoji}
        <div class="live-badge"><i class="fas fa-circle"></i> LIVE</div>
      </div>
      <div class="live-channel-info">
        <div class="live-channel-name">${ch.name}</div>
        <div class="live-channel-program">${ch.program}</div>
        <div class="live-channel-viewers"><i class="fas fa-eye"></i> ${ch.viewers} watching</div>
      </div>
    </div>
  `).join('');
}

function loadLiveTicker() {
  const ticker = document.getElementById('tickerContent');
  if (!ticker) return;

  const items = CONFIG.LIVE_CHANNELS.map(ch =>
    `<span><span class="channel-name">📺 ${ch.name}</span> — ${ch.program}</span>`
  ).join('<span style="color:var(--primary);margin:0 1rem">•</span>');
  ticker.innerHTML = items + items; // duplicate for seamless loop
}

// ===== SWIPER INIT =====
function initSwiper(selector) {
  if (typeof Swiper === 'undefined') return;
  new Swiper(selector, {
    slidesPerView: 'auto',
    spaceBetween: 16,
    navigation: {
      nextEl: `${selector} .swiper-button-next`,
      prevEl: `${selector} .swiper-button-prev`,
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 },
      480: { slidesPerView: 3, spaceBetween: 12 },
      768: { slidesPerView: 4, spaceBetween: 14 },
      1024: { slidesPerView: 5, spaceBetween: 16 },
      1280: { slidesPerView: 6, spaceBetween: 16 },
    }
  });
}

// ===== NAVIGATION =====
function goToPlayer(id, type = 'movie') {
  window.location.href = `player.html?id=${id}&type=${type}`;
}

function goToLiveTV(channelId) {
  window.location.href = `player.html?live=${channelId}`;
}

function performSearch() {
  const query = document.getElementById('navSearch')?.value?.trim();
  if (query) window.location.href = `search.html?q=${encodeURIComponent(query)}`;
}

document.getElementById('navSearch')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') performSearch();
});

// ===== MODAL =====
function openTrailerModal(youtubeKey) {
  const modal = document.getElementById('trailerModal');
  const frame = document.getElementById('trailerFrame');
  if (modal && frame) {
    frame.src = `${CONFIG.YOUTUBE_EMBED}${youtubeKey}?autoplay=1&rel=0`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('trailerModal');
  const frame = document.getElementById('trailerFrame');
  if (modal) modal.classList.remove('active');
  if (frame) frame.src = '';
  document.body.style.overflow = '';
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ===== WATCHLIST =====
function quickAddWatchlist(id) {
  const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
  if (!watchlist.includes(String(id))) {
    watchlist.push(String(id));
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    showToast('✅ Added to Watchlist!', 'success');
  } else {
    showToast('Already in Watchlist', 'error');
  }
}

// ===== 3D CARD MOUSE EFFECT =====
document.addEventListener('mousemove', e => {
  const card = document.getElementById('heroCard');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const rotateX = (e.clientY - centerY) / 30;
  const rotateY = (e.clientX - centerX) / 30;
  card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
});
