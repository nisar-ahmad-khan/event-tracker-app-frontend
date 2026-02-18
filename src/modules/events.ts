import axios from "axios";
import { create } from "zustand";
import { API_BASE_URL } from "./api";
import { persist } from "zustand/middleware";
import { useProfileStore } from "../stores/store";

interface FetchEvents{
    id: number
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

interface AddComment{
    comment: string|number
    event_id: number
}


interface EventProps{
    fetchedEvents : FetchEvents[]
    msgWithUser: []
    callEvents: ()=> Promise<void>
    messagesWithUser: (event_id: number)=> Promise<void>
    add_comment:(data: AddComment)=> Promise<void>
}

export const useEventStore = create<EventProps>()(
    persist(
    (set )=>({
    fetchedEvents:[],
    msgWithUser : [],
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
            fetchedEvents:[]
           })
        }
    },
    messagesWithUser: async(event_id: number)=>{
        try{
        const response = await axios.get(`${API_BASE_URL}/api/event-with-comments/${event_id}`);
        if(response.data.success){
            console.log(response.data.data)
            
            set({
                   msgWithUser: response.data.data            
            })
        }else{
            console.log(response.data.message)
            alert(response.data.message)
            set({
                msgWithUser: []
            })
        }
        }catch(err: any){
            alert(err.message)
        }
        },
        add_comment: async(data)=>{
            try{
            
            const token = useProfileStore.getState().token;
             await axios.post(`${API_BASE_URL}/api/add-comment/${data.event_id}`,{
                'comment' : data.comment
            },{
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
        }catch(err: any){
            console.log(err.message)
        }
        }
}),{
    name : 'events-store'
}));