import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { API_BASE_URL } from "./api";
import { useProfileStore } from "../stores/store";

interface RegisteredOrganizers {
  id: string | number;
  user_id: string | number;
  phone_number: string | number;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface OrganizerState {
  orgs: RegisteredOrganizers[];
  meAsAnOrg: RegisteredOrganizers[];
  loading: boolean;
  register: (payload: {
    phone: string;
    description: string;
    website: string;
  }) => Promise<void>;
  fetchOrganizers: () => Promise<void>;
  createEvent: (formData: FormData) => Promise<void>;
}

export const useOrganizerStore = create<OrganizerState>()(
  persist(
    (set , get) => ({
      orgs: [],
      meAsAnOrg: [],
      loading: false,

      register: async (payload) => {
        set({ loading: true });
        try {
          const { user, token } = useProfileStore.getState();
          if (!user?.id) throw new Error("User not logged in");

          const res = await axios.post(
            `${API_BASE_URL}/api/reg-as-organizer/${user.id}`,
            {
              phone_number: payload.phone,
              description: payload.description,
              url: payload.website,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data.success) {
            set({ meAsAnOrg: res.data.data });
            const meAsAnOrg = get();
            console.log("data" ,meAsAnOrg )
          }

          console.log("else statement:" ,res.data.message )
        } catch (err: any) {
          throw new Error(
            err.response?.data?.message || "Organizer registration failed"
          );
        } finally {
          set({ loading: false });
        }
      },

      createEvent: async (formData: FormData) => {
        set({ loading: true });
        try {
          const user = useProfileStore.getState().user
          const token = useProfileStore.getState().token;
          const res = await axios.post(
            `${API_BASE_URL}/api/add-event/${user?.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if(res.data.success){
            console.log('success' , res.data.data)
          }

          if (!res.data.success) {
            throw new Error(res.data.message);
          }
        } catch (err: any) {
          throw new Error(
            err.response?.data?.message || "Event creation failed"
          );
        } finally {
          set({ loading: false });
        }
      },

      fetchOrganizers: async () => {
        try {
          const { user } = useProfileStore.getState();
          if (!user?.id) return;

          const res = await axios.get(
            `${API_BASE_URL}/api/organizers/${user.id}`
          );

          if (res.data.success) {
            set({
              orgs: res.data.data || [],
            });
          }
        } catch (err) {
          console.error("Fetch organizers error:", err);
        }
      },
    }),
    {
      name: "organizers-store",
      partialize: ((state)=>({
        meAsAnOrg : state.meAsAnOrg
      }))
    }
  )
);
