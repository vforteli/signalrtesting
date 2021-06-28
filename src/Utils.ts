export const getCsrfTokenFromCookie = () => {
    const regex = /XSRF-TOKEN=(?<csrfToken>[^;]*)/
    const match = document.cookie.match(regex)
    return match && match.groups ? match.groups.csrfToken : ''
}