import type { Slip } from "@/misc/type";

const prefix = 'slip'

const getSlipBy = (): Promise<Slip[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getSlipBy`, {
    method: "GET",
})

const getSlipByID = (data: { slip_id: string }): Promise<Slip> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getSlipByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertSlipBy = (data: Slip): Promise<Slip> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertSlipBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateSlipBy = (data: Slip): Promise<Slip> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateSlipBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteSlipBy = (data: { slip_id: string }): Promise<Slip> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteSlipBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useSlip() {
    return {
        getSlipBy,
        getSlipByID,
        insertSlipBy,
        updateSlipBy,
        deleteSlipBy,
    };
}