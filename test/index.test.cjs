import { describe, it, expect } from 'vitest';
const inlineObfuscate = require('../src/index.cjs');

describe('Ghostmail CJS Tests', () => {
    it('Generates correct obfuscated email', () => {
        const email = 'example.email@gmail.com';
        const seed = 987654;
        const inline = inlineObfuscate(email, seed);
        expect(typeof inline).toBe('string');
    });

    it('Different seeds produce different obfuscations', () => {
        const email = 'test@example.com';
        const obfuscated1 = inlineObfuscate(email, 12345);
        const obfuscated2 = inlineObfuscate(email, 67890);
        expect(obfuscated1).not.toBe(obfuscated2);
    });
});
