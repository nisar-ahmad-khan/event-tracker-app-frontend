import axios from "axios";
import { create } from "zustand";
import { API_BASE_URL } from "./api";
import { useProfileStore } from "../stores/store";
import { createJSONStorage, persist } from "zustand/middleware";

interface Organizer{
    user_id?: number | string
    phone_number: string | number
    description: string
    url?: string
}
interface Payload{
    phone: string | number,
    description: string,
    website: string
}


interface OrganizerUser {
        id: string | number,
        name: string,
        email: string,
        email_verified_at: null | string,
        created_at: string,
        updated_at: string
}

interface RegisteredOrganizers  {
            id: string|number,
            user_id: string|number,
            phone_number: number,
            description: string,
            url: string,
            created_at: string,
            updated_at: string
        }

        interface MeAsAnOrg{ phone_number: string | number,
             description: string,
              url: string,
               user_id: string | number,
                updated_at: string,
                 created_at: string,
                  id: string | number 
                }


interface OrganizerState{
    user: Organizer[],
    register: (payload: Payload)=> Promise<void>
    fetchOrganizers:()=> Promise<void>
    orgs: RegisteredOrganizers[]
    message : string
    organizerUser: OrganizerUser[]
    meAsAnOrg: MeAsAnOrg|null
}


export const useOrganizerStore = create<OrganizerState>()(
  persist(
    (set, get) => ({
      user: [],
      orgs: [],
      message: "",
      organizerUser: [],
      meAsAnOrg: null,

      register: async (payload) => {
        try {
          const user = useProfileStore.getState().user;
          const token = useProfileStore.getState().token;
          if (!user?.id) throw new Error("User not logged in");

          const response = await axios.post(
            `${API_BASE_URL}/api/reg-as-organizer/${user.id}`,
            {
              phone_number: payload.phone,
              description: payload.description,
              url: payload.website,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data.success) {
            set({ meAsAnOrg: response.data.data });
            console.log("Organizer set:", response.data.data);
          } else {
            console.log("API error:", response.data.message);
            set({ message: response.data.message || "Something went wrong" });
          }
        } catch (err: any) {
          const message = err.response?.data?.message || err.message || "Something went wrong!";
          console.log("Error registering organizer:", message);
          set({ message });
        }
      },

      fetchOrganizers: async () => {
        try {
          const user = useProfileStore.getState().user;
          if (!user?.id) throw new Error("User not logged in");

          const response = await axios.get(`${API_BASE_URL}/api/organizers/${user.id}`);

          if (response.data.success) {
            set({
              orgs: response.data.data,
              organizerUser: response.data.data, // map if needed
            });
            console.log("Organizers fetched:", response.data.data);
          } else {
            set({
              orgs: [],
              message: response.data.message || "Something went wrong!",
            });
          }
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || "Something went wrong!";
          set({ message });
        }
      },
    }),
    {
      name: "organizers-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
