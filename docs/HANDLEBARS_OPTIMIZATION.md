# Handlebars Template Optimization

## Problem

The `TemplatePreviewer` component was calling `processHandlebarsTemplate` every time `userData` changed, which caused the Handlebars template to be recompiled on every input change. This was inefficient and caused unnecessary performance overhead.

## Solution

Implemented a two-phase approach:

### Phase 1: Template Compilation (Once)

-   **When**: Template changes (templateId or templateHTML changes)
-   **What**: Compile the Handlebars template once using `Handlebars.compile()`
-   **Result**: A compiled template function that can be reused

### Phase 2: Data Processing (Reused)

-   **When**: User data changes
-   **What**: Use the pre-compiled template function with new data
-   **Result**: Fast template rendering without recompilation

## Implementation Details

### New Functions Added

#### `compileHandlebarsTemplate(templateId)`

-   Compiles a template from template ID once
-   Returns `{ template: function, css: string }`
-   Template function can be reused with different user data

#### `compileHandlebarsTemplateFromContent(templateContent)`

-   Compiles a template from HTML content string once
-   Returns a reusable template function

#### `compileCompleteHandlebarsTemplate(templateId)`

-   Loads template content and compiles it
-   Returns compiled template function and CSS

### TemplatePreviewer Changes

1. **State Management**: Added `compiledTemplate` state to store the compiled template function
2. **Template Compilation**: Template is compiled once when template changes
3. **Data Processing**: Uses compiled template function for data updates
4. **Performance**: No more recompilation on every user input change

## Benefits

-   ✅ **Performance**: Template compilation happens only once
-   ✅ **Responsiveness**: Faster template updates on data changes
-   ✅ **Efficiency**: Reduced CPU usage during form input
-   ✅ **Scalability**: Better performance with complex templates

## Console Logging

The optimization includes console logging to help debug:

-   🔄 `Compiling Handlebars template...` - When template compilation starts
-   ✅ `Template compiled from templateId/templateHTML` - When compilation completes
-   ⚡ `Processing template with user data (using compiled template)` - When using compiled template

## Usage

The optimization is automatically applied when `useHandlebars={true}` is set on the `TemplatePreviewer` component. No changes are needed in consuming components.
