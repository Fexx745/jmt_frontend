import type { Store } from "@/misc/type";

const prefix = 'store'

const getStoreBy = (): Promise<Store[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getStoreBy`, {
    method: "GET",
})

const getStoreByID = (data: { store_id: string }): Promise<Store> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getStoreByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertStoreBy = (data: Store): Promise<Store> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertStoreBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateStoreBy = (data: Store): Promise<Store> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateStoreBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteStoreBy = (data: { store_id: string }): Promise<Store> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteStoreBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useStore() {
    return {
        getStoreBy,
        getStoreByID,
        insertStoreBy,
        updateStoreBy,
        deleteStoreBy,
    };
}