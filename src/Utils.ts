export const getCsrfTokenFromCookie = () => {
    const regex = /XSRF-TOKEN=(?<csrfToken>[^;]*)/
    const match = document.cookie.match(regex)
    return match && match.groups ? match.groups.csrfToken : ''
}

export const getDefaultHeaders = (): Promise<Record<string, string>> => {
    return Promise.resolve({ 'X-XSRF-TOKEN': getCsrfTokenFromCookie() })
}