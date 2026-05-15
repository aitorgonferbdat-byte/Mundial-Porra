const API_BASE = '/api';

// LocalStorage helpers
const STORAGE_KEYS = {
  USER: 'mundial_porra_user',
  PREDICTIONS: 'mundial_porra_predictions'
};

export const storage = {
  // Save user data to localStorage
  saveUser: (userData) => {
    const userId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const user = { ...userData, userId };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return user;
  },

  // Get saved user
  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  // Save prediction locally
  savePrediction: (predictionData) => {
    localStorage.setItem(STORAGE_KEYS.PREDICTIONS, JSON.stringify({
      ...predictionData,
      createdAt: new Date().toISOString()
    }));
  },

  // Get saved prediction
  getPrediction: () => {
    const data = localStorage.getItem(STORAGE_KEYS.PREDICTIONS);
    return data ? JSON.parse(data) : null;
  },

  // Clear all data
  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PREDICTIONS);
  }
};

export const api = {
  // Send prediction via email (serverless function)
  sendPrediction: async ({ user, matchResults, champion, runnerUp }) => {
    const response = await fetch(`${API_BASE}/send-prediction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, matchResults, champion, runnerUp })
    });
    return response.json();
  }
};
