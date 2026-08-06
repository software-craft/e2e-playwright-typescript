
import { APIRequestContext, expect } from '@playwright/test';

export class BackendUtils {

    static async registerUser(apiRequestContext: APIRequestContext, firstName: string, lastName: string, email: string, password: string) {
        const uniqueEmail = (email.split('@')[0] + Date.now() + '@' + email.split('@')[1]);
        const response = await apiRequestContext.post('http://localhost:6007/api/auth/signup', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: {
                firstName: firstName,
                lastName: lastName,
                email: uniqueEmail,
                password: password,
            }
        });

        expect(response.status()).toBe(201);
        return { email: uniqueEmail, password: password };
    }
}