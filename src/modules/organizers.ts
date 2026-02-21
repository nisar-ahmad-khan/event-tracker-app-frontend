import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "./api";
import { useProfileStore } from "../stores/store";

export interface RegisteredOrganizers {
  id: number;
  user_id: number;
  phone_number: number;
  description: string;
  url: string;
  email: string;
  profile_img: string;
  created_at: string;
  updated_at: string;
  user?: { id: number; name: string; email: string; profile_img?: string };
}

export interface OrgEvent {
  id: number;
  organizer_id: number;
  title: string;
  location: string;
  image: string;
  url?: string | null;
  description: string;
  category: string;
  starting_date_and_time: string;
  ending_date_and_time: string;
  is_free?: string | number;
  ticket_price: number;
  tickets_sold: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizerState {
  orgs: RegisteredOrganizers[];
  meAsAnOrg: RegisteredOrganizers | null;
  loading: boolean;
  myEvents: OrgEvent[];
  register: (payload: { phone: string; description: string; website: string }) => Promise<void>;
  fetchOrganizers: () => Promise<void>;
  createEvent: (formData: FormData) => Promise<void>;
  fetchMyOrgAcc: () => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  deleteEvent: (eventId: number | string) => Promise<void>;
}

export const useOrganizerStore = create<OrganizerState>()(
  persist(
    (set, get) => ({
      orgs: [],
      meAsAnOrg: null,
      loading: false,
      myEvents: [],

      register: async (payload) => {
        set({ loading: true });
        try {
          const { user, token } = useProfileStore.getState();
          if (!user?.id || !user?.email) throw new Error("User not logged in");
          const res = await axios.post(`${API_BASE_URL}/api/reg-as-organizer/${user.id}`, {
            phone_number: payload.phone,
            description: payload.description,
            url: payload.website,
            email: user.email,
          }, { headers: { Authorization: `Bearer ${token}` } });
          if (!res.data.success) throw new Error(res.data.message);
          set({ meAsAnOrg: { ...res.data.created, user } });
        } catch (err: any) {
          console.error(err.message);
          throw new Error(err.response?.data?.message || "Organizer registration failed");
        } finally {
          set({ loading: false });
        }
      },

      fetchMyOrgAcc: async () => {
        try {
          const { user } = useProfileStore.getState();
          if (!user?.email) return;
          const response = await axios.get(`${API_BASE_URL}/api/me-as-an-org/${user.email}`);
          if (response.data.success) set({ meAsAnOrg: { ...response.data.data, user } });
          else set({ meAsAnOrg: null });
        } catch (err: any) {
          console.error(err.message);
        }
      },

      createEvent: async (formData) => {
        set({ loading: true });
        try {
          const { user, token } = useProfileStore.getState();
          if (!user?.id) throw new Error("User not authenticated");
          const res = await axios.post(`${API_BASE_URL}/api/add-event/${user.id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.data.success) throw new Error(res.data.message);
        } catch (err: any) {
          console.error(err.message);
        } finally {
          set({ loading: false });
        }
      },

      fetchOrganizers: async () => {
        try {
          const { user } = useProfileStore.getState();
          if (!user?.id) return;
          const res = await axios.get(`${API_BASE_URL}/api/organizers/${user.id}`);
          set({ orgs: res.data.success ? res.data.data : [] });
        } catch (err: any) {
          console.error(err.message);
        }
      },

      fetchMyEvents: async () => {
        try {
          const { meAsAnOrg } = get();
          if (!meAsAnOrg?.id) return;
          const response = await axios.get(`${API_BASE_URL}/api/my-events/${meAsAnOrg.id}`);
          if (response.data.success) set({ myEvents: response.data.data });
        } catch (err: any) {
          console.error(err.message);
        }
      },

      deleteEvent: async (eventId) => {
        try {
          const token = useProfileStore.getState().token;
          if (!token) throw new Error("User not authenticated");
          const response = await axios.delete(`${API_BASE_URL}/api/del-event/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) await get().fetchMyEvents();
        } catch (err: any) {
          console.error(err.message);
        }
      },
    }),
    { name: "organizers-store", partialize: (state) => ({ meAsAnOrg: state.meAsAnOrg }) }
  )
);