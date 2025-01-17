'use client';
import { Button } from '@/components/ui';
import Image from 'next/image';
import { loginBG } from '../../assets';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function Home() {
	const { push } = useRouter();

	const onClick = useCallback(() => {
		push('/resume/create');
	}, []);

	return (
		<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
			<div className="h-screen flex justify-center">
				<div className="flex flex-col gap-4 p-4 lg:p-6">
					<h1 className="text-4xl font-bold uppercase">Use the best CV generator</h1>

					<p>
						Unlock your career potential with CV generator, the cutting-edge CV app designed to streamline
						your job application process. Whether you&apos;re a seasoned professional or just starting your
						career journey, CV generator empowers you to create polished, professional resumes that stand
						out.
					</p>

					<h2 className="text-2xl font-bold">Key Features</h2>

					<ul>
						<li className="pb-4">
							<span className="font-bold">Easy Template Selection:</span> Choose from a wide range of
							professionally designed templates tailored to different industries and career stages.
						</li>
						<li className="pb-4">
							<span className="font-bold">Customization Options:</span>
							Personalize your CV with customizable sections for skills, experience, education, and more.
							Effortlessly rearrange sections to highlight your strengths.
						</li>
						<li className="pb-4">
							<span className="font-bold">Instant Preview:</span> See how your CV looks in real-time as
							you edit, ensuring it&apos;s visually appealing and easy to read.
						</li>
						<li className="pb-4">
							<span className="font-bold">Export and Share:</span> Export your CV as a PDF or share it
							directly via email, messaging apps, or cloud storage, making it convenient to apply for jobs
							on the go.
						</li>
						<li className="pb-4">
							<span className="font-bold">Guided Editing:</span> Receive tips and suggestions for
							improving your CV content and formatting based on industry standards.
						</li>
					</ul>

					<h2 className="text-2xl font-bold">Why Choose CV generator?</h2>

					<ul>
						<li className="pb-4">
							<span className="font-bold">User-Friendly Interface:</span> Intuitive design that makes
							creating a CV straightforward and enjoyable.
						</li>
						<li className="pb-4">
							<span className="font-bold">Career Guidance:</span> Access to articles and resources on CV
							writing, job hunting tips, and interview preparation.
						</li>
						<li className="pb-4">
							<span className="font-bold">Regular Updates:</span> Stay ahead with regular updates that
							include new templates and features. Whether you&apos;re applying for your dream job or
							updating your CV for a career change, CV generator is your go-to tool for crafting a
							standout resume. Download CV generator today and take the next step towards your
							professional success.
						</li>
					</ul>

					<Button variant="default" size="lg" onClick={onClick}>
						Start creating your CV
					</Button>
				</div>
			</div>
			<div className="hidden bg-muted lg:block">
				<Image
					src={loginBG}
					alt="Image"
					width="1920"
					height="1080"
					className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}
