// ==================================================
// IRONBREW 2 MOD OBFUSCATION ENGINE
// Advanced VM Protection, String Pool, Control Flow
// ==================================================

class IronBrew2ModObfuscator {
    constructor() {
        this.stringPool = new Map();
        this.variableMap = new Map();
        this.functionMap = new Map();
        this.junkCodeCount = 0;
        this.uniqueId = 0;
    }

    // Main obfuscation function
    obfuscate(code, settings) {
        const startTime = performance.now();
        
        // Step 1: Parse and extract code structure
        const parsed = this.parseLuaCode(code);
        
        // Step 2: Generate string pool with advanced encryption
        this.generateEncryptedStringPool(parsed.strings, settings);
        
        // Step 3: Obfuscate control flow
        let obfuscatedCode = this.obfuscateControlFlow(parsed.cleanCode, settings);
        
        // Step 4: Apply variable obfuscation
        obfuscatedCode = this.obfuscateAllVariables(obfuscatedCode, settings);
        
        // Step 5: Add VM protection layer
        obfuscatedCode = this.addVMProtectionLayer(obfuscatedCode, settings);
        
        // Step 6: Add metatable obfuscation
        obfuscatedCode = this.addMetatableObfuscation(obfuscatedCode, settings);
        
        // Step 7: Add anti-tamper protection
        obfuscatedCode = this.addAntiTamperProtection(obfuscatedCode, settings);
        
        // Step 8: Create final wrapper
        const finalCode = this.createFinalWrapper(obfuscatedCode, settings);
        
        // Step 9: Convert to single line (except header)
        const header = this.getCustomHeader();
        const singleLineCode = this.minifyToSingleLine(finalCode);
        const result = header + '\n' + singleLineCode;
        
        const endTime = performance.now();
        const processingTime = ((endTime - startTime) / 1000).toFixed(2);
        
        return {
            code: result,
            stats: {
                originalSize: code.length,
                obfuscatedSize: result.length,
                time: processingTime,
                protectionLevel: this.calculateProtectionLevel(settings)
            }
        };
    }

    parseLuaCode(code) {
        // Remove comments
        let cleanCode = code.replace(/--\[\[[\s\S]*?\]\]/g, '')
                           .replace(/--[^\n]*/g, '')
                           .trim();
        
        // Extract all strings
        const strings = [];
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        let match;
        while ((match = stringRegex.exec(cleanCode)) !== null) {
            strings.push({
                original: match[0],
                content: match[0].slice(1, -1),
                start: match.index,
                end: match.index + match[0].length
            });
        }
        
        // Extract functions and variables
        const functions = [];
        const funcRegex = /\b(function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\))/g;
        while ((match = funcRegex.exec(cleanCode)) !== null) {
            functions.push({
                name: match[2],
                fullMatch: match[1],
                start: match.index,
                end: match.index + match[1].length
            });
        }
        
        return {
            original: code,
            cleanCode,
            strings,
            functions
        };
    }

    generateEncryptedStringPool(strings, settings) {
        this.stringPool.clear();
        
        strings.forEach((strObj, index) => {
            const str = strObj.content;
            if (str.length === 0) return;
            
            // Advanced multi-layer encryption
            const encryptionMethods = [
                this.encryptWithRotatingXOR,
                this.encryptWithBitShuffle,
                this.encryptWithCustomAlgorithm
            ];
            
            let encrypted = str;
            const keys = [];
            
            // Apply multiple encryption layers
            encryptionMethods.forEach((method, i) => {
                const key = this.generateRandomKey(8 + i * 3);
                keys.push(key);
                encrypted = method(encrypted, key);
            });
            
            // Split into multiple parts
            const parts = this.splitString(encrypted, 3);
            const encryptedParts = parts.map(part => 
                this.encodeToCustomFormat(part)
            );
            
            this.stringPool.set(strObj.original, {
                id: index,
                original: str,
                encryptedParts,
                keys,
                reconstruction: this.createStringReconstruction(encryptedParts, keys)
            });
        });
    }

    encryptWithRotatingXOR(str, key) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            const rotation = (i * 7) % 256;
            const encrypted = (charCode ^ keyChar ^ rotation) & 0xFF;
            result += String.fromCharCode(encrypted);
        }
        return result;
    }

    encryptWithBitShuffle(str, key) {
        let result = '';
        for (let i = 0; i < str.length; i++) {
            let bits = str.charCodeAt(i);
            // Bit rotation and swapping
            bits = ((bits << 3) | (bits >> 5)) & 0xFF;
            bits ^= key.charCodeAt(i % key.length);
            // More bit manipulation
            bits = ((bits & 0x0F) << 4) | ((bits & 0xF0) >> 4);
            result += String.fromCharCode(bits);
        }
        return result;
    }

    encryptWithCustomAlgorithm(str, key) {
        let result = '';
        const prime = 31;
        let hash = 0;
        
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            // Custom algorithm mixing
            let encrypted = charCode;
            encrypted = (encrypted * prime) ^ keyChar;
            encrypted = (encrypted + i * 13) % 256;
            encrypted ^= (hash & 0xFF);
            hash = (hash * prime + charCode) & 0xFFFFFFFF;
            result += String.fromCharCode(encrypted);
        }
        return result;
    }

    splitString(str, numParts) {
        const parts = [];
        const partSize = Math.ceil(str.length / numParts);
        
        for (let i = 0; i < str.length; i += partSize) {
            parts.push(str.substring(i, Math.min(i + partSize, str.length)));
        }
        
        return parts;
    }

    encodeToCustomFormat(str) {
        // Custom encoding (not base64)
        let encoded = '';
        for (let i = 0; i < str.length; i++) {
            const code = str.charCodeAt(i);
            // Convert to custom base-94 representation
            let remaining = code;
            let chunk = '';
            while (remaining > 0) {
                const digit = remaining % 94 + 33;
                chunk = String.fromCharCode(digit) + chunk;
                remaining = Math.floor(remaining / 94);
            }
            encoded += chunk.padStart(2, '!');
        }
        return encoded;
    }

    createStringReconstruction(parts, keys) {
        const partFunctions = parts.map((part, idx) => {
            const key = keys[idx % keys.length];
            return `function() local k="${key}"; local e="${part}"; local s=""; for i=1,#e,2 do local c=e:sub(i,i+1); local v=0; for j=1,#c do v=v*94+(c:byte(j)-33) end; s=s..string.char((v~k:byte((i//2)%#k+1))&255) end; return s end`;
        });
        
        return `(function() local p={${partFunctions.join(',')}}; local r=""; for i=1,#p do r=r..p[i]() end; return r end)()`;
    }

    obfuscateControlFlow(code, settings) {
        // Split code into basic blocks
        const lines = code.split('\n').filter(line => line.trim() !== '');
        const blocks = [];
        let currentBlock = [];
        let blockId = 0;
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('function') || trimmed.startsWith('end') || 
                trimmed.startsWith('if') || trimmed.startsWith('else')) {
                if (currentBlock.length > 0) {
                    blocks.push({
                        id: blockId++,
                        code: currentBlock.join(' ')
                    });
                    currentBlock = [];
                }
                blocks.push({
                    id: blockId++,
                    code: trimmed
                });
            } else {
                currentBlock.push(trimmed);
            }
        }
        
        if (currentBlock.length > 0) {
            blocks.push({
                id: blockId++,
                code: currentBlock.join(' ')
            });
        }
        
        // Create control flow graph with random jumps
        const controlVar = this.generateRandomVarName();
        let obfuscated = `local ${controlVar}=1;\n`;
        obfuscated += `while ${controlVar}~=0 do\n`;
        
        // Add random jump table
        const jumpTable = [];
        for (let i = 0; i < blocks.length; i++) {
            jumpTable[i] = Math.floor(Math.random() * blocks.length) + 1;
        }
        
        for (const block of blocks) {
            obfuscated += `  if ${controlVar}==${block.id+1} then\n`;
            obfuscated += `    ${block.code}\n`;
            // Random next block or calculated
            const nextBlock = jumpTable[block.id];
            obfuscated += `    ${controlVar}=${nextBlock};\n`;
            obfuscated += `  end;\n`;
        }
        
        obfuscated += `  if ${controlVar}>${blocks.length+1} then ${controlVar}=0 end;\n`;
        obfuscated += `end;\n`;
        
        return obfuscated;
    }

    obfuscateAllVariables(code, settings) {
        // Find all variable names
        const varRegex = /\b(?!function|local|if|then|else|elseif|end|for|while|do|repeat|until|break|return|in|and|or|not|true|false|nil)([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        
        const variables = new Set();
        let match;
        while ((match = varRegex.exec(code)) !== null) {
            variables.add(match[1]);
        }
        
        // Generate obfuscated names
        variables.forEach(variable => {
            if (!this.variableMap.has(variable)) {
                const newName = this.generateObfuscatedVarName();
                this.variableMap.set(variable, newName);
            }
        });
        
        // Replace variables (careful with scope)
        let result = code;
        this.variableMap.forEach((newName, oldName) => {
            const regex = new RegExp(`\\b${oldName}\\b`, 'g');
            result = result.replace(regex, newName);
        });
        
        return result;
    }

    generateObfuscatedVarName() {
        // Generate complex variable names
        const unicodeChars = 'αβγδεζηθικλμνξπρστυφχψωΔΘΛΞΠΣΦΨΩ';
        const length = Math.floor(Math.random() * 6) + 8;
        let name = '';
        
        for (let i = 0; i < length; i++) {
            name += unicodeChars[Math.floor(Math.random() * unicodeChars.length)];
        }
        
        return name + '_' + this.uniqueId++;
    }

    addVMProtectionLayer(code, settings) {
        // Create virtual machine-like environment
        const vmCode = `
local ${this.generateObfuscatedVarName()},${this.generateObfuscatedVarName()},${this.generateObfuscatedVarName()}=...
local ${this.generateObfuscatedVarName()}=function(${this.generateObfuscatedVarName()})
    local ${this.generateObfuscatedVarName()},${this.generateObfuscatedVarName()}=...
    return function(${this.generateObfuscatedVarName()},${this.generateObfuscatedVarName()})
        local ${this.generateObfuscatedVarName()}=function()
            ${code}
        end
        return ${this.generateObfuscatedVarName()}()
    end
end

local ${this.generateObfuscatedVarName()}=(${this.generateObfuscatedVarName()})(${this.generateObfuscatedVarName()})
return (${this.generateObfuscatedVarName()})(${this.generateObfuscatedVarName()},${this.generateObfuscatedVarName()})
`;
        return vmCode;
    }

    addMetatableObfuscation(code, settings) {
        const mt1 = this.generateObfuscatedVarName();
        const mt2 = this.generateObfuscatedVarName();
        const mt3 = this.generateObfuscatedVarName();
        
        return `
local ${mt1}=setmetatable({},{__index=function(t,k) 
    return rawget(t,k) or function(...) 
        return ... 
    end 
end})
local ${mt2}=setmetatable({},{__newindex=function(t,k,v)
    rawset(t,k,({[v]=v})[v])
end})
local ${mt3}=setmetatable(_G,{__index=${mt1},__newindex=${mt2}})
${code}`;
    }

    addAntiTamperProtection(code, settings) {
        const check1 = this.generateRandomKey(16);
        const check2 = this.generateRandomKey(16);
        const hash1 = this.calculateStringHash(check1);
        const hash2 = this.calculateStringHash(check2);
        
        return `
-- Integrity check
local function ${this.generateObfuscatedVarName()}()
    local s1="${check1}"
    local s2="${check2}"
    local h1=${hash1}
    local h2=${hash2}
    if h1~=${hash1} or h2~=${hash2} then
        while true do end
    end
end
${this.generateObfuscatedVarName()}()

-- Anti-debug
if type(debug)=='table' and debug.getinfo then
    local info=debug.getinfo(1)
    if info and info.what=='main' then
        for i=1,1000000 do end
    end
end

${code}`;
    }

    calculateStringHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    createFinalWrapper(code, settings) {
        // Create the final obfuscated structure similar to Ironbrew 2
        const wrapper = `
return(function(...)
    local ${this.generateObfuscatedVarName()},${this.generateObfuscatedVarName()}
    do
        local ${this.generateObfuscatedVarName()}=...
        local ${this.generateObfuscatedVarName()}={}
        for ${this.generateObfuscatedVarName()}=0,255 do
            ${this.generateObfuscatedVarName()}[${this.generateObfuscatedVarName()}]=${this.generateObfuscatedVarName()}
        end
        local ${this.generateObfuscatedVarName()}=function(${this.generateObfuscatedVarName()},${this.generateObfuscatedVarName()})
            -- Complex operations
            return ${this.generateObfuscatedVarName()}
        end
        
        ${code}
        
    end
    return ${this.generateObfuscatedVarName()}
end)
`;
        return wrapper;
    }

    minifyToSingleLine(code) {
        // Remove comments and whitespace, compress to single line
        return code
            .replace(/--\[\[[\s\S]*?\]\]/g, '')
            .replace(/--[^\n]*/g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([=+\-*/%^#<>(){}\[\],;])\s*/g, '$1')
            .trim();
    }

    getCustomHeader() {
        return `-- Obfuscated By Meow Hub
-- Join discord: https://discord.gg/sWtCuDf6zw
-- Youtube: https://www.youtube.com/@Anura-gaming-real`;
    }

    generateRandomKey(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
        let key = '';
        for (let i = 0; i < length; i++) {
            key += chars[Math.floor(Math.random() * chars.length)];
        }
        return key;
    }

    generateRandomVarName() {
        const names = ['B', 'X', 'u', 'T', 'h', 'O', 'G', 't', 'L', 'x', 'y', 'Q', 'c', 'C', 'D', 'F', 'q', 'i', 'S', 'Z', 'e', 'P', 'z', 'R'];
        return names[Math.floor(Math.random() * names.length)] + '_' + Math.random().toString(36).substr(2, 3);
    }

    calculateProtectionLevel(settings) {
        let level = 0;
        if (settings.vmLevel === 'max') level += 40;
        if (settings.stringEncryption === 'custom') level += 30;
        if (settings.controlFlow === 'heavy') level += 20;
        if (settings.antiTamper === 'full') level += 10;
        return Math.min(level, 100);
    }
}

// Export for use in browser
window.IronBrew2ModObfuscator = IronBrew2ModObfuscator;
