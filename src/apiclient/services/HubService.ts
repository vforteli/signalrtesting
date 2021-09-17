/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageModel } from '../models/MessageModel';
import type { SendMessageModel } from '../models/SendMessageModel';
import { request as __request } from '../core/request';

export class HubService {

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static async postHubService(
requestBody?: SendMessageModel,
): Promise<any> {
        const result = await __request({
            method: 'POST',
            path: `/api/messages`,
            body: requestBody,
        });
        return result.body;
    }

    /**
     * @param fromDate 
     * @returns MessageModel Success
     * @throws ApiError
     */
    public static async getHubService(
fromDate?: string,
): Promise<Array<MessageModel>> {
        const result = await __request({
            method: 'GET',
            path: `/api/messages`,
            query: {
                'fromDate': fromDate,
            },
        });
        return result.body;
    }

    /**
     * @param messageId 
     * @returns any Success
     * @throws ApiError
     */
    public static async deleteHubService(
messageId: string,
): Promise<any> {
        const result = await __request({
            method: 'DELETE',
            path: `/api/messages/${messageId}`,
        });
        return result.body;
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static async deleteHubService1(): Promise<any> {
        const result = await __request({
            method: 'DELETE',
            path: `/api/messages/clear`,
        });
        return result.body;
    }

}