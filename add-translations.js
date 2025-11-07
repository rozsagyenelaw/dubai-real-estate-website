#!/usr/bin/env node

/**
 * Automated Translation Attribute Adder
 *
 * This script automatically adds data-i18n attributes to HTML elements
 * by matching their text content with translation keys in translations.js
 */

const fs = require('fs');
const path = require('path');

// Read translations.js and extract English translations
function loadTranslations() {
    const translationsPath = path.join(__dirname, 'js', 'translations.js');
    const content = fs.readFileSync(translationsPath, 'utf8');

    // Extract the English translations object
    const enMatch = content.match(/en:\s*\{([\s\S]*?)\n\s*\},\s*ar:/);
    if (!enMatch) {
        console.error('Could not find English translations');
        process.exit(1);
    }

    const translations = {};
    const enSection = enMatch[1];

    // Parse translation entries: 'key': 'value',
    const regex = /'([^']+)':\s*'([^']+)'/g;
    let match;

    while ((match = regex.exec(enSection)) !== null) {
        const key = match[1];
        const value = match[2].replace(/\\'/g, "'"); // Unescape single quotes
        translations[key] = value;
    }

    console.log(`Loaded ${Object.keys(translations).length} translation keys`);
    return translations;
}

// Process HTML file
function processHTMLFile(filePath, translations) {
    console.log(`\nProcessing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changes = 0;

    // Build a reverse lookup: value -> key
    const valueToKey = {};
    for (const [key, value] of Object.entries(translations)) {
        valueToKey[value] = key;
    }

    // Sort by length (longest first) to match more specific strings first
    const sortedValues = Object.keys(valueToKey).sort((a, b) => b.length - a.length);

    // Find and replace text in HTML tags
    for (const value of sortedValues) {
        const key = valueToKey[value];

        // Skip very short values to avoid false matches
        if (value.length < 3) continue;

        // Escape special regex characters
        const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Pattern to match: >text< where text matches our translation value
        // and the element doesn't already have data-i18n
        const patterns = [
            // Match exact text in tags without data-i18n
            new RegExp(`(<(?:h[1-6]|p|span|a|button|th|td|label|strong|li)(?![^>]*data-i18n)[^>]*>)\\s*${escapedValue}\\s*(<)`, 'gi'),
            // Match text with trailing punctuation
            new RegExp(`(<(?:h[1-6]|p|span|a|button|th|td|label|strong|li)(?![^>]*data-i18n)[^>]*>)\\s*${escapedValue}([.:!?]*)\\s*(<)`, 'gi')
        ];

        for (const pattern of patterns) {
            const newContent = content.replace(pattern, (match, openTag, closeOrPunct, close) => {
                // Don't replace if already has data-i18n
                if (openTag.includes('data-i18n')) {
                    return match;
                }

                changes++;
                // Insert data-i18n attribute before closing >
                const modifiedTag = openTag.replace(/>$/, ` data-i18n="${key}">`);

                // Handle the case with punctuation
                if (close) {
                    return `${modifiedTag}${value}${closeOrPunct || ''}${close}`;
                } else {
                    return `${modifiedTag}${value}${closeOrPunct}<`;
                }
            });

            if (newContent !== content) {
                content = newContent;
                modified = true;
            }
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ Added ${changes} data-i18n attributes`);
        return changes;
    } else {
        console.log('  No changes needed');
        return 0;
    }
}

// Main execution
function main() {
    console.log('=== Automated Translation Attribute Adder ===\n');

    const translations = loadTranslations();

    // Get all HTML files
    const htmlFiles = fs.readdirSync(__dirname)
        .filter(file => file.endsWith('.html') && file !== 'property-oceanz-tower-2.html')
        .map(file => path.join(__dirname, file));

    console.log(`Found ${htmlFiles.length} HTML files to process\n`);

    let totalChanges = 0;
    for (const file of htmlFiles) {
        totalChanges += processHTMLFile(file, translations);
    }

    console.log(`\n=== Summary ===`);
    console.log(`Total files processed: ${htmlFiles.length}`);
    console.log(`Total data-i18n attributes added: ${totalChanges}`);
    console.log('\nDone! ✨');
}

main();
