export const generateUniqueEmail = (prefix = 'user'): string => {
  // Combina prefijo, hora y aleatoriedad para reducir colisiones entre pruebas.
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}@softwarecraft.com`;
};
