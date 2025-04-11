import type { Report } from "@/misc/type";

const prefix = 'report'

const getReportBy = (): Promise<Report[]> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getReportBy`, {
    method: "GET",
})

const getReportByID = (data: { report_id: string }): Promise<Report> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/getReportByID`, {
    method: "POST",
    body: JSON.stringify(data),
})

const insertReportBy = (data: Report): Promise<Report> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/insertReportBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const updateReportBy = (data: Report): Promise<Report> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/updateReportBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

const deleteReportBy = (data: { report_id: string }): Promise<Report> => preSecureFetch(
    `${useRuntimeConfig().public.apiBaseUrl}/${prefix}/deleteReportBy`, {
    method: "POST",
    body: JSON.stringify(data),
})

export default function useReport() {
    return {
        getReportBy,
        getReportByID,
        insertReportBy,
        updateReportBy,
        deleteReportBy,
    };
}