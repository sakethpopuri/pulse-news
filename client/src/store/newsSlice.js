import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchNews = createAsyncThunk('news/fetch', async ({ category = 'all', page = 1 } = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/news', { params: { category, page, limit: 20 } });
    return { ...data, category, page };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch news');
  }
});

export const fetchMoreNews = createAsyncThunk('news/fetchMore', async ({ category = 'all', page } = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/news', { params: { category, page, limit: 20 } });
    return { ...data, category, page };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load more');
  }
});

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    currentCategory: 'all',
    page: 1,
    hasMore: true,
    loading: false,
    loadingMore: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
      state.articles = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNews.fulfilled, (s, a) => {
        s.loading = false;
        s.articles = a.payload.articles;
        s.hasMore = a.payload.hasMore;
        s.page = a.payload.page;
        s.lastFetched = Date.now();
      })
      .addCase(fetchNews.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchMoreNews.pending, (s) => { s.loadingMore = true; })
      .addCase(fetchMoreNews.fulfilled, (s, a) => {
        s.loadingMore = false;
        s.articles = [...s.articles, ...a.payload.articles];
        s.hasMore = a.payload.hasMore;
        s.page = a.payload.page;
      })
      .addCase(fetchMoreNews.rejected, (s) => { s.loadingMore = false; });
  },
});

export const { setCategory } = newsSlice.actions;
export default newsSlice.reducer;
