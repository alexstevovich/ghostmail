import { describe, it, expect } from 'vitest';
import ghostmail from '../src/index.js';

describe('Ghostmail ESM Tests', () => {
    it('Generates correct obfuscated email', () => {
        const email = 'example.email@gmail.com';
        const seed = 987654;
        const inline = ghostmail(email, seed);
        expect(typeof inline).toBe('string');
    });

    it('Different seeds produce different obfuscations', () => {
        const email = 'test@example.com';
        const obfuscated1 = ghostmail(email, 12345);
        const obfuscated2 = ghostmail(email, 67890);
        expect(obfuscated1).not.toBe(obfuscated2);
    });
});
