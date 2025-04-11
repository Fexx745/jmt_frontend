import type { Product } from "@/misc/type";

const prefix = 'product'

const getProductBy = (): Promise<Product[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getProductBy`, {
    method: "GET",
})

const getProductByID = (data: { product_id: string }): Promise<Product> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getProductByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertProductBy = (data: Product): Promise<Product> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertProductBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateProductBy = (data: Product): Promise<Product> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateProductBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteProductBy = (data: { product_id: string }): Promise<Product> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteProductBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useProduct() {
    return {
        getProductBy,
        getProductByID,
        insertProductBy,
        updateProductBy,
        deleteProductBy,
    };
}