export interface CallApiServiceOptions<Params, Data> {
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT",
  path: string,
  params?: Params,
  data?: Data,
  headers?: Record<string, unknown>
}
