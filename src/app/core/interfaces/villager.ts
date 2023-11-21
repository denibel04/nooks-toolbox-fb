export interface Villager {
    id: number,
    attributes: {
        name:string,
        image_url:string,
        species:string,
        personality:string,
        gender:string,
        birthday_month:string,
        birthday_day:number,
        sign:string,
        quote:string,
        phrase:string,
        islander:boolean
    }
}
