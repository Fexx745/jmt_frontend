import type { SaleStaff } from "@/misc/type";

const prefix = 'salestaff'

const getSaleStaffBy = (): Promise<SaleStaff[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getSaleStaffBy`, {
    method: "GET",
})

const getSaleStaffByID = (data: { salestaff_id: string }): Promise<SaleStaff> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getSaleStaffByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertSaleStaffBy = (data: SaleStaff): Promise<SaleStaff> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertSaleStaffBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateSaleStaffBy = (data: SaleStaff): Promise<SaleStaff> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateSaleStaffBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteSaleStaffBy = (data: { salestaff_id: string }): Promise<SaleStaff> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteSaleStaffBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useSaleStaff() {
    return {
        getSaleStaffBy,
        getSaleStaffByID,
        insertSaleStaffBy,
        updateSaleStaffBy,
        deleteSaleStaffBy,
    };
}