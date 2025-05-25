// Define the request body interface
interface AddChatRequest {
  politician: string;
  position: string;
}

// Define the response structure
interface AddChatResponse {
  id: number;
  politician: string;
  user: number | null;          // user can be null for unauthenticated chats
  created_at: string;
  research_report: number | null;
  qanda_set: any[];            // You can type more specifically if needed
}

/**
 * Adds a chat by sending politician and position
 * Optionally includes JWT token in Authorization header
 * @param data - Object containing politician and position strings
 * @param token - Optional JWT token for authenticated user
 * @returns Promise resolving to the newly created chat response
 */
export async function addChat(data: AddChatRequest, token?: string): Promise<AddChatResponse> {
  const url = 'http://127.0.0.1:8000/api/chat/chats/';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to add chat: ${response.status} ${response.statusText}`);
  }

  const result: AddChatResponse = await response.json();
  return result;
}

// Define the chat structure based on the API response
export interface Chat {
  id: number;
  politician: string;
  user: number;
  created_at: string;
  research_report: number;
  qanda_set: any[];
}

/**
 * Get all chats for the authenticated user
 * JWT token is required
 * @param token - JWT token string
 * @returns Promise resolving to an array of chats
 */
export async function getAllChats(token: string | null): Promise<Chat[]> {
  const url = 'http://localhost:8000/api/chat/chats/';

  if (!token) {
    throw new Error('Authentication token is required to fetch chats.');
  }
  console.log("Fetching chats with token:", token);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication required or token expired.');
    }
    throw new Error(`Failed to fetch chats: ${response.status} ${response.statusText}`);
  }

  const chats: Chat[] = await response.json();
  return chats;
}
