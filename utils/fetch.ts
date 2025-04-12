import Swal from 'sweetalert2'
import type { FetchOptions } from "@/misc/type"

export const preSecureFetch = (url: string, options: FetchOptions): Promise<any> =>
  $fetch(url, options)
    .then(responseInterceptor)
    .catch(e => errorInterceptor(e, options))

export const responseInterceptor = (response: any): Promise<any> => {
  return Promise.resolve(response)
}

export const errorInterceptor = async (error: any, options: any): Promise<any> => {
  if (error?.response) {
    const { status, statusText, _data } = error.response 
    Swal.fire({
      title: 'Request failed',
      text: _data.message || `${status} ${statusText}`,
      icon: "error",
    })
  } else {
    Swal.fire({
      title: 'Unable to connect',
      text: 'Network or Server error',
      icon: "error",
    })
  }

  return Promise.reject(error)
}
