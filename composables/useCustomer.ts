import type { Customer } from "@/misc/type";

const prefix = 'customer'

const getCustomerBy = (): Promise<Customer[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getCustomerBy`, {
    method: "GET",
})

const getCustomerByID = (data: { customer_id: string }): Promise<Customer> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getCustomerByID`, {
    method: "GET",
    body: JSON.stringify(data),
})

const insertCustomerBy = (data: Customer): Promise<Customer> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertCustomerBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateCustomerBy = (data: Customer): Promise<Customer> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateCustomerBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteCustomerBy = (data: { customer_id: string }): Promise<Customer> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteCustomerBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useCustomer() {
    return {
        getCustomerBy,
        getCustomerByID,
        insertCustomerBy,
        updateCustomerBy,
        deleteCustomerBy,
    };
}