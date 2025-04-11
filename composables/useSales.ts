import type { Sales } from "@/misc/type";

const prefix = 'sales'

const getSalesBy = (): Promise<Sales[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getSalesBy`, {
    method: "GET",
})

const getSalesByID = (data: { sales_id: string }): Promise<Sales> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getSalesByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertSalesBy = (data: Sales): Promise<Sales> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertSalesBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateSalesBy = (data: Sales): Promise<Sales> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateSalesBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteSalesBy = (data: { sales_id: string }): Promise<Sales> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteSalesBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useSales() {
    return {
        getSalesBy,
        getSalesByID,
        insertSalesBy,
        updateSalesBy,
        deleteSalesBy,
    };
}