import type { Order } from "@/misc/type";

const prefix = 'order'

const getOrderBy = (): Promise<Order[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getOrderBy`, {
    method: "GET",
})

const getOrderByID = (data: { order_id: string }): Promise<Order> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getOrderByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertOrderBy = (data: Order): Promise<Order> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertOrderBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateOrderBy = (data: Order): Promise<Order> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateOrderBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteOrderBy = (data: { order_id: string }): Promise<Order> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteOrderBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useOrder() {
    return {
        getOrderBy,
        getOrderByID,
        insertOrderBy,
        updateOrderBy,
        deleteOrderBy,
    };
}