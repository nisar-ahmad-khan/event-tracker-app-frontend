// import axios from "axios";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { API_BASE_URL } from "./api";
// import { useProfileStore } from "../stores/store";

// interface RegisteredOrganizers {
//   id: string | number;
//   user_id: string | number;
//   phone_number: string | number;
//   description: string;
//   url: string;
//   email:string;
//   created_at: string;
//   updated_at: string;
// }

// interface OrganizerState {
//   orgs: RegisteredOrganizers[];
//   meAsAnOrg: RegisteredOrganizers|null;
//   loading: boolean;
//   register: (payload: {
//     phone: string;
//     description: string;
//     website: string;
//   }) => Promise<void>;
//   fetchOrganizers: () => Promise<void>;
//   createEvent: (formData: FormData) => Promise<void>;
//   fetchMyOrgAcc: ()=> Promise <void>
// }

// export const useOrganizerStore = create<OrganizerState>()(
//   persist(
//     (set , get) => ({
//       orgs: [],
//       meAsAnOrg: null,
//       loading: false,

//       register: async (payload) => {
//         set({ loading: true });
//         try {
//           const { user, token } = useProfileStore.getState();
//           if (!user?.id) throw new Error("User not logged in");

//           const res = await axios.post(
//             `${API_BASE_URL}/api/reg-as-organizer/${user.id}`,
//             {
//               phone_number: payload.phone,
//               description: payload.description,
//               url: payload.website,
//               email: user.email
//             },
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
          

//           if (res.data.success) {
//             set({ meAsAnOrg: res.data.created });
//             const meAsAnOrg = get();
//             console.log("data" ,meAsAnOrg )
//           }else{
//             console.log(res.data.message)
//           }

          
//         } catch (err: any) {
//           throw new Error(
//             err.response?.data?.message || "Organizer registration failed"
//           );
//         } finally {
//           set({ loading: false });
//         }
//       },
// fetchMyOrgAcc: async()=>{
//   try{
//   const {meAsAnOrg} = get();
//   const orgId = meAsAnOrg?.length > 0 ? meAsAnOrg[0].email : null;
//   const response = await axios.get(`${API_BASE_URL}/api/me-as-an-org/${orgId}`)
//   if(response.data.success){
//     set({
//       meAsAnOrg: response.data.data
//     })
//   }else{
//     set({
//       meAsAnOrg: []
//     })
//   }
// }catch(err: any){
//   console.log(err.message || "something went wrong!")
// }
// },
//       createEvent: async (formData: FormData) => {
//         set({ loading: true });
//         try {
//           const user = useProfileStore.getState().user
//           const token = useProfileStore.getState().token;
//           const res = await axios.post(
//             `${API_BASE_URL}/api/add-event/${user?.id}`,
//             formData,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           );
//           if(res.data.success){
//             console.log('success' , res.data.data)
//           }
//           console.log(res.data.message)
//           if (!res.data.success) {
//             throw new Error(res.data.message);
//           }
//         } catch (err: any) {
//           console.log(err.message)
//           throw new Error(
//             err.response?.data?.message || "Event creation failed"
//           );
//         } finally {
//           set({ loading: false });
//         }
//       },

//       fetchOrganizers: async () => {
//         try {
//           const { user } = useProfileStore.getState();
//           if (!user?.id) return;

//           const res = await axios.get(
//             `${API_BASE_URL}/api/organizers/${user.id}`
//           );

//           if (res.data.success) {
//             set({
//               orgs: res.data.data || [],
//             });
//           }
//         } catch (err) {
//           console.error("Fetch organizers error:", err);
//         }
//       },
//     }),
//     {
//       name: "organizers-store",
//       partialize: ((state)=>({
//         meAsAnOrg : state.meAsAnOrg
//       })),
//       onRehydrateStorage: ()=>(state)=>{
//         console.log('rehydration finished' , state);
//       }
//     }
//   )
// );




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
  created_at: string;
  updated_at: string;
}

interface OrganizerState {
  orgs: RegisteredOrganizers[];
  meAsAnOrg: RegisteredOrganizers | null;
  loading: boolean;

  register: (payload: {
    phone: string;
    description: string;
    website: string;
  }) => Promise<void>;

  fetchOrganizers: () => Promise<void>;
  createEvent: (formData: FormData) => Promise<void>;
  fetchMyOrgAcc: () => Promise<void>;
}

export const useOrganizerStore = create<OrganizerState>()(
  persist(
    (set) => ({
      orgs: [],
      meAsAnOrg: null,
      loading: false,

      // ===============================
      // Register as Organizer
      // ===============================
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

          // Backend returns { success: true, created: {...} }
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

      // ===============================
      // Fetch My Organizer Account
      // ===============================
      fetchMyOrgAcc: async () => {
        try {
          const { user } = useProfileStore.getState();
          if (!user?.email) return;

          const response = await axios.get(
            `${API_BASE_URL}/api/me-as-an-org/${user.email}`
          );

          if (response.data.success) {
            // Backend returns { success: true, data: {...} }
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

      // ===============================
      // Create Event
      // ===============================
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

      // ===============================
      // Fetch Other Organizers
      // ===============================
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
