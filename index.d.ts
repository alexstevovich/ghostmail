declare module "index" {
    /**
     * Obfuscates an email by injecting invisible spans and encoding characters.
     *
     * @param {string} email - The email address to obfuscate.
     * @param {number} seed - The seed for deterministic randomness.
     * @param {{ addZeroWidthSpaces?: boolean }} [options={}] - Configuration options.
     * @returns {string} The obfuscated email as an inline-safe HTML string.
     * @throws {Error} If the email format is invalid.
     */
    export function inlineObfuscate(email: string, seed: number, options?: {
        addZeroWidthSpaces?: boolean;
    }): string;
    export default inlineObfuscate;
}
