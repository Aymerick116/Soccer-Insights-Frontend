/** API client for backend endpoints */
import type {
  DashboardInsights,
  Fixture,
  TeamInsights,
  Competition,
  DashboardResponse,
  MatchPreviewResponse,
} from '../types/api';

const API_BASE_URL = 'http://localhost:8000';

async function fetchAPI<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      // Try to get error message from response body
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch {
        // If response is not JSON, use status text
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    // Handle CORS and network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the backend. Please ensure the backend is running on http://localhost:8000');
    }
    // Re-throw other errors
    throw error;
  }
}

export const api = {
  /** Get dashboard data for a specific date */
  getDashboard: (date: string): Promise<DashboardResponse> => {
    return fetchAPI<DashboardResponse>(`/api/dashboard?date=${date}`);
  },

  /** Get dashboard insights (legacy) */
  getDashboardInsights: (): Promise<DashboardInsights> => {
    return fetchAPI<DashboardInsights>('/api/dashboard');
  },

  /** Get match preview by ID */
  getMatchPreview: (matchId: string | number, last: number = 5): Promise<MatchPreviewResponse> => {
    return fetchAPI<MatchPreviewResponse>(`/api/matches/${matchId}/preview?last=${last}`);
  },

  /** Get team insights by ID */
  getTeamInsights: (teamId: number): Promise<TeamInsights> => {
    return fetchAPI<TeamInsights>(`/api/teams/${teamId}/insights`);
  },

  /** Get all competitions */
  getCompetitions: (): Promise<Competition[]> => {
    return fetchAPI<Competition[]>('/api/competitions');
  },
};

