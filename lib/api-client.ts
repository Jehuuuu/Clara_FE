// API base URL - in production, this would come from environment variables
const API_URL = 'http://localhost:8000/api';

// Basic fetch wrapper with error handling
export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Research API (Currently implemented in the backend)
export async function researchPolitician(name: string, params: any = {}) {
  const queryParams = new URLSearchParams();
  
  // Add any additional parameters
  if (params.position) queryParams.append('position', params.position);
  if (params.max_age) queryParams.append('max_age', params.max_age.toString());
  if (params.include_sources) queryParams.append('include_sources', params.include_sources.toString());
  if (params.detailed) queryParams.append('detailed', params.detailed.toString());
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  
  return fetchFromAPI(`/research/${encodeURIComponent(name)}/${queryString}`);
}

// Future API endpoints for candidates, issues, etc.
// These are placeholder functions that will be implemented as the backend API expands

export async function getCandidates() {
  // This will be implemented when the backend has a candidates endpoint
  try {
    return fetchFromAPI('/candidates/');
  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    return [];
  }
}

export async function getCandidate(id: string) {
  // This will be implemented when the backend has a candidate detail endpoint
  try {
    return fetchFromAPI(`/candidates/${id}/`);
  } catch (error) {
    console.error(`Failed to fetch candidate with ID ${id}:`, error);
    return null;
  }
}

export async function getIssues() {
  // This will be implemented when the backend has an issues endpoint
  try {
    return fetchFromAPI('/issues/');
  } catch (error) {
    console.error('Failed to fetch issues:', error);
    return [];
  }
}

export async function getIssue(slug: string) {
  // This will be implemented when the backend has an issue detail endpoint
  try {
    return fetchFromAPI(`/issues/${slug}/`);
  } catch (error) {
    console.error(`Failed to fetch issue with slug ${slug}:`, error);
    return null;
  }
}

export async function getQuizQuestions() {
  // This will be implemented when the backend has a quiz questions endpoint
  try {
    return fetchFromAPI('/quiz/questions/');
  } catch (error) {
    console.error('Failed to fetch quiz questions:', error);
    return [];
  }
} 