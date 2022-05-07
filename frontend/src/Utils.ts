export const getCsrfTokenFromCookie = () => {
    const regex = /XSRF-TOKEN=(?<csrfToken>[^;]*)/
    const match = document.cookie.match(regex)
    return (match && match.groups) ? match.groups.csrfToken : ''
}

export const getNonceFromCookie = () => {
    const regex = /csp-nonce=(?<value>[^;]*)/
    const match = document.cookie.match(regex)
    return (match && match.groups) ? match.groups.value : ''
}

export const getDefaultHeaders = (): Promise<Record<string, string>> => {
    const csrfToken = getCsrfTokenFromCookie()
    if (csrfToken) {
        return Promise.resolve({ 'X-XSRF-TOKEN': csrfToken })
    }
    return Promise.reject({})
}