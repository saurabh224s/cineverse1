// ==========================================
// CINEVERSE - NODE.JS BACKEND SERVER
// ==========================================
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const TMDB_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// Serve static files from the same directory (for Vercel)
app.use(express.static(__dirname));

// ===== TMDB PROXY (hide API key) =====
async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.append('api_key', TMDB_KEY);
  url.searchParams.append('language', 'en-US');
  Object.entries(params).forEach(([k,v]) => url.searchParams.append(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

// ===== ROUTES =====

// Trending
app.get('/api/trending', async (req, res) => {
  try {
    const data = await tmdbFetch('/trending/movie/week', { page: req.query.page || 1 });
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to fetch' }); }
});

// Popular Movies
app.get('/api/movies/popular', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/popular', { page: req.query.page || 1 });
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to fetch' }); }
});

// Top Rated
app.get('/api/movies/top-rated', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/top_rated', { page: req.query.page || 1 });
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to fetch' }); }
});

// Upcoming
app.get('/api/movies/upcoming', async (req, res) => {
  try {
    const data = await tmdbFetch('/movie/upcoming');
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to fetch' }); }
});

// Movie Details
app.get('/api/movies/:id', async (req, res) => {
  try {
    const data = await tmdbFetch(`/movie/${req.params.id}`, {
      append_to_response: 'videos,credits,similar,recommendations'
    });
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to fetch' }); }
});

// TV Shows
app.get('/api/tv/popular', async (req, res) => {
  try {
    const data = await tmdbFetch('/tv/popular', { page: req.query.page || 1 });
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to fetch' }); }
});

app.get('/api/tv/:id', async (req, res) => {
  try {
    const data = await tmdbFetch(`/tv/${req.params.id}`, {
      append_to_response: 'videos,credits,similar'
    });
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to fetch' }); }
});

// Search
app.get('/api/search', async (req, res) => {
  try {
    const data = await tmdbFetch('/search/multi', {
      query: req.query.q,
      page: req.query.page || 1
    });
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to search' }); }
});

// Discover by Genre
app.get('/api/discover', async (req, res) => {
  try {
    const data = await tmdbFetch('/discover/movie', {
      with_genres: req.query.genre,
      sort_by: 'popularity.desc',
      page: req.query.page || 1
    });
    res.json(data);
  } catch { res.status(500).json({ error: 'Failed to fetch' }); }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', version: '1.0.0', name: 'CineVerse API' });
});

// ===== SERVE FRONTEND =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🎬 CineVerse Server running on http://localhost:${PORT}`);
});

module.exports = app;
