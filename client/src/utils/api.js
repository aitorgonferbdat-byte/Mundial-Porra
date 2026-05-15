const API_BASE = '/api';

export const api = {
  // User registration
  register: async (userData) => {
    const response = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Submit prediction
  submitPrediction: async (predictionData) => {
    const response = await fetch(`${API_BASE}/predictions/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(predictionData)
    });
    return response.json();
  },

  // Get predictions summary
  getPredictionsSummary: async () => {
    const response = await fetch(`${API_BASE}/predictions/summary`);
    return response.json();
  },

  // Get user prediction
  getUserPrediction: async (userId) => {
    const response = await fetch(`${API_BASE}/predictions/user/${userId}`);
    return response.json();
  }
};
