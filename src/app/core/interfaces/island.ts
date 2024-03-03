import { Loan } from "./loan"
import { Villager } from "./villager"

export interface Island {
    id:string,
    attributes: {
        islandName:string,
        villagers:Villager[] | undefined,
        loans: Loan[] | undefined
    }
}
