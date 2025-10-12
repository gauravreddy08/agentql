import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds timeout for scraping
});

export const scrapeWebpage = async (url) => {
  try {
    const response = await api.post('/api/scrape', {
      url
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to scrape webpage');
  }
};

export const fetchData = async (url, schema, preloadedContent = null) => {
  try {
    const response = await api.post('/api/extract', {
      url,
      schema,
      preloaded_content: preloadedContent
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch data');
  }
};

export const generateSchema = async (query) => {
  try {
    const response = await api.post('/api/query', {
      query
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to generate schema');
  }
};

export const getScreenshot = async (url) => {
  try {
    const response = await api.post('/api/screenshot', {
      url
    });
    return response.data.screenshot;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get screenshot');
  }
};

export default api;
