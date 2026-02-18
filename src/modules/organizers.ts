import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "./api";
import { useProfileStore } from "../stores/store";

interface RegisteredOrganizers {
  id: string | number;
  user_id: string | number;
  phone_number: string | number;
  description: string;
  url: string;
  email: string;
  profile_img:string;
  created_at: string;
  updated_at: string;
}


interface OrgEvent {
            id: number;
            organizer_id: number,
            title:string,
            location : string,
            image: string,
            url?: string|null,
            description: string,
            category: string,
            starting_date_and_time: string,
            ending_date_and_time: string,
            is_free?: string|number ,
            ticket_price: number,
            tickets_sold: number,
            created_at: string,
            updated_at: string
        }

interface OrganizerState {
  orgs: RegisteredOrganizers[];
  meAsAnOrg: RegisteredOrganizers | null;
  loading: boolean;
  myEvents: OrgEvent|[]

  register: (payload: {
    phone: string;
    description: string;
    website: string;
  }) => Promise<void>;

  fetchOrganizers: () => Promise<void>;
  createEvent: (formData: FormData) => Promise<void>;
  fetchMyOrgAcc: () => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  deleteEvent: (data: any) => Promise<void>;
}

export const useOrganizerStore = create<OrganizerState>()(
  persist(
    (set ,get) => ({
      orgs: [],
      meAsAnOrg: null,
      loading: false,
      myEvents: [],

     
      register: async (payload) => {
        set({ loading: true });

        try {
          const { user, token } = useProfileStore.getState();
          if (!user?.id || !user?.email) {
            throw new Error("User not logged in");
          }

          const res = await axios.post(
            `${API_BASE_URL}/api/reg-as-organizer/${user.id}`,
            {
              phone_number: payload.phone,
              description: payload.description,
              url: payload.website,
              email: user.email,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.data.success) {
            throw new Error(res.data.message);
          }

          set({
            meAsAnOrg: res.data.created,
          });

          console.log("Organizer registered:", res.data.created);
        } catch (err: any) {
          console.error("Register error:", err.message);
          throw new Error(
            err.response?.data?.message || "Organizer registration failed"
          );
        } finally {
          set({ loading: false });
        }
      },


      fetchMyOrgAcc: async () => {
        try {
          const { user } = useProfileStore.getState();
          if (!user?.email) return;

          const response = await axios.get(
            `${API_BASE_URL}/api/me-as-an-org/${user.email}`
          );

          if (response.data.success) {
           
            set({
              meAsAnOrg: response.data.data,
            });
          } else {
            set({
              meAsAnOrg: null,
            });
          }
        } catch (err: any) {
          console.error(
            err.response?.data?.message || "Fetch organizer account failed"
          );
        }
      },

     
      createEvent: async (formData: FormData) => {
        set({ loading: true });

        try {
          const { user, token } = useProfileStore.getState();
          if (!user?.id) throw new Error("User not authenticated");

          const res = await axios.post(
            `${API_BASE_URL}/api/add-event/${user.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.data.success) {
            throw new Error(res.data.message);
          }

          console.log("Event created:", res.data.data);
        } catch (err: any) {
          console.error("Create event error:", err.message);
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
          } else {
            set({
              orgs: [],
            });
          }
        } catch (err) {
          console.error("Fetch organizers error:", err);
        }
      },
      fetchMyEvents: async()=>{
        try{
        const {meAsAnOrg} = get();
        const response = await axios.get(`${API_BASE_URL}/api/my-events/${meAsAnOrg?.id}`);
        if(response.data.success){
         
          set({
            myEvents: response.data.data
          })
         
        }else{
          console.log(response.data.message)
        }
      }catch(err:any){
        alert(err.message)
      }
    },
    deleteEvent : async(data: any)=>{
      try{
      const token = useProfileStore.getState().token;
      const response = await axios.delete(`${API_BASE_URL}/api/del-event/${data}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(response.data.success){
        console.log(response.data.message)
        const {fetchMyEvents} = get();
        fetchMyEvents();
      }else{
        console.log(response.data.message)
      }
    }catch(err: any){
      console.log(err.message)
    }
  }
    }),
    {
      name: "organizers-store",
      partialize: (state) => ({
        meAsAnOrg: state.meAsAnOrg,
      }),

      onRehydrateStorage: () => (state) => {
        console.log("Organizer store rehydrated:", state);
      },
    }
  )
);
