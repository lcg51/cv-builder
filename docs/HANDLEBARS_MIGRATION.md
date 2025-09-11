# Handlebars Template System Migration Guide

## 🎯 **Overview**

Your resume template system has been upgraded to use **Handlebars templates** instead of separate HTML and CSS files. This provides several benefits:

-   **Single file templates** - HTML and CSS are now combined in `.hbs` files
-   **Better templating** - More powerful and flexible than simple string replacement
-   **Custom helpers** - Built-in functions for formatting dates, skill levels, etc.
-   **Easier maintenance** - One file per template instead of two
-   **Better syntax** - Cleaner template syntax with proper loops and conditionals

## 🚀 **What's New**

### **Template Structure**

```
Before: /public/templates/template1/
├── template1.html
└── template1.css

Now: /public/templates/template1/
└── template1.hbs  (HTML + CSS combined)
```

### **Template Registry**

```typescript
// Before
files: {
  html: '/templates/template1/template1.html',
  css: '/templates/template1/template1.css'
}

// Now
files: {
  handlebars: '/templates/template1/template1.hbs'
}
```

### **Template Previewer Usage**

```typescript
// Before
<TemplatePreviewer
  userData={userData}
  templateHTML={htmlContent}
  templateStyles={cssContent}
/>

// Now
<TemplatePreviewer
  userData={userData}
  templateId="template1"
  useHandlebars={true}
/>
```

## 🔧 **Migration Steps**

### **Step 1: Convert Existing Templates**

Use the conversion script to automatically convert your existing templates:

```bash
# Convert template2 to Handlebars
node scripts/convert-to-handlebars.js template2

# Convert template3 to Handlebars
node scripts/convert-to-handlebars.js template3
```

### **Step 2: Update Template Registry**

After conversion, update your template registry in `src/templates/index.ts`:

```typescript
template2: {
  // ... other properties
  files: {
    handlebars: '/templates/template2/template2.hbs'  // Updated path
  },
  // ... rest of properties
}
```

### **Step 3: Test Templates**

Test your converted templates with the new system:

```typescript
<TemplatePreviewer
  userData={userData}
  templateId="template2"
  useHandlebars={true}
/>
```

## 📝 **Handlebars Syntax**

### **Basic Variables**

```handlebars
{{firstName}}
{{lastName}}
{{role}}
{{email}}
```

### **Conditional Blocks**

```handlebars
{{#if aboutMe}}
	<section>
		<p>{{aboutMe}}</p>
	</section>
{{/if}}

{{#if linkedin}}
	<a href='{{linkedin}}'>LinkedIn</a>
{{/if}}
```

### **Loop Blocks**

```handlebars
{{#each workExperience}}
	<div class='experience-item'>
		<h3>{{jobTitle}}</h3>
		<span>{{company}}</span>
		<p>{{description}}</p>
	</div>
{{/each}}
```

### **Custom Helpers**

```handlebars
<!-- Date formatting -->
{{formatDate startDate 'MMM yyyy'}}

<!-- Skill level conversion -->
<div style='width: {{skillLevel level}}%'></div>

<!-- Array joining -->
{{join skills ', '}}
```

## 🛠 **Custom Helpers Available**

### **formatDate(date, format)**

Formats dates in various formats:

-   `'MMM yyyy'` → "Jan 2024"
-   `'PPP'` → "January 15, 2024"

### **skillLevel(level)**

Converts skill level (1-5) to percentage (20-100):

-   `{{skillLevel 3}}` → `60`

### **ifNotEmpty(value)**

Conditional block that only renders if value exists and is not empty:

```handlebars
{{#ifNotEmpty description}}
	<p>{{description}}</p>
{{/ifNotEmpty}}
```

### **join(array, separator)**

Joins array elements with a separator:

```handlebars
{{join tags ', '}} <!-- "React, Node.js, TypeScript" -->
```

## 📁 **File Organization**

### **Current Structure**

```
src/
├── lib/
│   ├── handlebarsProcessor.ts    # New Handlebars processor
│   └── templateProcessor.ts      # Legacy processor (still supported)
├── templates/
│   └── index.ts                 # Updated template registry
└── app/
    └── components/
        └── TemplatePreviewer/
            ├── TemplatePreviewer.tsx    # Updated to support Handlebars
            └── HandlebarsDemo.tsx       # Demo component
```

### **Template Files**

```
public/templates/
├── template1/
│   └── template1.hbs            # Converted to Handlebars
├── template2/
│   └── template2.hbs            # Converted to Handlebars
├── template3/
│   └── template3.hbs            # Converted to Handlebars
└── template4/
    └── template4.hbs            # Already in Handlebars format
```

## 🔄 **Backward Compatibility**

The old system is still supported for existing code:

```typescript
// Legacy usage still works
<TemplatePreviewer
  userData={userData}
  templateHTML={htmlContent}
  templateStyles={cssContent}
/>

// New Handlebars usage
<TemplatePreviewer
  userData={userData}
  templateId="template1"
  useHandlebars={true}
/>
```

## 🧪 **Testing**

## 📚 **Creating New Templates**

### **Manual Creation**

1. Create a new folder: `public/templates/template5/`
2. Create `template5.hbs` with HTML + embedded CSS
3. Add entry to `src/templates/index.ts`

### **Using Conversion Script**

```bash
# Convert existing template
node scripts/convert-to-handlebars.js template5
```

## 🎨 **Template Design Tips**

### **CSS Organization**

-   Keep CSS organized in logical sections
-   Use CSS variables for consistent theming
-   Include responsive design and print styles

### **Handlebars Best Practices**

-   Use meaningful variable names
-   Leverage conditional blocks for optional content
-   Use custom helpers for complex formatting
-   Keep templates readable and well-commented

## 🚨 **Common Issues & Solutions**

### **Template Not Loading**

-   Check file paths in template registry
-   Ensure `.hbs` file exists
-   Verify `useHandlebars={true}` is set

### **Styles Not Applying**

-   Check CSS is properly embedded in `<style>` tags
-   Verify CSS selectors match HTML structure
-   Check for CSS syntax errors

### **Variables Not Replacing**

-   Ensure variable names match user data structure
-   Check Handlebars syntax (double curly braces)
-   Verify custom helpers are properly registered

## 🔮 **Future Enhancements**

-   **Template Editor** - Visual template builder
-   **Theme System** - Dynamic color schemes
-   **Layout Engine** - Drag-and-drop template creation
-   **Export Options** - Multiple output formats
-   **Template Marketplace** - Community templates

## 📞 **Support**

If you encounter issues:

1. Check the browser console for errors
2. Verify template file paths and syntax
3. Test with the demo component
4. Review the Handlebars documentation

## 🎉 **Benefits of Migration**

-   **Easier Maintenance** - One file per template
-   **Better Performance** - Single file loading
-   **Cleaner Code** - No more string replacement
-   **More Features** - Custom helpers and better syntax
-   **Future-Proof** - Industry-standard templating engine

---

**Happy templating! 🎨✨**
