/********************************************************
 * ghostmail
 * 
 * ~ All the secrets of the world worth knowing
 *                       are hiding in plain sight.
 *                              — Robin Sloan
 *  
 * @license
 * 
 * Apache-2.0
 * 
 * Copyright 2018-2025 Alex Stevovich
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * @meta
 *
 * package_name: ghostmail
 * file_name: src/index.mjs
 * purpose: Contains the CommonJS functionality and export.
 *  
 * @system
 *
 * generated_on: 2025-03-08T00:42:15.946Z
 * certified_version: 1.0.1
 * file_uuid: 19c0a487-11fc-4be8-8b8b-0049fee7fc7f
 * file_size: 6323 bytes
 * file_hash: b9fc4991f9705654098334c2937e9b6a560672b6d3c6169a6dd826f62a3c6144
 * mast_hash: 12c406e7da7a39e694109a6cef092795cef65da729bee40003848c48d84131e4
 *  
 *
********************************************************/
function getRandomFromSeed(seed, index, min, max) {
    let value = (seed ^ (index * 0x45d9f3b)) >>> 0; // XORing with a prime (optimized)
    value = (value ^ (value >> 16)) & 0xffffffff; // Improved mixing
    return min + (value % (max - min + 1)); // Ensuring range
}
function getDerivedRandomHrefViableEscapeCode(seed, index) {
    return ['&#8203;', '&#8288;'][getRandomFromSeed(seed, index, 0, 1)];
}
function obfuscateCharacter(char, seed, index) {
    const alternatives = {
        '@': ['&#64;', '&#x40;', '&#x00040;'], // Different Unicode forms
        '.': ['&#46;', '&#x2E;', '&#x0002E;'], // Similar encoding variations
    };
    return char in alternatives
        ? alternatives[char][
              getRandomFromSeed(seed, index, 0, alternatives[char].length - 1)
          ]
        : `&#${char.charCodeAt(0)};`;
}
/*
function zwsObfuscate(email, seed, options = {}) {
    const addZeroWidthSpaces =
        'addZeroWidthSpaces' in options ? options.addZeroWidthSpaces : true;
    return email
        .split('')
        .map((char, index) => {
            let encoded = obfuscateCharacter(char, seed, index); // Use improved obfuscation
            return addZeroWidthSpaces
                ? encoded + getDerivedRandomHrefViableEscapeCode(seed, index)
                : encoded;
        })
        .join('');
}
*/
function zwsEncodeArray(email, seed, options = {}) {
    const addZeroWidthSpaces =
        'addZeroWidthSpaces' in options ? options.addZeroWidthSpaces : true;
    return email.split('').map((char, index) => {
        let encoded = obfuscateCharacter(char, seed, index); // Use improved obfuscation
        return addZeroWidthSpaces
            ? encoded + getDerivedRandomHrefViableEscapeCode(seed, index)
            : encoded;
    });
}
function seededRandom(seed) {
    seed = (seed * 48271) % 0x7fffffff;
    return seed / 0x7fffffff;
}
// Generate deterministic values from seed
function deriveFromSeed(seed, min, max) {
    return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}
export function inlineObfuscate(email, seed, options = {}) {
    if (typeof email !== 'string' || email.indexOf('@') === -1) {
        throw new Error('Invalid email format');
    }
    // Step 1: Generate encoded characters
    let encodedArray = zwsEncodeArray(email, seed, options);
    // Step 2: Derive positions for inserting spans
    const atIndex = email.indexOf('@');
    const posBeforeAt = deriveFromSeed(seed, 1, atIndex - 1);
    const posAfterAt = deriveFromSeed(seed + 1, atIndex + 1, email.length - 1);
    const classBeforeAt = `${deriveFromSeed(seed, 100000, 999999)}`;
    const classAfterAt = `${deriveFromSeed(seed + 2, 100000, 999999)}`;
    const hiddenCharBeforeAt = `&#${deriveFromSeed(seed, 33, 126)};`;
    const hiddenCharAfterAt = `&#${deriveFromSeed(seed + 3, 33, 126)};`;
    let seedIncrementer = 0;
    function randomizeSpacing() {
        const value = getRandomFromSeed(seed, seedIncrementer++, 0, 2);
        return ' '.repeat(value);
    }
    function generateStyle() {
        const displayOptions = ['block', 'inline-block', 'flex'];
        const randomDisplay =
            displayOptions[
                getRandomFromSeed(
                    seed,
                    seedIncrementer++,
                    0,
                    displayOptions.length - 1,
                )
            ];
        const hasExtraDisplay =
            getRandomFromSeed(seed, seedIncrementer++, 0, 1) === 1; // 50% chance to include extra display property
        if (hasExtraDisplay) {
            return `display:${randomizeSpacing()}${randomDisplay};${randomizeSpacing()}display:${randomizeSpacing()}none !important;`;
        } else {
            return `display:${randomizeSpacing()}none !important;`; // No extra display property
        }
    }
    const styleBeforeAt = generateStyle(seedIncrementer++);
    const styleAfterAt = generateStyle(seedIncrementer++);
    function randomizeAttributes(seedOffset, className, style, hiddenChar) {
        const attributes = new Map([
            ['class', `"${className}"`],
            ['aria-hidden', `"true"`],
            ['style', `"${style}"`],
        ]);
        // Shuffle attributes randomly
        const shuffled = [...attributes.entries()].sort(() =>
            getRandomFromSeed(seedOffset, 0, -1, 1),
        );
        return `<span ${shuffled.map(([k, v]) => `${k}=${v}`).join(' ')}>${hiddenChar}</span>`;
    }
    // Step 5: Insert hidden spans in the encoded array
    encodedArray[posBeforeAt] += randomizeAttributes(
        seedIncrementer++,
        classBeforeAt,
        styleBeforeAt,
        hiddenCharBeforeAt,
    );
    encodedArray[posAfterAt] += randomizeAttributes(
        seedIncrementer++,
        classAfterAt,
        styleAfterAt,
        hiddenCharAfterAt,
    );
    // Step 6: Assemble final obfuscated string
    return encodedArray.join('');
}
export default inlineObfuscate;