import { NextResponse } from 'next/server';
import { LaunchOptions } from 'puppeteer-core';

const isDevelopment = process.env.NODE_ENV === 'development';

type Puppeteer = typeof import('puppeteer-core') | typeof import('puppeteer');

// app/api/hello/route.ts
export async function POST(req: Request) {
	let puppeteer: Puppeteer;
	let launchOptions: LaunchOptions = {
		headless: true
	};

	try {
		if (!isDevelopment) {
			const chromium = (await import('@sparticuz/chromium')).default;
			puppeteer = await import('puppeteer-core');
			launchOptions = {
				...launchOptions,
				args: chromium.args,
				executablePath: await chromium.executablePath()
			};
		} else {
			puppeteer = await import('puppeteer');
		}

		const { html, styles } = await req.json();
		if (!html)
			return new NextResponse(JSON.stringify({ error: 'HTML content is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const browser = await puppeteer.launch(launchOptions as any);

		const page = await browser.newPage();
		await page.setContent(
			`<html>
				<head>
				<style>
					@page {
						size: A4;
						margin: 0;
					}

					html, body {
						margin: 0;
						padding: 0;
						width: 210mm;
						height: 297mm;
						overflow: hidden;
					}

					.cv {
						width: 210mm;
						height: 297mm;
						display: block; /* NOT flex */
						overflow: hidden;
					}
					.cv-header {
						width: 100%;
					}

					.cv-body {
						display: flex; 
						width: 100%;
						height: calc(297mm - var(--header-height, 95mm));
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

		const pdfBuffer = await page.pdf({
			format: 'A4',
			printBackground: true,
			width: '210mm',
			height: '297mm'
		});

		await browser.close();

		return new NextResponse(Buffer.from(pdfBuffer), {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename=resume.pdf'
			}
		});
	} catch (error) {
		console.error('PDF generation error:', error);
		return new NextResponse(JSON.stringify({ error: (error as Error).message || 'Failed to generate PDF' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
}
