// Request body interface for adding a question
export interface AddQuestionRequest {
  chat_id: number;
  question: string;
}

// Response interface for the created question & answer
interface AddQuestionResponse {
  id: number;
  chat: number;
  question: string;
  answer: string;
  created_at: string;
}

/**
 * Adds a question to a chat and receives the answer
 * @param data - Object containing chat_id and question string
 * @param token - Optional JWT token (allowed by backend)
 * @returns Promise resolving to the created question and answer response
 */
export async function addQuestion(data: AddQuestionRequest, token?: string): Promise<AddQuestionResponse> {
  const url = 'http://127.0.0.1:8000/api/chat/questions/';

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
    if (response.status === 404) {
      throw new Error('Chat not found.');
    }
    throw new Error(`Failed to add question: ${response.status} ${response.statusText}`);
  }

  const result: AddQuestionResponse = await response.json();
  return result;
}
