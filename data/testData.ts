export const generateUniqueEmail = (prefix = 'user'): string => {
  // Tiempo y aleatoriedad evitan colisiones / Timestamp and randomness prevent collisions.
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}@softwarecraft.com`;
};
