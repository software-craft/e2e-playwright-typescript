import { Page, APIRequestContext } from '@playwright/test';

export class backendUtils {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async backendRequest(endpoint: string, data: unknown) {
        const response = await this.page.request.post(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: data,
        });
        return response;
    }

    /**
     * Genera un usuario único usando timestamp para evitar colisiones
     * entre corridas de test (evita el error "email already exists").
     */
    async generateUniqueUser(request: APIRequestContext, baseUser: Record<string, any>) {
        const uniqueSuffix = Date.now();
        const newUser = {
            ...baseUser,
            email: `user_${uniqueSuffix}@test.com`,
        };

        const response = await this.backendRequest('/api/auth/login', newUser);

        if (!response.ok()) {
            const body = await response.text();
            throw new Error(
                `Failed to create user. Status: ${response.status()}. Body: ${body}`
            );
        }

        return newUser;
    }
}