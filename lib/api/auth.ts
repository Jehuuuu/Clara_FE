// lib/api/auth.ts

interface RegisterPayload {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  const res = await fetch("http://localhost:8000/api/auth/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMsg = data?.error || Object.values(data)[0]?.[0] || "Registration failed";
    throw new Error(errorMsg);
  }

  return data;
}
