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
 * file_name: src/index.cjs
 * purpose: Contains the ESM functionality and export.
 *  
 * @system
 *
 * generated_on: 2025-03-08T00:42:15.940Z
 * certified_version: 1.0.1
 * file_uuid: c38ad2f7-d01a-4983-bf2a-5b06d9c99c3c
 * file_size: 3991 bytes
 * file_hash: 050ab6b2a9de65c70f71246aa5240c8174a6879724347e5a22bdd40766f2092a
 * mast_hash: 588896f935687f0bc549e99eff9926ea86fefed43f5870819bcc27c91c2390d6
 *  
 *
********************************************************/
function getRandomFromSeed(seed, index, min, max) {
    let value = (seed ^ (index * 0x45d9f3b)) >>> 0; // XOR with a prime
    value = (value ^ (value >> 16)) & 0xffffffff; // Mix
    return min + (value % (max - min + 1));
}
function getDerivedRandomHrefViableEscapeCode(seed, index) {
    return ['&#8203;', '&#8288;'][getRandomFromSeed(seed, index, 0, 1)];
}
function obfuscateCharacter(char, seed, index) {
    const alternatives = {
        '@': ['&#64;', '&#x40;', '&#x00040;'],
        '.': ['&#46;', '&#x2E;', '&#x0002E;'],
    };
    return char in alternatives
        ? alternatives[char][
              getRandomFromSeed(seed, index, 0, alternatives[char].length - 1)
          ]
        : `&#${char.charCodeAt(0)};`;
}
function zwsEncodeArray(email, seed, options = {}) {
    const addZeroWidthSpaces = options.addZeroWidthSpaces ?? true;
    return email.split('').map((char, index) => {
        let encoded = obfuscateCharacter(char, seed, index);
        return addZeroWidthSpaces
            ? encoded + getDerivedRandomHrefViableEscapeCode(seed, index)
            : encoded;
    });
}
function seededRandom(seed) {
    seed = (seed * 48271) % 0x7fffffff;
    return seed / 0x7fffffff;
}
function deriveFromSeed(seed, min, max) {
    return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}
function inlineObfuscate(email, seed, options = {}) {
    if (typeof email !== 'string' || !email.includes('@')) {
        throw new Error('Invalid email format');
    }
    let encodedArray = zwsEncodeArray(email, seed, options);
    const atIndex = email.indexOf('@');
    const posBeforeAt = deriveFromSeed(seed, 1, atIndex - 1);
    const posAfterAt = deriveFromSeed(seed + 1, atIndex + 1, email.length - 1);
    const classBeforeAt = `${deriveFromSeed(seed, 100000, 999999)}`;
    const classAfterAt = `${deriveFromSeed(seed + 2, 100000, 999999)}`;
    const hiddenCharBeforeAt = `&#${deriveFromSeed(seed, 33, 126)};`;
    const hiddenCharAfterAt = `&#${deriveFromSeed(seed + 3, 33, 126)};`;
    let seedIncrementer = 0;
    function generateStyle() {
        return `display:none !important;`;
    }
    function randomizeAttributes(className, hiddenChar) {
        return `<span class="${className}" aria-hidden="true" style="display:none !important;">${hiddenChar}</span>`;
    }
    encodedArray[posBeforeAt] += randomizeAttributes(
        classBeforeAt,
        hiddenCharBeforeAt,
    );
    encodedArray[posAfterAt] += randomizeAttributes(
        classAfterAt,
        hiddenCharAfterAt,
    );
    return encodedArray.join('');
}
// CommonJS Export
module.exports = inlineObfuscate;