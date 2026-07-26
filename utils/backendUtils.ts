import {Page, Locator, request} from '@playwright/test';

export class backendUtils {
    readonly page: Page;

    constructor(page: Page) { // Inicializate the page and locators
        this.page = page;
    }

    async backendRequest(edpoint: string, data: JSON) {
        const response = await this.page.request.post(edpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: data
        });
        const responseBody = await response.json();
        return response;
    }

}