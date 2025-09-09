import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { usePathname, useRouter } from 'next/navigation';
import { TopBar, TopBarProps } from './TopBar';
import { UserProps } from '@/lib/models';
import { googleSignOut } from '../../../../app/server-actions/session';
import { useBrowserBackNavigation } from '@/hooks/useBrowserBackNavigation';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
	usePathname: jest.fn(),
	useRouter: jest.fn()
}));

// Mock the browser back navigation hook
jest.mock('@/hooks/useBrowserBackNavigation', () => ({
	useBrowserBackNavigation: jest.fn()
}));

// Mock server actions
jest.mock('../../../../app/server-actions/session', () => ({
	googleSignOut: jest.fn()
}));

// Mock CSS imports
jest.mock('../TopBar.css', () => ({}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
	Button: ({ children, onClick, className, variant, size, ...props }: any) => (
		<button onClick={onClick} className={className} data-variant={variant} data-size={size} {...props}>
			{children}
		</button>
	)
}));

jest.mock('@/components/ui/avatar', () => ({
	Avatar: ({ children }: any) => <div data-testid="avatar">{children}</div>,
	AvatarImage: ({ src, alt, onError }: any) => (
		<img src={src} alt={alt} onError={onError} data-testid="avatar-image" />
	),
	AvatarFallback: ({ children }: any) => <div data-testid="avatar-fallback">{children}</div>
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
	DropdownMenu: ({ children }: any) => <div data-testid="dropdown-menu">{children}</div>,
	DropdownMenuContent: ({ children, align }: any) => (
		<div data-testid="dropdown-content" data-align={align}>
			{children}
		</div>
	),
	DropdownMenuItem: ({ children, onClick }: any) => (
		<button onClick={onClick} data-testid="dropdown-item">
			{children}
		</button>
	),
	DropdownMenuLabel: ({ children }: any) => <div data-testid="dropdown-label">{children}</div>,
	DropdownMenuSeparator: () => <div data-testid="dropdown-separator" />,
	DropdownMenuTrigger: ({ children, asChild }: any) => (
		<div data-testid="dropdown-trigger" data-as-child={asChild}>
			{children}
		</div>
	)
}));

// Mock Link component
jest.mock('next/link', () => {
	return ({ children, href }: any) => (
		<a href={href} data-testid="link">
			{children}
		</a>
	);
});

// Test data
const mockUser: UserProps = {
	id: '1',
	name: 'John Doe',
	email: 'john.doe@example.com',
	phone: '+1234567890',
	role: 'user',
	image: 'https://lh3.googleusercontent.com/a/default-user'
};

const mockUserWithoutImage: UserProps = {
	id: '2',
	name: 'Jane Smith',
	email: 'jane.smith@example.com',
	phone: '+1234567891',
	role: 'user',
	image: ''
};

const mockUserWithoutName: UserProps = {
	id: '3',
	name: '',
	email: 'user@example.com',
	phone: '+1234567892',
	role: 'user',
	image: 'https://example.com/avatar.jpg'
};

describe('TopBar Component', () => {
	const mockPush = jest.fn();
	const mockTriggerNavigationEvent = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue({ push: mockPush });
		(useBrowserBackNavigation as jest.Mock).mockReturnValue({
			triggerNavigationEvent: mockTriggerNavigationEvent
		});
		(usePathname as jest.Mock).mockReturnValue('/');
	});

	afterEach(() => {
		cleanup();
	});

	describe('Rendering', () => {
		it('should render TopBar with logo when no user is provided', () => {
			render(<TopBar user={null} />);

			expect(screen.getByAltText('CV Builder Logo')).toBeInTheDocument();
			expect(screen.getByText('Sign In')).toBeInTheDocument();
			expect(screen.getByTestId('link')).toHaveAttribute('href', '/login');
		});

		it('should render TopBar with user avatar when user is provided', () => {
			render(<TopBar user={mockUser} />);

			expect(screen.getByAltText('CV Builder Logo')).toBeInTheDocument();
			expect(screen.getByTestId('avatar')).toBeInTheDocument();
			expect(screen.getByTestId('avatar-image')).toHaveAttribute(
				'src',
				'https://lh3.googleusercontent.com/a/default-user'
			);
			expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD');
		});

		it('should render user email in dropdown label', () => {
			render(<TopBar user={mockUser} />);

			expect(screen.getByTestId('dropdown-label')).toHaveTextContent('john.doe@example.com');
		});

		it('should render logout button in dropdown', () => {
			render(<TopBar user={mockUser} />);

			expect(screen.getByText('Logout')).toBeInTheDocument();
		});
	});

	describe('User Avatar Fallback', () => {
		it('should show first two capital letters for user with full name', () => {
			render(<TopBar user={mockUser} />);

			expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD');
		});

		it('should show first letter for user with single name', () => {
			const singleNameUser = { ...mockUser, name: 'John' };
			render(<TopBar user={singleNameUser} />);

			expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('J');
		});

		it('should show "U" for user without name', () => {
			render(<TopBar user={mockUserWithoutName} />);

			expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('U');
		});

		it('should show "U" for user with null name', () => {
			const nullNameUser = { ...mockUser, name: null };
			render(<TopBar user={nullNameUser as unknown as UserProps} />);

			expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('U');
		});
	});

	describe('Navigation', () => {
		it('should navigate to home when logo is clicked on non-template page', () => {
			(usePathname as jest.Mock).mockReturnValue('/');
			render(<TopBar user={mockUser} />);

			const logo = screen.getByAltText('CV Builder Logo').closest('div');
			fireEvent.click(logo!);

			expect(mockPush).toHaveBeenCalledWith('/');
			expect(mockTriggerNavigationEvent).not.toHaveBeenCalled();
		});

		it('should trigger navigation event when logo is clicked on template detail page', () => {
			(usePathname as jest.Mock).mockReturnValue('/templates/123e4567-e89b-12d3-a456-426614174000');
			render(<TopBar user={mockUser} />);

			const logo = screen.getByAltText('CV Builder Logo').closest('div');
			fireEvent.click(logo!);

			expect(mockTriggerNavigationEvent).toHaveBeenCalledWith('/');
			expect(mockPush).not.toHaveBeenCalled();
		});

		it('should not trigger navigation event for template list page', () => {
			(usePathname as jest.Mock).mockReturnValue('/templates');
			render(<TopBar user={mockUser} />);

			const logo = screen.getByAltText('CV Builder Logo').closest('div');
			fireEvent.click(logo!);

			expect(mockPush).toHaveBeenCalledWith('/');
			expect(mockTriggerNavigationEvent).not.toHaveBeenCalled();
		});
	});

	describe('Sign Out Functionality', () => {
		it('should call googleSignOut when logout button is clicked', async () => {
			const user = userEvent.setup();
			(usePathname as jest.Mock).mockReturnValue('/current-page');
			render(<TopBar user={mockUser} />);

			const logoutButton = screen.getByText('Logout');
			await user.click(logoutButton);

			expect(googleSignOut).toHaveBeenCalledWith('/current-page');
		});
	});

	describe('Avatar Image Error Handling', () => {
		it('should handle avatar image load error', () => {
			render(<TopBar user={mockUser} />);

			const avatarImage = screen.getByTestId('avatar-image');
			const mockEvent = {
				currentTarget: {
					style: { display: 'block' }
				}
			};

			fireEvent.error(avatarImage, mockEvent);

			expect(mockEvent.currentTarget.style.display).toBe('block');
		});

		it('should log error when avatar image fails to load', () => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
			render(<TopBar user={mockUser} />);

			const avatarImage = screen.getByTestId('avatar-image');
			const mockEvent = {
				currentTarget: {
					style: { display: 'block' }
				}
			};

			fireEvent.error(avatarImage, mockEvent);

			expect(consoleSpy).toHaveBeenCalledWith(
				'Avatar image failed to load:',
				'https://lh3.googleusercontent.com/a/default-user'
			);

			consoleSpy.mockRestore();
		});
	});

	describe('Accessibility', () => {
		it('should have proper ARIA labels and roles', () => {
			render(<TopBar user={mockUser} />);

			expect(screen.getByText('Toggle user menu')).toBeInTheDocument();
			expect(screen.getByAltText('CV Builder Logo')).toBeInTheDocument();
			expect(screen.getByAltText('John Doe')).toBeInTheDocument();
		});

		it('should have proper alt text for user avatar', () => {
			render(<TopBar user={mockUser} />);

			expect(screen.getByAltText('John Doe')).toBeInTheDocument();
		});

		it('should have fallback alt text when user name is not available', () => {
			render(<TopBar user={mockUserWithoutName} />);

			expect(screen.getByAltText('User avatar')).toBeInTheDocument();
		});
	});

	describe('Component Structure', () => {
		it('should have correct CSS classes for header', () => {
			render(<TopBar user={mockUser} />);

			const header = screen.getByRole('banner');
			expect(header).toHaveClass(
				'flex',
				'justify-between',
				'sticky',
				'top-0',
				'z-40',
				'h-14',
				'items-center',
				'gap-4',
				'bg-white',
				'dark:bg-slate-900',
				'px-4',
				'lg:h-[60px]',
				'lg:px-6',
				'topbar-header'
			);
		});

		it('should have correct CSS classes for logo container', () => {
			render(<TopBar user={mockUser} />);

			const logoContainer = screen.getByAltText('CV Builder Logo').closest('div');
			expect(logoContainer).toHaveClass(
				'logo-container',
				'text-lg',
				'font-semibold',
				'text-foreground',
				'hover:text-muted-foreground',
				'transition-colors',
				'cursor-pointer'
			);
		});
	});

	describe('Edge Cases', () => {
		it('should handle undefined user prop', () => {
			render(<TopBar user={undefined} />);

			expect(screen.getByText('Sign In')).toBeInTheDocument();
			expect(screen.queryByTestId('avatar')).not.toBeInTheDocument();
		});
	});

	describe('Template Detail Page Detection', () => {
		afterEach(() => {
			(useBrowserBackNavigation as jest.Mock).mockReturnValue({
				triggerNavigationEvent: mockTriggerNavigationEvent
			});
		});
		it('should correctly identify template detail pages with valid UUID', () => {
			const validUuidPaths = [
				'/templates/123e4567-e89b-12d3-a456-426614174000',
				'/templates/550e8400-e29b-41d4-a716-446655440000/edit',
				'/templates/6ba7b810-9dad-11d1-80b4-00c04fd430c8/preview'
			];

			validUuidPaths.forEach(path => {
				(usePathname as jest.Mock).mockReturnValue(path);
				render(<TopBar user={mockUser} />);

				const logo = screen.getByAltText('CV Builder Logo').closest('div');
				fireEvent.click(logo!);

				expect(mockTriggerNavigationEvent).toHaveBeenCalledWith('/');
				expect(mockPush).not.toHaveBeenCalled();

				// Clean up DOM and mocks for next iteration
				cleanup();
				jest.clearAllMocks();
			});
		});

		it('should not identify non-template pages as template detail pages', () => {
			const nonTemplatePaths = [
				'/',
				'/about',
				'/contact',
				'/templates',
				'/templates/invalid-uuid',
				'/templates/123'
			];

			nonTemplatePaths.forEach(path => {
				(usePathname as jest.Mock).mockReturnValue(path);
				render(<TopBar user={mockUser} />);

				const logo = screen.getByAltText('CV Builder Logo').closest('div');
				fireEvent.click(logo!);

				expect(mockPush).toHaveBeenCalledWith('/');
				expect(mockTriggerNavigationEvent).not.toHaveBeenCalled();

				// Clean up DOM and mocks for next iteration
				cleanup();
				jest.clearAllMocks();
			});
		});
	});
});
