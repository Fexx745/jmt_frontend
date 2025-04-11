import type { Staff } from "@/misc/type";

const prefix = 'staff'

const getStaffBy = (): Promise<Staff[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getStaffBy`, {
    method: "GET",
})

const getStaffByID = (data: { staff_id: string }): Promise<Staff> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getStaffByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertStaffBy = (data: Staff): Promise<Staff> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertStaffBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateStaffBy = (data: Staff): Promise<Staff> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateStaffBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteStaffBy = (data: { staff_id: string }): Promise<Staff> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteStaffBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useStaff() {
    return {
        getStaffBy,
        getStaffByID,
        insertStaffBy,
        updateStaffBy,
        deleteStaffBy,
    };
}