const NodeCache = require('node-cache');

/**
 * Instancia de caché con un tiempo de vida por defecto de 1 hora (3600 segundos).
 * Cambia el TTL según tus necesidades.
 */
const cache = new NodeCache({ stdTTL: 3600 });

/**
 * Obtiene un valor del caché.
 * @param {string} key - Clave del dato a recuperar.
 * @returns {*} El valor almacenado en el caché o `null` si no existe.
 */
function get(key) {
    const value = cache.get(key);
    return value !== undefined ? value : null;
}

/**
 * Establece un valor en el caché con un TTL opcional.
 * @param {string} key - Clave para almacenar el dato.
 * @param {*} value - Valor a almacenar.
 * @param {number} [ttl] - Tiempo de vida en segundos (opcional).
 */
function set(key, value, ttl) {
    if (ttl) {
        cache.set(key, value, ttl);
    } else {
        cache.set(key, value);
    }
}

/**
 * Elimina un valor del caché.
 * @param {string} key - Clave del dato a eliminar.
 */
function del(key) {
    cache.del(key);
}

/**
 * Limpia todo el caché.
 */
function flush() {
    cache.flushAll();
}

/**
 * Obtiene las estadísticas del caché para monitoreo.
 * @returns {Object} Estadísticas del caché.
 */
function getStats() {
    return cache.getStats();
}

module.exports = { get, set, del, flush, getStats };
