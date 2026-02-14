


import axios from "axios";
import { create } from "zustand";
import { API_BASE_URL } from "./api";
import { useProfileStore } from "../stores/store";
import { useOrganizerStore } from "./organizers";

export interface Followers {
  id: number;
  name: string;
  email: string;
  created_at: string;
  email_verified_at?: string;
  updated_at?: string;
  pivot?: {
    organizer_id: number;
    user_id: number|string;
  };
}

interface FollowOrganizerUnfollow {
  organizer_id: string | number;
}

interface FollowersState {
  count: number;
  error: string | null;
  following: number;
  followed_users: Followers[];
  followers: Followers[];
  fetchFollowers: () => Promise<void>;
  fetchFollowing: () => Promise<void>;
  followUnFollow: (data: FollowOrganizerUnfollow) => Promise<void>;
}

export const useFollowerStore = create<FollowersState>((set, get) => ({
  count: 0,
  error: null,
  following: 0,
  followers: [],
  followed_users: [],

  fetchFollowers: async () => {
    try {
     
      const isOrg = useOrganizerStore.getState().meAsAnOrg;
            
      if(!isOrg){
        console.log('user not found!')
      }else{
        console.log("Auth User",isOrg)
      }
     const meAsAnOrg = useOrganizerStore.getState().meAsAnOrg?.email;
     console.warn("me as an org",meAsAnOrg)
      const response = await axios.get(
        `${API_BASE_URL}/api/my-followers/${meAsAnOrg}`
      );

      console.warn(response.data)

      if (response.data.success) {
        set({
          count: response.data.total_followers,
          followers: response.data.followers,
          error: null,
        });
        const {followers } = get();
        console.log("look",followers)
      } else {
        set({ count: 0, error: "Failed to load followers" });
        console.log(response.data )
      }
    } catch (err: any) {
    
      set({
        count: 0,
        error: err.message ?? "Something went wrong",
      });
    }
  },

  fetchFollowing: async () => {
    try {
      const authUser = useProfileStore.getState().user;
      if (!authUser?.id) {
        set({ following: 0, error: null, followed_users: [] });
        return;
      }

      const res = await axios.get(
        `${API_BASE_URL}/api/my-followed/${authUser.id}`
      );

      if (res.data.success) {
        // Assign followed_users from the API response
        set({
          following: res.data.followed,
          followed_users: res.data.followed_organizers.map((o: any) => ({
            id: o.id,
            user: o.user, // contains name & email
            pivot: o.pivot,
          })),
          error: null,
        });

        // Optional: debug log
        const { followed_users } = get();
        console.log("Followed users:", followed_users.map(u => u.user));
      } else {
        set({ following: 0, error: "Failed to load following", followed_users: [] });
      }
    } catch (err: any) {
      set({
        following: 0,
        error: err.message ?? "Something went wrong!",
        followed_users: [],
      });
    }
  },

  followUnFollow: async (data) => {
    try {
      const user = useProfileStore.getState().user;
      const token = useProfileStore.getState().token;

      const response = await axios.post(
        `${API_BASE_URL}/api/follow/${user?.id}`,
        { organizer_id: data.organizer_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        get().fetchFollowing();
      } else {
        alert("Something went wrong!");
      }
    } catch (err: any) {
      alert(err.message);
    }
  },
}));
