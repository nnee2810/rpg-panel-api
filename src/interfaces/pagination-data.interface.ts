export interface PaginationData<T = unknown> {
  data: T[]
  total: number
  page: number
  take: number
}
