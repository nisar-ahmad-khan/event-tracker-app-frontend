import axios from "axios";
import { create } from "zustand";
import { API_BASE_URL } from "./api";
import { persist } from "zustand/middleware";

interface FetchEvents{
    title:string
    location:string
    description:string
    starting_date_and_time: string
    ending_date_and_time : string
    url?:string
    ticket_price?:string
    is_free:number
    image:string
    category:string
}

interface EventProps{
    fetchedEvents : FetchEvents|null
    callEvents: ()=> Promise<void>
}

export const useEventStore = create<EventProps>()(
    persist(
    (set)=>({
    fetchedEvents:null,
    callEvents: async()=>{
        const response = await axios.get(`${API_BASE_URL}/api/all-events`);
        if(response.data.success){
            console.log(response.data.data)
            set({
                fetchedEvents: response.data.data
            })
        }else{
            console.log(response.data.message)
           set({
            fetchedEvents:null
           })
        }
    }
}),{
    name : 'events-store'
}));