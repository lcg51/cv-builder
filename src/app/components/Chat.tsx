'use client';
import React from 'react';
import { useState } from 'react';

import { Button, InputText } from '@/components/ui';

import { ChatGPTRoleType, getCompletion } from '@/app/server-actions/getCompletion';

interface Message {
	role: ChatGPTRoleType;
	content: string;
}

export default function Chat() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [message, setMessage] = useState('');

	const onClick = async () => {
		const completions = await getCompletion([
			...messages,
			{
				role: 'user',
				content: message
			}
		]);
		setMessage('');
		setMessages(completions.messages);
	};

	return (
		<div className="flex flex-col">
			{messages.map((message, i) => (
				<div key={i} className={`mb-5 flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
					<div
						className={`${
							message.role === 'user' ? 'bg-blue-500' : 'bg-gray-500 text-black'
						} rounded-md py-2 px-8`}
					>
						{message.content}
					</div>
				</div>
			))}
			<div className="flex border-t-2 border-t-gray-500 pt-3 mt-3">
				<InputText
					placeholder="Question"
					name="message"
					defaultValue={message}
					type="text"
					testID="chatInput"
					onChange={(value: string) => setMessage(value)}
				/>
				<Button onClick={onClick} className="ml-3 text-xl">
					Send
				</Button>
			</div>
		</div>
	);
}
