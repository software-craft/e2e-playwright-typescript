
import { APIRequestContext, expect } from '@playwright/test';

export class BackendUtils {
  static async registerUser(
    apiRequestContext: APIRequestContext,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    // Conserva el dominio y evita colisiones / Preserves the domain and avoids collisions.
    const uniqueEmail = email.split('@')[0] + Date.now() + '@' + email.split('@')[1];

    // El API evita la UI y aísla la precondición / API setup avoids UI and isolates the precondition.
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
      },
    });

    // El contrato API exige 201 Created / The API contract requires 201 Created.
    expect(response.status()).toBe(201);

    return { email: uniqueEmail, password: password };
  }
}