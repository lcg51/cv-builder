# Scripts Directory

This directory contains utility scripts for the Next.js CMS project.

## 🎨 Template Conversion Scripts

### `convert-to-handlebars.ts`

Converts existing HTML/CSS templates to Handlebars format with embedded styles.

#### Features

-   **TypeScript** - Full type safety and modern ES6+ syntax
-   **Automatic Conversion** - Converts variable placeholders and loop blocks
-   **CSS Embedding** - Automatically inserts CSS into HTML `<style>` tags
-   **Error Handling** - Comprehensive error handling and validation
-   **Modular Design** - Can be imported and used programmatically

#### Usage

```bash
# Using npm script (recommended)
npm run convert-to-handlebars template2

# Using yarn
yarn convert-to-handlebars template3

# Direct execution with ts-node
npx ts-node scripts/convert-to-handlebars.ts template1
```

#### What It Converts

**Variable Placeholders:**

-   `{{firstName}}` → `{{firstName}}`
-   `{{lastName}}` → `{{lastName}}`
-   `{{role}}` → `{{role}}`
-   And more...

**Loop Blocks:**

-   `{{#each education}}...{{/each}}` with proper variable mapping
-   `{{#each skills}}...{{/each}}` with skill level conversion
-   `{{#each workExperience}}...{{/each}}` with date formatting

**CSS Integration:**

-   Automatically extracts CSS from separate files
-   Embeds CSS into HTML `<style>` tags
-   Maintains all styling and responsive design

#### Example Output

```bash
✅ Successfully converted template2 to Handlebars format!
📁 New file: /path/to/public/templates/template2/template2.hbs

📝 Next steps:
1. Update your template registry to use the new .hbs file
2. Test the template with useHandlebars={true}
3. You can now delete the old .html and .css files

🎨 The template now uses Handlebars syntax with embedded CSS!
```

#### Programmatic Usage

```typescript
import { convertTemplate, type ConversionOptions } from './scripts/convert-to-handlebars';

const options: ConversionOptions = {
	templateId: 'template5',
	templateDir: '/path/to/templates/template5',
	htmlFile: '/path/to/templates/template5/template5.html',
	cssFile: '/path/to/templates/template5/template5.css',
	hbsFile: '/path/to/templates/template5/template5.hbs'
};

const result = convertTemplate(options);
if (result.success) {
	console.log(`Template converted: ${result.filePath}`);
} else {
	console.error(`Conversion failed: ${result.message}`);
}
```

## 🔧 Other Scripts

### `convert-images-optimized.ts`

Optimizes images for web use with various formats and sizes.

```bash
npm run convert-images
```

## 📁 File Structure

```
scripts/
├── README.md                           # This file
├── convert-to-handlebars.ts           # Template conversion script
├── convert-images-optimized.ts        # Image optimization script
└── convert-to-handlebars.js           # Legacy JavaScript version
```

## 🚀 Development

### Prerequisites

-   Node.js 18+
-   TypeScript 5+
-   ts-node (for running TypeScript directly)

### Adding New Scripts

1. Create your script in TypeScript (`.ts` extension)
2. Add a corresponding npm script in `package.json`
3. Update this README with usage instructions
4. Ensure proper error handling and type safety

### Script Guidelines

-   Use TypeScript for all new scripts
-   Include comprehensive error handling
-   Add JSDoc comments for functions
-   Export types and interfaces for reuse
-   Include usage examples in comments

## 🐛 Troubleshooting

### Common Issues

**Script not found:**

```bash
# Ensure ts-node is installed
npm install -D ts-node

# Check script exists in package.json
npm run convert-to-handlebars --help
```

**Permission denied:**

```bash
# Make script executable
chmod +x scripts/convert-to-handlebars.ts
```

**TypeScript errors:**

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Run with verbose output
npx ts-node --transpile-only scripts/convert-to-handlebars.ts template1
```

### Getting Help

1. Check the script output for error messages
2. Verify file paths and permissions
3. Ensure all dependencies are installed
4. Check TypeScript configuration in `tsconfig.json`

---

**Happy scripting! 🎯✨**
