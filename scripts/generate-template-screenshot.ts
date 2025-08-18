import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Get template name from command line arguments
const templateName = process.argv[2] || 'template1';

const sampleData = {
	firstName: 'John',
	lastName: 'Doe',
	role: 'Senior Software Engineer',
	city: 'San Francisco',
	postalCode: '94105',
	phone: '+1 (555) 123-4567',
	email: 'john.doe@email.com',
	aboutMe:
		'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about creating scalable solutions and mentoring junior developers.',
	education: [
		{
			degree: 'Master of Science in Computer Science',
			university: 'Stanford University',
			city: 'Stanford, CA',
			finishDate: '2018',
			description: 'Specialized in Artificial Intelligence and Machine Learning'
		},
		{
			degree: 'Bachelor of Science in Computer Science',
			university: 'University of California, Berkeley',
			city: 'Berkeley, CA',
			finishDate: '2016',
			description: "Dean's List, GPA: 3.9/4.0"
		}
	],
	skills: [
		{ title: 'JavaScript', level: 95 },
		{ title: 'React', level: 90 },
		{ title: 'Node.js', level: 85 },
		{ title: 'AWS', level: 75 }
	],
	workExperience: [
		{
			company: 'TechCorp Inc.',
			jobTitle: 'Senior Software Engineer',
			startDate: '2020',
			endDate: 'Present',
			location: 'San Francisco, CA',
			description:
				'Led development of microservices architecture serving 2M+ users. Mentored 5 junior developers and improved team productivity by 40%.'
		},
		{
			company: 'StartupXYZ',
			jobTitle: 'Full Stack Developer',
			startDate: '2018',
			endDate: '2020',
			location: 'San Francisco, CA',
			description:
				'Built and deployed scalable web applications using React, Node.js, and AWS. Collaborated with cross-functional teams to deliver features on time.'
		}
	],
	linkedin: 'linkedin.com/in/johndoe',
	github: 'github.com/johndoe'
};

async function generateTemplateScreenshot(templateName: string) {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	try {
		const page = await browser.newPage();

		// Set viewport for consistent sizing
		await page.setViewport({ width: 928, height: 1200 });

		// Read the template HTML and CSS
		const templatePath = path.join(process.cwd(), 'public/templates', templateName);
		const htmlPath = path.join(templatePath, `${templateName}.html`);
		const cssPath = path.join(templatePath, `${templateName}.css`);

		// Check if template files exist
		if (!fs.existsSync(htmlPath)) {
			throw new Error(`Template HTML file not found: ${htmlPath}`);
		}
		if (!fs.existsSync(cssPath)) {
			throw new Error(`Template CSS file not found: ${cssPath}`);
		}

		const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
		const cssContent = fs.readFileSync(cssPath, 'utf-8');

		// Replace handlebars variables with sample data
		let processedHtml = htmlContent;

		// Replace simple variables
		Object.entries(sampleData).forEach(([key, value]) => {
			if (typeof value === 'string') {
				processedHtml = processedHtml.replace(new RegExp(`{{${key}}}`, 'g'), value);
			}
		});

		// Replace education array
		const educationHtml = sampleData.education
			.map(
				edu => `
      <div class="dZuYuB">
        <div>
          <span class="education_degree">${edu.degree}</span>
        </div>
        <div>
          <div class="education__university">${edu.university}</div>
        </div>
        <div>
          <div class="education__city">${edu.city}</div>
        </div>
        <div>
          <div class="education__date">${edu.finishDate}</div>
        </div>
        <div>
          <div class="education__description">${edu.description}</div>
        </div>
      </div>
    `
			)
			.join('');
		processedHtml = processedHtml.replace(/\{\{#each education\}\}([\s\S]*?)\{\{\/each\}\}/, educationHtml);

		// Replace skills array
		const skillsHtml = sampleData.skills
			.map(
				skill => `
      <div class="skill-item mb-2">
        <span class="skill-item__name">${skill.title}:</span>
        <div class="bar-container">
          <div class="bar-container__progress" style="width: ${skill.level}%;"></div>
        </div>
      </div>
    `
			)
			.join('');
		processedHtml = processedHtml.replace(/\{\{#each skills\}\}([\s\S]*?)\{\{\/each\}\}/, skillsHtml);

		// Replace work experience array
		const workExperienceHtml = sampleData.workExperience
			.map(
				exp => `
      <div class="enCnDQ">
        <div class="dZuYuB cmdikB">
          <div class="Column-sc-3wzo5k-6 igMrOZ">
            <div class="">
              <span> ${exp.company} </span>
            </div>
            <div class="work-experience__time">
              <div>
                <span>${exp.startDate}&nbsp;-&nbsp;${exp.endDate} </span>
              </div>
              <div>
                <span> ${exp.location} </span>
              </div>
            </div>
          </div>
          <div class="experience-item">
            <div class="work-experience__role">${exp.jobTitle}</div>
            <div class="work-experience__role-description">${exp.description}</div>
          </div>
        </div>
      </div>
    `
			)
			.join('');
		processedHtml = processedHtml.replace(
			/\{\{#each workExperience\}\}([\s\S]*?)\{\{\/each\}\}/,
			workExperienceHtml
		);

		// Create full HTML document
		const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>${templateName} Preview</title>
        <style>
          ${cssContent}
          body {
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
          }
          .cv {
            background-color: rgb(229, 228, 234) !important;
            max-width: 928px;
            margin: 0 auto;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
        </style>
      </head>
      <body>
        ${processedHtml}
      </body>
      </html>
    `;

		// Set the HTML content
		await page.setContent(fullHtml);

		// Wait for content to render
		await new Promise(resolve => setTimeout(resolve, 1000));

		// Take screenshot
		const assetsDir = path.join(process.cwd(), 'src/assets');
		const screenshotPath = path.join(assetsDir, `${templateName}-screenshot.png`);

		// Create assets directory if it doesn't exist
		if (!fs.existsSync(assetsDir)) {
			fs.mkdirSync(assetsDir, { recursive: true });
		}

		await page.screenshot({
			path: screenshotPath,
			fullPage: true
		} as any);

		console.log(`Screenshot saved to: ${screenshotPath}`);
	} catch (error) {
		console.error(`Error generating screenshot for ${templateName}:`, error);
		process.exit(1);
	} finally {
		await browser.close();
	}
}

// Show usage if no template name provided
if (process.argv.length < 3) {
	console.log('Usage: npx tsx scripts/generate-template-screenshot.ts <template-name>');
	console.log('Example: npx tsx scripts/generate-template-screenshot.ts template1');
	console.log('Available templates: template1, template2, template3, template4');
	process.exit(1);
}

generateTemplateScreenshot(templateName).catch(console.error);
