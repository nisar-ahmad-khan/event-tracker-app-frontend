import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "./api";
import { useProfileStore } from "../stores/store";
import { useOrganizerStore } from "./organizers";

export interface User {
  id: string | number;
  name: string;
  email?: string;
  profile_img?: string;
}

export interface Pivot {
  organizer_id: number;
  user_id: string | number;
}

export interface Followers {
  id: number;
  name: string;
  email: string;
  profile_img?: string;
  created_at: string;
  email_verified_at?: string;
  updated_at?: string;
  pivot?: Pivot;
  user?: User; // this allows follower.user.name usage
  is_following?: boolean;
}

export interface FollowOrganizerUnfollow {
  organizer_id: string | number;
}

export interface FollowersState {
  count: number;
  error: string | null;
  following: number;
  followed_users: Followers[];
  followers: Followers[];
  fetchFollowers: () => Promise<void>;
  fetchFollowing: () => Promise<void>;
  followUnFollow: (data: FollowOrganizerUnfollow) => Promise<void>;
}

export const useFollowerStore = create<FollowersState>()(
  persist(
    (set, get) => ({
      count: 0,
      error: null,
      following: 0,
      followed_users: [],
      followers: [],

      fetchFollowers: async () => {
        try {
          const meAsAnOrg = useProfileStore.getState().user?.email;
          if (!meAsAnOrg) return;

          const response = await axios.get(`${API_BASE_URL}/api/my-followers/${meAsAnOrg}`);

          if (response.data.success) {
            set({
              count: response.data.total_followers,
              followers: response.data.followers.map((f: any) => ({
                id: f.id,
                user: {
                  id: f.id,
                  name: f.name,
                  email: f.email,
                  profile_img: f.profile_img,
                },
                created_at: f.created_at,
                email_verified_at: f.email_verified_at,
                updated_at: f.updated_at,
                pivot: f.pivot,
              })),
              error: null,
            });
          } else {
            set({ count: 0, error: "Failed to load followers", followers: [] });
          }
        } catch (err: any) {
          set({ count: 0, error: err.message ?? "Something went wrong", followers: [] });
        }
      },

      fetchFollowing: async () => {
        try {
          const authUser = useProfileStore.getState().user;
          if (!authUser?.id) {
            set({ following: 0, error: null, followed_users: [] });
            return;
          }

          const res = await axios.get(`${API_BASE_URL}/api/my-followed/${authUser.id}`);

          if (res.data.success) {
            set({
              following: res.data.followed,
              followed_users: res.data.followed_organizers.map((o: any) => ({
                id: o.id,
                user: {
                  id: o.user.id,
                  name: o.user.name,
                  email: o.user.email,
                  profile_img: o.user.profile_img,
                },
                pivot: o.pivot,
                created_at: o.created_at,
                email_verified_at: o.email_verified_at,
                updated_at: o.updated_at,
              })),
              error: null,
            });
          } else {
            set({ following: 0, error: "Failed to load following", followed_users: [] });
          }
        } catch (err: any) {
          set({ following: 0, error: err.message ?? "Something went wrong", followed_users: [] });
        }
      },

      followUnFollow: async (data: FollowOrganizerUnfollow) => {
        try {
          const { user, token } = useProfileStore.getState();
          if (!user?.id || !token) throw new Error("User not authenticated");

          const response = await axios.post(
            `${API_BASE_URL}/api/follow/${user.id}`,
            { organizer_id: data.organizer_id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.data.success) await get().fetchFollowing();
          else alert("Something went wrong!");
        } catch (err: any) {
          alert(err.message);
        }
      },
    }),
    { name: "followers-store" }
  )
);