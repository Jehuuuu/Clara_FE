// Define the expected response structure
export interface ResearchResponse {
  id: number;
  position: string;
  background: string;
  accomplishments: string;
  criticisms: string;
  summary: string;
  created_at: string;
  updated_at: string;
  metadata: {
    is_fresh: boolean;
    age_days: number;
    request_method: string;
  };
}

// Function 1: Fetch by politician and position
export async function fetchResearchByPoliticianAndPosition(
  politician: string,
  position: string
): Promise<ResearchResponse> {
  const url = `http://127.0.0.1:8000/api/research/${encodeURIComponent(politician)}/?position=${encodeURIComponent(position)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
  }

  const data: ResearchResponse = await response.json();
  return data;
}

// Function 2: Fetch by report ID
export async function fetchResearchById(
  reportId: number,
  includeSources: boolean = false
): Promise<ResearchResponse> {
  const url = `http://127.0.0.1:8000/api/research/report/${reportId}/?include_sources=${includeSources}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch report: ${response.status} ${response.statusText}`);
  }

  const data: ResearchResponse = await response.json();
  return data;
}

// // Example usage
// fetchResearchByPoliticianAndPosition('quiboloy', 'president')
//   .then(data => console.log('By politician & position:', data))
//   .catch(error => console.error('Error:', error));

// fetchResearchById(2, false)
//   .then(data => console.log('By report ID:', data))
//   .catch(error => console.error('Error:', error));
