'use client';
import { Button } from '@/components/ui';
import Image from 'next/image';
import { loginBG } from '../../assets';

export default function Home() {
	return (
		<div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
			<div className="h-screen flex justify-center">
				<div className="flex flex-col gap-4 p-4 lg:p-6">
					<h1 className="text-4xl font-bold">Use the best CV generator</h1>

					<p>
						Unlock your career potential with CV generator, the cutting-edge CV app designed to streamline
						your job application process. Whether you&apos;re a seasoned professional or just starting your
						career journey, CV generator empowers you to create polished, professional resumes that stand
						out.
					</p>

					<h2 className="text-2xl font-bold">Key Features</h2>

					<p>
						Easy Template Selection: Choose from a wide range of professionally designed templates tailored
						to different industries and career stages. Customization Options: Personalize your CV with
						customizable sections for skills, experience, education, and more. Effortlessly rearrange
						sections to highlight your strengths. Instant Preview: See how your CV looks in real-time as you
						edit, ensuring it&apos;s visually appealing and easy to read. Export and Share: Export your CV
						as a PDF or share it directly via email, messaging apps, or cloud storage, making it convenient
						to apply for jobs on the go. Guided Editing: Receive tips and suggestions for improving your CV
						content and formatting based on industry standards. Offline Access: Work on your CV anytime,
						anywhere, even without an internet connection. Secure Cloud Backup: Safeguard your CV with
						automatic cloud backup, ensuring you never lose your progress.
					</p>

					<h2 className="text-2xl font-bold">Why Choose CV generator?</h2>

					<p>
						User-Friendly Interface: Intuitive design that makes creating a CV straightforward and
						enjoyable. Career Guidance: Access to articles and resources on CV writing, job hunting tips,
						and interview preparation. Regular Updates: Stay ahead with regular updates that include new
						templates and features. Whether you&apos;re applying for your dream job or updating your CV for
						a career change, [App Name] is your go-to tool for crafting a standout resume. Download [App
						Name] today and take the next step towards your professional success.
					</p>

					<Button variant="destructive" size="lg">
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
