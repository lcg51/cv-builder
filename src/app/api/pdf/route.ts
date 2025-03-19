import puppeteer from 'puppeteer';

// app/api/hello/route.ts
export async function POST(req: Request) {
	try {
		const { html, styles } = await req.json();
		if (!html)
			return new Response(JSON.stringify({ error: 'HTML content is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});

		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setContent(
			`<html>
				<head>
				<script src="https://cdn.tailwindcss.com"></script>
				<style>
					html, body {
						margin: 0;
						padding: 0;
						width: 210mm;
						height: 297mm;
						overflow: hidden;
					}
					.cv {
						display: flex;
						width: 100%;
                        height: 100%; /* Ensure it fills the A4 page */
					}
					${styles}
				</style>
				</head>
				<body>
					<div class="cv">
						${html}
					</div>
				</body>
			</html>`,
			{ waitUntil: 'networkidle0' }
		);

		const contentHeightPx = await page.evaluate(() => document.body.scrollHeight);

		console.log('Page height:', contentHeightPx);

		const pdfBuffer = await page.pdf({
			format: 'A4',
			printBackground: true,
			width: '210mm',
			height: '297mm'
		});

		await browser.close();

		return new Response(pdfBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename=resume.pdf'
			}
		});
	} catch (error) {
		console.error('PDF generation error:', error);
		return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
