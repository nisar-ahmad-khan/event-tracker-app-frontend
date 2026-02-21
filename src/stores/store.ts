// src/stores/store.ts
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const API_BASE_URL = "http://event-tracker.test";

// ----------------------
// Type Definitions
// ----------------------
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: string | number;
  name: string;
  email: string;
  profile_img: string;
}

export interface AuthResponse {
  success: boolean;
  data: User;
  token?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateAccount: (data: FormData) => Promise<void>;
}

// ----------------------
// Zustand Store
// ----------------------
export const useProfileStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      /* ---------- Register ---------- */
      register: async (data) => {
        set({ loading: true, error: null });

        try {
          const res = await axios.post<AuthResponse>(`${API_BASE_URL}/api/user`, data);

          if (!res.data.success) throw new Error(res.data.message || "Registration failed");

          set({
            user: res.data.data,
            token: res.data.token ?? null,
            loading: false,
          });
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
          const res = await axios.post<AuthResponse>(`${API_BASE_URL}/api/login`, data);

          if (!res.data.success) throw new Error(res.data.message || "Login failed");

          set({
            user: res.data.data,
            token: res.data.token ?? null,
            loading: false,
          });
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

        if (user && token) {
          try {
            await axios.post(
              `${API_BASE_URL}/api/logout/${user.id}`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (err) {
            console.error("Logout API failed", err);
          }
        }

        set({ user: null, token: null });

        // Clear local storage keys safely
        ["auth-store", "organizers-store", "followers-store"].forEach((key) =>
          localStorage.removeItem(key)
        );

        // Redirect to login page
        window.location.href = "/";
      },

      /* ---------- Update Account ---------- */
      updateAccount: async (data) => {
        const { user, token } = get();

        if (!user || !token) {
          alert("No authenticated user found");
          return;
        }

        try {
          const response = await axios.put<AuthResponse>(
            `${API_BASE_URL}/api/update-account/${user.id}`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) {
            set({
              user: response.data.data,
              token: response.data.token ?? token,
            });
          } else {
            console.log(response.data.message || "Update failed");
          }
        } catch (err) {
          console.error(err);
          alert("Update failed. Please try again.");
        }
      },
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);