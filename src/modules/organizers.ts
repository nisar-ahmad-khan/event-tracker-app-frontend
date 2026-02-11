import axios from "axios";
import { create } from "zustand";
import { API_BASE_URL } from "./api";
import { useProfileStore } from "../stores/store";
import { persist } from "zustand/middleware";

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
    (set ,get)=>({
user:[],
orgs:[],
message:"",
organizerUser: [],
meAsAnOrg: null,
register: async(payload)=>{
    try{
        const user = useProfileStore.getState().user;
        const token = useProfileStore.getState().token;
        const response = await axios.post(`${API_BASE_URL}/api/reg-as-organizer/${user?.id}`,{
            phone_number: payload.phone,
            description: payload.description,
            url : payload.website
        },{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        if(response.data.success){
            console.log(response.data.data)
           set({
            meAsAnOrg: response.data.data
           })
           const {meAsAnOrg} = get()
           console.log('me an an org is set', meAsAnOrg);
           console.log("data is here",meAsAnOrg)
        }else{
            console.log("else message",response.data.message)
        }
    }catch(err: any){
        console.log('error message',err.message)
    }
},
fetchOrganizers: async()=>{
    try{
    const user = useProfileStore.getState().user;
const response = await axios.get(`${API_BASE_URL}/api/organizers/${user?.id}`);
if(response.data.success){
    console.log(response.data.data)
    set({
        orgs: response.data.data,
        organizerUser: response.data.data
    })
    const {organizerUser , orgs} = get();
    
    console.log('organizer', organizerUser, 'orgs' , orgs  )

}else{
    set({
        orgs:[] , message: response.data.message || "something went wrong!"
    })
}}catch(error: any){
   set({
    message: error.message || "someting went wrong!"
   }) 
}
}
}),{
    name: "organizers store"
}))