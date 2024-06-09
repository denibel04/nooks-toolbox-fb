import { Villager } from "./villager"

export interface Island {
    id:string,
    attributes: {
        name:string,
        villagers:Villager[] | undefined,
        hemisphere: string
    }
}
