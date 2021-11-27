/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class HeadersService {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getHeaders(): CancelablePromise<any> {
        return __request({
            method: 'GET',
            path: `/api/Headers`,
        });
    }

}