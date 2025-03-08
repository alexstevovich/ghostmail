import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    js.configs.recommended, // <--- This adds standard JS best practices
    {
        files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
        ignores: ['node_modules', 'dist', 'build', '.internal'],

        languageOptions: {
            ecmaVersion: 2022, // ⬅️ UPDATED HERE
            sourceType: 'module',
            globals: {
                console: true,
                process: true,
                // Add others like global, Buffer, etc., if needed
            },
        },
        plugins: {
            prettier: prettierPlugin,
        },

        rules: {
            'prettier/prettier': 'error',
            'padding-line-between-statements': [
                'error',
                { blankLine: 'always', prev: '*', next: 'return' },
                {
                    blankLine: 'always',
                    prev: ['const', 'let', 'var'],
                    next: 'function',
                },
                { blankLine: 'always', prev: 'function', next: 'function' },
                { blankLine: 'always', prev: 'import', next: '*' },
                { blankLine: 'any', prev: 'import', next: 'import' },
                { blankLine: 'always', prev: '*', next: 'export' },
            ],
        },
    },
];
