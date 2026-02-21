import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_BASE_URL } from "./api";
import { useProfileStore } from "../stores/store";

export interface EventUser {
  id: number | string;
  name: string;
  email?: string;
  profile_img?: string;
}

export interface EventOrganizer {
  id: number;
  user: EventUser;
}

export interface FetchEvents {
  id: number;
  title: string;
  location: string;
  description: string;
  starting_date_and_time: string;
  ending_date_and_time: string;
  url?: string;
  ticket_price?: string;
  is_free: number;
  image: string;
  category: string;
  organizer: EventOrganizer;
}

export interface AddComment {
  comment: string | number;
  event_id: number;
}

export interface CommentWithUser {
  id: number;
  comment: string;
  user?: EventUser;
  created_at?: string;
}

export interface EventProps {
  fetchedEvents: FetchEvents[];
  msgWithUser: CommentWithUser[];
  callEvents: () => Promise<void>;
  messagesWithUser: (event_id: number) => Promise<void>;
  add_comment: (data: AddComment) => Promise<void>;
}

export const useEventStore = create<EventProps>()(
  persist(
    (set) => ({
      fetchedEvents: [],
      msgWithUser: [],

      callEvents: async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/all-events`);
          if (response.data.success) {
            set({ fetchedEvents: response.data.data });
          } else {
            set({ fetchedEvents: [] });
          }
        } catch (err: any) {
          console.error(err.message);
        }
      },

      messagesWithUser: async (event_id: number) => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/event-with-comments/${event_id}`);
          if (response.data.success) set({ msgWithUser: response.data.data });
          else set({ msgWithUser: [] });
        } catch (err: any) {
          alert(err.message);
          set({ msgWithUser: [] });
        }
      },

      add_comment: async (data: AddComment) => {
        try {
          const token = useProfileStore.getState().token;
          if (!token) throw new Error("User not authenticated");

          await axios.post(
            `${API_BASE_URL}/api/add-comment/${data.event_id}`,
            { comment: data.comment },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (err: any) {
          console.error(err.message);
        }
      },
    }),
    { name: "events-store" }
  )
);