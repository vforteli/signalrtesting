import { DefaultHttpClient, HttpRequest, HttpResponse } from "@microsoft/signalr";
import { getCsrfTokenFromCookie } from "../Utils";


export class CustomHttpClient extends DefaultHttpClient {
    public send(request: HttpRequest): Promise<HttpResponse> {
        const csrfToken = getCsrfTokenFromCookie()  // todo not exactly reusable but whatevs
        if (csrfToken) {
            request.headers = { ...request.headers, 'X-XSRF-TOKEN': csrfToken };
        }

        return super.send(request);
    }
}
