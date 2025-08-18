import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const templates = ['template1', 'template2', 'template3', 'template4'];

async function generateAllScreenshots() {
	console.log('Generating screenshots for all templates...\n');

	for (const template of templates) {
		try {
			console.log(`Generating screenshot for ${template}...`);
			execSync(`npx tsx scripts/generate-template-screenshot.ts ${template}`, {
				stdio: 'inherit',
				cwd: process.cwd()
			});
			console.log(`✅ ${template} screenshot generated successfully\n`);
		} catch (error) {
			console.error(`❌ Failed to generate screenshot for ${template}:`, error);
		}
	}

	console.log('🎉 All template screenshots generated!');

	// List generated files
	const assetsDir = path.join(process.cwd(), 'src/app/assets');
	const files = fs.readdirSync(assetsDir).filter(file => file.includes('-screenshot.png'));

	if (files.length > 0) {
		console.log('\nGenerated screenshots:');
		files.forEach(file => console.log(`  - ${file}`));
	}
}

generateAllScreenshots().catch(console.error);
