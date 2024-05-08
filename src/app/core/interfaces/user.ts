import { Island } from "./island";

export interface User {
    uuid?:string,
    username:string,
    display_name?:string,
    island?:any,
    extended_id?:number,
    profile_picture?:string,
    dream_code?:string,
    role: 'normal' | 'admin' | 'editor';
}



