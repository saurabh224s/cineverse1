// ==========================================
// CINEVERSE - API INTEGRATION (BACKEND PROXY)
// ==========================================

class MovieAPI {
  constructor() {
    this.base = '/api';  // Use backend proxy instead of direct TMDB
    this.imgBase = CONFIG.TMDB_IMAGE_BASE;
  }

  async fetch(endpoint, params = {}) {
    try {
      let url = `${this.base}${endpoint}`;
      
      // Add query parameters
      const queryString = new URLSearchParams(params).toString();
      if (queryString) url += `?${queryString}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('API Fetch Error:', err);
      return null;
    }
  }

  // Movies
  async getTrending(page = 1) {
    return this.fetch('/trending', { page });
  }
  async getPopularMovies(page = 1) {
    return this.fetch('/movies/popular', { page });
  }
  async getTopRatedMovies(page = 1) {
    return this.fetch('/movies/top-rated', { page });
  }
  async getUpcomingMovies(page = 1) {
    return this.fetch('/movies/upcoming');
  }
  async getNowPlayingMovies(page = 1) {
    return this.fetch('/movies/now_playing', { page });
  }
  async getMovieDetails(id) {
    return this.fetch(`/movies/${id}`);
  }
  async getMovieVideos(id) {
    return this.fetch(`/movies/${id}`);  // Backend returns videos in append_to_response
  }
  async searchMovies(query, page = 1) {
    return this.fetch('/search', { q: query, page });
  }
  async getMoviesByGenre(genreId, page = 1) {
    return this.fetch('/discover', { genre: genreId, page });
  }

  // TV Shows
  async getPopularTV(page = 1) {
    return this.fetch('/tv/popular', { page });
  }
  async getTopRatedTV(page = 1) {
    return this.fetch('/tv/top_rated', { page });
  }
  async getOnAirTV(page = 1) {
    return this.fetch('/tv/on_the_air', { page });
  }
  async getTVDetails(id) {
    return this.fetch(`/tv/${id}`);
  }
  async getTVVideos(id) {
    return this.fetch(`/tv/${id}`);  // Backend returns videos in append_to_response
  }

  // Images
  getPosterUrl(path, size = 'w500') {
    if (!path) return 'https://via.placeholder.com/300x450/1a1a2e/ffffff?text=No+Image';
    return `${this.imgBase}${size}${path}`;
  }
  getBackdropUrl(path) {
    if (!path) return '';
    return `${this.imgBase}original${path}`;
  }

  // Get YouTube trailer key
  getTrailerKey(videos) {
    if (!videos?.results?.length) return null;
    const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube')
      || videos.results.find(v => v.site === 'YouTube');
    return trailer?.key || null;
  }

  // Format runtime
  formatRuntime(minutes) {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  // Format date
  formatYear(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).getFullYear();
  }

  // Star rating
  formatRating(rating) {
    if (!rating) return '0.0';
    return rating.toFixed(1);
  }
}

const API = new MovieAPI();
