import type { Stock } from "@/misc/type";

const prefix = 'stock'

const getStockBy = (): Promise<Stock[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getStockBy`, {
    method: "GET",
})

const getStockByID = (data: { stock_id: string }): Promise<Stock> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getStockByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertStockBy = (data: Stock): Promise<Stock> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertStockBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateStockBy = (data: Stock): Promise<Stock> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateStockBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteStockBy = (data: { stock_id: string }): Promise<Stock> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteStockBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useStock() {
    return {
        getStockBy,
        getStockByID,
        insertStockBy,
        updateStockBy,
        deleteStockBy,
    };
}