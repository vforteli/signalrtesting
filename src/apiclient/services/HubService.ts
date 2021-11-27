/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageModel } from '../models/MessageModel';
import type { SendMessageModel } from '../models/SendMessageModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class HubService {

    /**
     * @param requestBody 
     * @returns MessageModel Success
     * @throws ApiError
     */
    public static postHub(
requestBody: SendMessageModel,
): CancelablePromise<MessageModel> {
        return __request({
            method: 'POST',
            path: `/api/messages`,
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param fromDate 
     * @returns MessageModel Success
     * @throws ApiError
     */
    public static getHub(
fromDate?: string,
): CancelablePromise<Array<MessageModel>> {
        return __request({
            method: 'GET',
            path: `/api/messages`,
            query: {
                'fromDate': fromDate,
            },
        });
    }

    /**
     * @param messageId 
     * @returns any Success
     * @throws ApiError
     */
    public static deleteHub(
messageId: string,
): CancelablePromise<any> {
        return __request({
            method: 'DELETE',
            path: `/api/messages/${messageId}`,
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static deleteHub1(): CancelablePromise<any> {
        return __request({
            method: 'DELETE',
            path: `/api/messages/clear`,
        });
    }

}