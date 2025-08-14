#!/usr/bin/env node

/**
 * Template Creation Script
 *
 * This script helps you create new resume templates quickly.
 * Usage: node scripts/create-template.js <template-name> <category>
 *
 * Example: node scripts/create-template.js "Executive Summary" professional
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get command line arguments
const templateName = process.argv[2];
const category = process.argv[3];

if (!templateName || !category) {
	console.error('Usage: node scripts/create-template.js <template-name> <category>');
	console.error('Categories: professional, creative, modern, minimal');
	console.error('Example: node scripts/create-template.js "Executive Summary" professional');
	process.exit(1);
}

// Validate category
const validCategories = ['professional', 'creative', 'modern', 'minimal'];
if (!validCategories.includes(category)) {
	console.error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
	process.exit(1);
}

// Generate template ID from name
const templateId = templateName
	.toLowerCase()
	.replace(/[^a-z0-9\s]/g, '')
	.replace(/\s+/g, '-')
	.trim();

// Create template directory
const templateDir = path.join(__dirname, '..', 'public', 'templates', templateId);
if (fs.existsSync(templateDir)) {
	console.error(`Template directory already exists: ${templateDir}`);
	process.exit(1);
}

// Create directory
fs.mkdirSync(templateDir, { recursive: true });

// Generate HTML template
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{firstName}} {{lastName}} - Resume</title>
    <link rel="stylesheet" href="${templateId}.css">
</head>
<body>
    <div class="resume-container">
        <!-- Header Section -->
        <header class="header">
            <div class="header-content">
                <h1 class="name">{{firstName}} {{lastName}}</h1>
                <p class="role">{{role}}</p>
                <div class="contact-info">
                    <div class="contact-item">
                        <span class="icon">📍</span>
                        <span>{{city}}, {{postalCode}}</span>
                    </div>
                    <div class="contact-item">
                        <span class="icon">📧</span>
                        <span>{{email}}</span>
                    </div>
                    <div class="contact-item">
                        <span class="icon">📱</span>
                        <span>{{phone}}</span>
                    </div>
                </div>
                <div class="social-links">
                    {{#if linkedin}}
                    <a href="{{linkedin}}" class="social-link">LinkedIn</a>
                    {{/if}}
                    {{#if github}}
                    <a href="{{github}}" class="social-link">GitHub</a>
                    {{/if}}
                </div>
            </div>
        </header>

        <!-- About Section -->
        {{#if aboutMe}}
        <section class="section">
            <h2 class="section-title">About</h2>
            <div class="about-content">
                <p>{{aboutMe}}</p>
            </div>
        </section>
        {{/if}}

        <!-- Experience Section -->
        {{#if workExperience}}
        <section class="section">
            <h2 class="section-title">Work Experience</h2>
            <div class="experience-list">
                {{#each workExperience}}
                <div class="experience-item">
                    <div class="experience-header">
                        <h3 class="job-title">{{jobTitle}}</h3>
                        <span class="company">{{company}}</span>
                    </div>
                    <div class="experience-meta">
                        <span class="location">{{location}}</span>
                        <span class="dates">{{startDate}} - {{endDate}}</span>
                    </div>
                    <div class="experience-description">
                        <p>{{description}}</p>
                    </div>
                </div>
                {{/each}}
            </div>
        </section>
        {{/if}}

        <!-- Education Section -->
        {{#if education}}
        <section class="section">
            <h2 class="section-title">Education</h2>
            <div class="education-list">
                {{#each education}}
                <div class="education-item">
                    <div class="education-header">
                        <h3 class="degree">{{degree}}</h3>
                        <span class="university">{{university}}</span>
                    </div>
                    <div class="education-meta">
                        <span class="location">{{city}}</span>
                        <span class="date">{{finishDate}}</span>
                    </div>
                    {{#if description}}
                    <div class="education-description">
                        <p>{{description}}</p>
                    </div>
                    {{/if}}
                </div>
                {{/each}}
            </div>
        </section>
        {{/if}}

        <!-- Skills Section -->
        {{#if skills}}
        <section class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-grid">
                {{#each skills}}
                <div class="skill-item">
                    <span class="skill-name">{{title}}</span>
                    <div class="skill-level">
                        <div class="skill-bar" style="width: {{level}}%"></div>
                    </div>
                </div>
                {{/each}}
            </div>
        </section>
        {{/if}}
    </div>
</body>
</html>`;

// Generate CSS template
const cssContent = `/* ${templateName} - ${category.charAt(0).toUpperCase() + category.slice(1)} Design */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #ffffff;
    font-size: 14px;
}

.resume-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
    background: #ffffff;
}

/* Header Section */
.header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 2px solid #f0f0f0;
}

.header-content {
    max-width: 600px;
    margin: 0 auto;
}

.name {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
    letter-spacing: -0.02em;
}

.role {
    font-size: 1.25rem;
    color: #666;
    margin-bottom: 20px;
    font-weight: 500;
}

.contact-info {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #555;
    font-size: 0.9rem;
}

.icon {
    font-size: 1rem;
}

.social-links {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.social-link {
    color: #007acc;
    text-decoration: none;
    font-weight: 500;
    padding: 6px 12px;
    border: 1px solid #007acc;
    border-radius: 20px;
    font-size: 0.85rem;
    transition: all 0.2s ease;
}

.social-link:hover {
    background-color: #007acc;
    color: white;
}

/* Section Styling */
.section {
    margin-bottom: 35px;
}

.section-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
    position: relative;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 40px;
    height: 2px;
    background-color: #007acc;
}

/* About Section */
.about-content p {
    color: #555;
    line-height: 1.7;
    font-size: 0.95rem;
}

/* Experience Section */
.experience-list {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.experience-item {
    padding: 20px;
    background-color: #fafafa;
    border-radius: 8px;
    border-left: 3px solid #007acc;
}

.experience-header {
    margin-bottom: 10px;
}

.job-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
}

.company {
    font-size: 0.95rem;
    color: #007acc;
    font-weight: 500;
}

.experience-meta {
    display: flex;
    gap: 15px;
    margin-bottom: 12px;
    font-size: 0.85rem;
    color: #666;
}

.experience-description p {
    color: #555;
    line-height: 1.6;
    font-size: 0.9rem;
}

/* Education Section */
.education-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.education-item {
    padding: 18px;
    background-color: #fafafa;
    border-radius: 8px;
    border-left: 3px solid #28a745;
}

.education-header {
    margin-bottom: 8px;
}

.degree {
    font-size: 1.05rem;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 4px;
}

.university {
    font-size: 0.9rem;
    color: #28a745;
    font-weight: 500;
}

.education-meta {
    display: flex;
    gap: 15px;
    margin-bottom: 10px;
    font-size: 0.85rem;
    color: #666;
}

.education-description p {
    color: #555;
    line-height: 1.6;
    font-size: 0.9rem;
}

/* Skills Section */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
}

.skill-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.skill-name {
    font-weight: 500;
    color: #1a1a1a;
    font-size: 0.9rem;
}

.skill-level {
    height: 6px;
    background-color: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
}

.skill-bar {
    height: 100%;
    background-color: #007acc;
    border-radius: 3px;
    transition: width 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
    .resume-container {
        padding: 20px 15px;
    }
    
    .name {
        font-size: 2rem;
    }
    
    .contact-info {
        flex-direction: column;
        gap: 10px;
    }
    
    .skills-grid {
        grid-template-columns: 1fr;
    }
    
    .experience-item,
    .education-item {
        padding: 15px;
    }
}

@media (max-width: 480px) {
    .name {
        font-size: 1.75rem;
    }
    
    .role {
        font-size: 1.1rem;
    }
    
    .section-title {
        font-size: 1.25rem;
    }
}

/* Print Styles */
@media print {
    body {
        background-color: white;
        font-size: 12px;
    }
    
    .resume-container {
        max-width: none;
        padding: 20px;
    }
    
    .experience-item,
    .education-item {
        break-inside: avoid;
        background-color: white;
        border: 1px solid #e0e0e0;
    }
    
    .social-link {
        border: none;
        color: #007acc;
    }
}`;

// Generate template registry entry
const registryEntry = `  ${templateId}: {
    id: '${templateId}',
    name: '${templateName}',
    description: '${templateName} - A ${category} resume template.',
    category: '${category}',
    files: {
      html: '/templates/${templateId}/${templateId}.html',
      css: '/templates/${templateId}/${templateId}.css'
    },
    preview: '${templateId}',
    tags: ['${category}', 'resume', 'template'],
    isActive: true,
    features: ['${category} design', 'Professional layout', 'Responsive']
  }`;

// Write files
fs.writeFileSync(path.join(templateDir, `${templateId}.html`), htmlContent);
fs.writeFileSync(path.join(templateDir, `${templateId}.css`), cssContent);

console.log(`✅ Template "${templateName}" created successfully!`);
console.log(`📁 Directory: ${templateDir}`);
console.log(`📄 Files created:`);
console.log(`   - ${templateId}.html`);
console.log(`   - ${templateId}.css`);
console.log(`\n📝 Next steps:`);
console.log(`1. Add this entry to src/templates/index.ts:`);
console.log(`\n${registryEntry}`);
console.log(`\n2. Customize the HTML and CSS files as needed`);
console.log(`3. Test the template in your application`);
console.log(`\n🎨 You can now customize the design by editing the CSS file!`);
