/**
 * Represents pagination details including current page, page size,
 * total number of pages, and total number of items.
 */
export interface Pagination{
    page:number,
    pageSize:number,
    pageCount:number,
    total:number
}
/**
 * Represents data that is paginated, containing an array of type `T`
 * and pagination details.
 */
export interface PaginatedData<T>{
    data:T[],
    pagination:Pagination
}