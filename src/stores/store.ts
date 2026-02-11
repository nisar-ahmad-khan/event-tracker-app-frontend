import axios, { AxiosError } from "axios";
import { create } from "zustand";

const API_BASE_URL = "http://event-tracker.test";


interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface User {
  id: string | number;
  name: string;
  email: string;
}

interface AuthResponse {
  success: boolean;
  data: User;
  token?: string;
  message?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  updateAccount: (data: { name: string; email: string }) => Promise<void>;
}

/* =======================
   Store
======================= */
export const useProfileStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  /* ---------- Initialize Auth ---------- */
  initializeAuth: () => {
    try {
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (user && token) {
        set({
          user: JSON.parse(user),
          token,
        });
      }
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      localStorage.clear();
    }
  },

  /* ---------- Register ---------- */
  register: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post<AuthResponse>(
        `${API_BASE_URL}/api/user`,
        data
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Registration failed");
      }

      set({
        user: res.data.data,
        token: res.data.token || null,
        loading: false,
      });

      localStorage.setItem("user", JSON.stringify(res.data.data));
      if (res.data.token) localStorage.setItem("token", res.data.token);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      set({
        error: e.response?.data?.message || "Registration failed",
        loading: false,
      });
      throw err;
    }
  },

  /* ---------- Login ---------- */
  login: async (data) => {
    set({ loading: true, error: null });

    try {
      const res = await axios.post<AuthResponse>(
        `${API_BASE_URL}/api/login`,
        data
      );

      if (!res.data.success) {
        throw new Error(res.data.message || "Login failed");
      }

      set({
        user: res.data.data,
        token: res.data.token || null,
        loading: false,
      });

      localStorage.setItem("user", JSON.stringify(res.data.data));
      if (res.data.token) localStorage.setItem("token", res.data.token);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      set({
        error: e.response?.data?.message || "Login failed",
        loading: false,
      });
      throw err;
    }
  },

  /* ---------- Logout ---------- */
  logout: async () => {
    const { user, token } = get();

    set({ user: null, token: null });
    localStorage.clear();

    if (user && token) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/logout/${user.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error("Logout API failed", err);
      }
    }

    window.location.href = "/";
  },

  /* ---------- Update Account ---------- */
  updateAccount: async (data) => {
    try {
      const { user, token } = get();

      if (!user || !token) {
        alert("No authenticated user found");
        return;
      }

      const response = await axios.put<AuthResponse>(
        `${API_BASE_URL}/api/update-account/${user.id}`,
        {
          name: data.name,
          email: data.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Credentials successfully updated");
        set({
          user: response.data.data,
          ...(response.data.token && { token: response.data.token }),
        });
        localStorage.setItem("user", JSON.stringify(response.data.data));
        if (response.data.token) localStorage.setItem("token", response.data.token);
      } else {
        alert(response.data.message || "Update failed");
      }
    } catch (err) {
      alert("Update failed. Please try again.");
      console.error(err);
    }
  },
}));
