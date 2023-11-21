import { Villager } from "./villager"

export interface Island {
    id:number | undefined,
    attributes: {
        islandName:string,
        villagers:Villager[] | undefined
    }
}
