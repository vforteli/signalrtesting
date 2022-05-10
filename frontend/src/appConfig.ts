declare global {
    // eslint-disable-next-line no-unused-vars
    interface Window { _env_: Record<AppConfigKeys, string> }
}

export type AppConfigKeys =
    'REACT_APP_AUTH_DOMAIN'
    | 'REACT_APP_AUTH_CLIENT_ID'
    | 'REACT_APP_AUTH_AUDIENCE'
    | 'REACT_APP_AUTH_SCOPE'
    | 'REACT_APP_SIGNALR_HUB_URL'
    | 'REACT_APP_BACKEND_URL'


const getValue = (key: AppConfigKeys) => process.env.NODE_ENV === 'production' ? window._env_[key] : (process.env[key] ?? '')

export const AppConfig: Record<AppConfigKeys, string> = {
    REACT_APP_AUTH_AUDIENCE: getValue('REACT_APP_AUTH_AUDIENCE'),
    REACT_APP_AUTH_CLIENT_ID: getValue('REACT_APP_AUTH_CLIENT_ID'),
    REACT_APP_AUTH_DOMAIN: getValue('REACT_APP_AUTH_DOMAIN'),
    REACT_APP_AUTH_SCOPE: getValue('REACT_APP_AUTH_SCOPE'),
    REACT_APP_BACKEND_URL: getValue('REACT_APP_BACKEND_URL'),
    REACT_APP_SIGNALR_HUB_URL: getValue('REACT_APP_SIGNALR_HUB_URL'),
}
