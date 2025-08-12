import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../src/assets');
const outputDir = path.join(__dirname, '../src/assets');

async function convertToWebP(): Promise<void> {
	try {
		// Read all JPG files in the assets directory
		const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg'));

		if (files.length === 0) {
			console.log('❌ No JPG files found in src/assets directory');
			return;
		}

		console.log(`Found ${files.length} JPG files to convert:`);
		console.log('');

		for (const file of files) {
			const inputPath = path.join(inputDir, file);
			const outputPath = path.join(outputDir, file.replace('.jpg', '.webp'));

			console.log(`🔄 Converting ${file} to WebP...`);

			try {
				// Get original file size
				const originalSize = fs.statSync(inputPath).size;

				// Convert to WebP with aggressive compression
				await sharp(inputPath)
					.webp({
						quality: 70, // Lower quality for better compression
						effort: 6, // Maximum compression effort
						nearLossless: false, // Disable for better compression
						lossless: false, // Ensure lossy compression
						smartSubsample: true, // Better compression
						mixed: false // Disable mixed mode
					})
					.toFile(outputPath);

				// Get WebP file size
				const webpSize = fs.statSync(outputPath).size;

				// Calculate savings
				const savings = (((originalSize - webpSize) / originalSize) * 100).toFixed(1);

				if (webpSize < originalSize) {
					console.log(`✅ ${file} -> ${file.replace('.jpg', '.webp')}`);
					console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
					console.log(`   WebP: ${(webpSize / 1024 / 1024).toFixed(2)} MB`);
					console.log(`   Savings: ${savings}% 🎉`);
				} else {
					console.log(`⚠️  ${file} -> ${file.replace('.jpg', '.webp')}`);
					console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
					console.log(`   WebP: ${(webpSize / 1024 / 1024).toFixed(2)} MB`);
					console.log(`   ⚠️  WebP is larger! Trying more aggressive compression...`);

					// Try more aggressive compression
					await sharp(inputPath)
						.webp({
							quality: 50, // Much lower quality
							effort: 6,
							nearLossless: false,
							lossless: false,
							smartSubsample: true,
							mixed: false
						})
						.toFile(outputPath + '.tmp');

					const aggressiveSize = fs.statSync(outputPath + '.tmp').size;

					if (aggressiveSize < originalSize) {
						fs.renameSync(outputPath + '.tmp', outputPath);
						const finalSavings = (((originalSize - aggressiveSize) / originalSize) * 100).toFixed(1);
						console.log(`   ✅ Aggressive compression successful: ${finalSavings}% savings`);
					} else {
						// If still larger, remove the WebP file and keep original
						fs.unlinkSync(outputPath);
						fs.unlinkSync(outputPath + '.tmp');
						console.log(`   ❌ WebP conversion failed - keeping original JPG`);
					}
				}

				console.log('');
			} catch (conversionError) {
				console.log(
					`❌ Failed to convert ${file}: ${conversionError instanceof Error ? conversionError.message : 'Unknown error'}`
				);
				console.log('');
			}
		}

		console.log('🎉 Conversion process completed!');
	} catch (error) {
		console.error('❌ Error during conversion process:', error);
	}
}

// Run the conversion
convertToWebP();
