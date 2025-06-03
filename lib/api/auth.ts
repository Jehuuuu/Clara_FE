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

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
  };
  tokens?: {
    access: string;
    refresh: string;
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

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  try {
    const res = await fetch(`http://localhost:8000/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.error || "Invalid credentials",
      };
    }

    localStorage.setItem("accessToken", data.tokens.access);
    localStorage.setItem("refreshToken", data.tokens.refresh);

    return {
      success: true,
      message: "Login successful",
      user: data.user,
      tokens: data.tokens,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error or server unavailable",
    };
  }
}
