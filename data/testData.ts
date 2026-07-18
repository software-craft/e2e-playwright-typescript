
export const generateUniqueEmail = (prefix = 'user'): string => {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}@softwarecraft.com`;
};