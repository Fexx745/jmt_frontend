import type { Manager } from "@/misc/type";

const prefix = 'manager'

const getManagerBy = (): Promise<Manager[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getManagerBy`, {
    method: "GET",
})

const getManagerByID = (data: { manager_id: string }): Promise<Manager> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getManagerByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertManagerBy = (data: Manager): Promise<Manager> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertManagerBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateManagerBy = (data: Manager): Promise<Manager> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateManagerBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteManagerBy = (data: { manager_id: string }): Promise<Manager> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteManagerBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useManager() {
    return {
        getManagerBy,
        getManagerByID,
        insertManagerBy,
        updateManagerBy,
        deleteManagerBy,
    };
}