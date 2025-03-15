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
			`
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            ${styles}
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>`,
			{ waitUntil: 'networkidle0' }
		);

		const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

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
