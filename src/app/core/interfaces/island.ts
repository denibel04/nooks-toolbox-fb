import { Villager } from "./villager"

/**
 * Represents an island with its unique identifier, attributes such as name,
 * villagers residing on the island (optional), and hemisphere.
 */
export interface Island {
    id:string,
    attributes: {
        name:string,
        villagers:Villager[] | undefined,
        hemisphere: string
    }
}
