// ==========================================
// CINEVERSE CONFIGURATION
// Get FREE API key at: https://www.themoviedb.org/settings/api
// ==========================================

const CONFIG = {
  // 👇 REPLACE WITH YOUR FREE TMDB API KEY
  TMDB_API_KEY: 'YOUR_TMDB_API_KEY_HERE',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p/',
  TMDB_BACKDROP_BASE: 'https://image.tmdb.org/t/p/original',
  POSTER_SIZE: 'w500',
  BACKDROP_SIZE: 'original',
  YOUTUBE_EMBED: 'https://www.youtube.com/embed/',

  // Genre IDs from TMDB
  GENRES: {
    28: { name: 'Action', icon: '💥', color: '#e50914' },
    35: { name: 'Comedy', icon: '😂', color: '#f5a623' },
    18: { name: 'Drama', icon: '🎭', color: '#9b59b6' },
    27: { name: 'Horror', icon: '👻', color: '#1a1a2e' },
    878: { name: 'Sci-Fi', icon: '🚀', color: '#00d2ff' },
    10749: { name: 'Romance', icon: '💕', color: '#ff6b9d' },
    16: { name: 'Animation', icon: '🎨', color: '#22c55e' },
    12: { name: 'Adventure', icon: '🗺️', color: '#f59e0b' },
    53: { name: 'Thriller', icon: '🔪', color: '#dc2626' },
    80: { name: 'Crime', icon: '🔫', color: '#374151' },
    10751: { name: 'Family', icon: '👨‍👩‍👧', color: '#10b981' },
    14: { name: 'Fantasy', icon: '🧙', color: '#8b5cf6' }
  },

  // Live TV Channels (demo - replace with real stream URLs)
  LIVE_CHANNELS: [
    { id: 1, name: 'BBC News', program: 'World News Tonight', viewers: '1.2M', emoji: '🇬🇧', streamUrl: 'https://www.youtube.com/embed/live_stream?channel=UCCjyq_K1Pd2HkXdmHy-MHqQ', color: '#e50914' },
    { id: 2, name: 'CNN', program: 'Breaking News', viewers: '890K', emoji: '📺', streamUrl: 'https://www.youtube.com/embed/live_stream?channel=UCupvZG-5ko_eiXAupbDfxWw', color: '#cc0000' },
    { id: 3, name: 'ESPN', program: 'SportsCenter', viewers: '2.1M', emoji: '⚽', streamUrl: '#', color: '#e05c00' },
    { id: 4, name: 'Discovery', program: 'Wild Planet', viewers: '650K', emoji: '🌍', streamUrl: '#', color: '#0066cc' },
    { id: 5, name: 'National Geo', program: 'Space Documentary', viewers: '430K', emoji: '🌌', streamUrl: '#', color: '#ffd700' },
    { id: 6, name: 'MTV', program: 'Top 40 Countdown', viewers: '1.5M', emoji: '🎵', streamUrl: '#', color: '#00ff88' },
    { id: 7, name: 'Cartoon Network', program: 'Tom & Jerry', viewers: '3.2M', emoji: '🐱', streamUrl: '#', color: '#ff4d00' },
    { id: 8, name: 'HBO', program: 'Premium Movies', viewers: '2.8M', emoji: '🎬', streamUrl: '#', color: '#00a8e0' }
  ]
};
