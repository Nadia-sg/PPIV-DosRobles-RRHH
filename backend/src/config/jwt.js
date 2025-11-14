// Usar getter para asegurar que se lee el valor actualizado de process.env
export const getJwtSecret = () => process.env.JWT_SECRET || "tu_clave_secreta_super_segura";
export const JWT_EXPIRES_IN = "24h";

// Para compatibilidad con código existente
export const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_super_segura";
