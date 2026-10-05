
import { APIRequestContext, expect } from '@playwright/test';

// Agrupa operaciones de API usadas para preparar datos antes de las pruebas de interfaz.
export class BackendUtils {
  // Registra un usuario por API y devuelve las credenciales únicas para iniciar sesión.
  static async registerUser(
    apiRequestContext: APIRequestContext,
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    // Conserva el dominio del correo de prueba y agrega la hora para distinguir al usuario.
    const uniqueEmail = email.split('@')[0] + Date.now() + '@' + email.split('@')[1];

    // Prepara el usuario mediante API para no depender del flujo de registro de la interfaz.
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

    // Verifica el código esperado por el contrato de creación de usuarios.
    expect(response.status()).toBe(201);

    return { email: uniqueEmail, password: password };
  }
}