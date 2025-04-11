import type { Promotion } from "@/misc/type";

const prefix = 'promotion'

const getPromotionBy = (): Promise<Promotion[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getPromotionBy`, {
    method: "GET",
})

const getPromotionByID = (data: { promotion_id: string }): Promise<Promotion> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getPromotionByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertPromotionBy = (data: Promotion): Promise<Promotion> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertPromotionBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updatePromotionBy = (data: Promotion): Promise<Promotion> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updatePromotionBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deletePromotionBy = (data: { promotion_id: string }): Promise<Promotion> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deletePromotionBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function usePromotion() {
    return {
        getPromotionBy,
        getPromotionByID,
        insertPromotionBy,
        updatePromotionBy,
        deletePromotionBy,
    };
}