/**
 * Centralized API Service for SmartRoom AI
 * Connects to the Flask Backend via VITE_API_BASE_URL
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Generic fetch wrapper with cache-busting, timeout, and robust error extraction
 */
async function request(endpoint, options = {}) {
  if (USE_MOCK) {
    return handleMockRequest(endpoint, options);
  }

  // Prevent browser caching on GET requests by adding a timestamp query param
  const isGet = !options.method || options.method === 'GET';
  const separator = endpoint.includes('?') ? '&' : '?';
  const endpointWithCacheBust = isGet ? `${endpoint}${separator}_t=${Date.now()}` : endpoint;
  const url = `${API_BASE_URL}${endpointWithCacheBust}`;

  const controller = new AbortController();
  // Allow sufficient time for ThingSpeak fetch (Flask timeout is 10s)
  const timeoutId = setTimeout(() => controller.abort(), 25000);

  try {
    const headers = {
      ...(isGet ? {} : { 'Content-Type': 'application/json' }),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      ...(options.headers || {}),
    };

    const res = await fetch(url, {
      ...options,
      cache: 'no-store',
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // fallback to status text
      }
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Connection timed out. Backend may be offline or unreachable.');
    }
    throw err;
  }
}

/**
 * Check backend health status
 * GET /api/health
 */
export async function getHealth() {
  return request('/api/health');
}

/**
 * Fetch latest live ThingSpeak sensor data & Voting Ensemble prediction
 * GET /api/live
 */
export async function getLiveData() {
  return request('/api/live');
}

/**
 * Submit manual sensor readings for occupancy inference
 * POST /api/predict
 */
export async function predictOccupancy(sensorValues) {
  return request('/api/predict', {
    method: 'POST',
    body: JSON.stringify({
      temperature: parseFloat(sensorValues.temperature),
      humidity: parseFloat(sensorValues.humidity),
      co2: parseFloat(sensorValues.co2),
      light: parseFloat(sensorValues.light),
    }),
  });
}

/**
 * Retrieve comparative evaluation metrics for all trained models
 * GET /api/metrics
 */
export async function getMetrics() {
  return request('/api/metrics');
}

/**
 * Retrieve logged prediction history
 * GET /api/history
 */
export async function getHistory() {
  return request('/api/history');
}

export { API_BASE_URL, USE_MOCK };

// =========================================================================
// MOCK HANDLER (Active ONLY when VITE_USE_MOCK=true for isolated local test)
// =========================================================================
function handleMockRequest(endpoint, options) {
  console.warn(`[SmartRoom AI] Serving Mock Data for ${endpoint}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (endpoint === '/api/health') {
        resolve({ status: 'online', message: 'Smart Room backend is running (Mock)' });
      } else if (endpoint === '/api/live') {
        const now = new Date().toISOString();
        resolve({
          prediction: {
            confidence: 88.5,
            model: 'Voting Ensemble (Mock)',
            occupancy: 'Unoccupied',
            recommendation: 'Energy-saving mode recommended',
          },
          sensor_data: {
            co2: 460.0,
            entry_id: Math.floor(Date.now() / 15000),
            humidity: 58.5,
            light: 45.0,
            temperature: 24.2,
            timestamp: now,
          },
        });
      } else if (endpoint === '/api/predict') {
        const body = JSON.parse(options.body || '{}');
        const isOccupied = body.light > 100 || body.co2 > 600;
        resolve({
          occupancy: isOccupied ? 'Occupied' : 'Unoccupied',
          confidence: 91.4,
          model: 'Voting Ensemble (Mock)',
          recommendation: isOccupied
            ? 'Normal operation recommended'
            : 'Energy-saving mode recommended',
        });
      } else if (endpoint === '/api/metrics') {
        resolve([
          { Model: 'Logistic Regression', Accuracy: 0.9778, Precision: 0.9471, Recall: 0.9948, 'F1-Score': 0.9704, 'ROC-AUC': 0.9916 },
          { Model: 'KNN', Accuracy: 0.9328, Precision: 0.9670, Recall: 0.8446, 'F1-Score': 0.9017, 'ROC-AUC': 0.9895 },
          { Model: 'Decision Tree', Accuracy: 0.9782, Precision: 0.9480, Recall: 0.9948, 'F1-Score': 0.9708, 'ROC-AUC': 0.9822 },
          { Model: 'SVM', Accuracy: 0.9786, Precision: 0.9472, Recall: 0.9969, 'F1-Score': 0.9714, 'ROC-AUC': 0.9910 },
          { Model: 'Voting Ensemble', Accuracy: 0.9786, Precision: 0.9472, Recall: 0.9969, 'F1-Score': 0.9714, 'ROC-AUC': 0.9903 },
        ]);
      } else if (endpoint === '/api/history') {
        resolve([]);
      } else {
        reject(new Error(`Not Found: ${endpoint}`));
      }
    }, 300);
  });
}
