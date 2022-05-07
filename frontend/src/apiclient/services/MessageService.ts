/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageModel } from '../models/MessageModel';
import type { CancelablePromise } from '../core/CancelablePromise';
import { request as __request } from '../core/request';

export class MessageService {

    /**
     * @param messageId 
     * @returns MessageModel Success
     * @throws ApiError
     */
    public static deleteMessage(
messageId: string,
): CancelablePromise<MessageModel> {
        return __request({
            method: 'DELETE',
            path: `/api/messages/${messageId}`,
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static clearMessage(): CancelablePromise<any> {
        return __request({
            method: 'DELETE',
            path: `/api/messages/clear`,
        });
    }

    /**
     * @param fromDate 
     * @returns MessageModel Success
     * @throws ApiError
     */
    public static getMessages(
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

}