import { Island } from "./island";

export interface User {
    id?: number,
    uuid?:string,
    username:string,
    island?:any,
    extended_id?:number,
    profile_picture?:string,
    dream_code?:string,
    role: 'normal' | 'admin' | 'banned',
    followers: string[],
    following: string[]
}



