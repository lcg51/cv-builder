import '@testing-library/jest-dom';

// ─── ResizeObserver ───────────────────────────────────────────────────────────
// Used by: @radix-ui/react-slider, tabs, dialog, dropdown-menu, popover
global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn()
}));

// ─── IntersectionObserver ─────────────────────────────────────────────────────
// Used by: various Radix floating UI internals
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
	root: null,
	rootMargin: '',
	thresholds: [],
	takeRecords: jest.fn(() => [])
}));

// ─── window.matchMedia ────────────────────────────────────────────────────────
// Used by: @radix-ui/react-dialog, dropdown-menu, popover (responsive breakpoints)
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated but still called by some libs
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn()
	}))
});

// ─── DOMRect ──────────────────────────────────────────────────────────────────
// Used by: Radix floating/positioning logic (popover, dropdown-menu, tooltip)
class DOMRectStub implements DOMRect {
	x = 0;
	y = 0;
	width = 0;
	height = 0;
	top = 0;
	right = 0;
	bottom = 0;
	left = 0;
	toJSON() {
		return JSON.stringify(this);
	}
	static fromRect(rect?: DOMRectInit): DOMRect {
		return Object.assign(new DOMRectStub(), rect ?? {});
	}
}
global.DOMRect = DOMRectStub as unknown as typeof DOMRect;

// ─── PointerEvent ─────────────────────────────────────────────────────────────
// Used by: @radix-ui/react-slider (drag), dropdown-menu, dialog (dismiss on pointer down)
class PointerEventStub extends MouseEvent implements PointerEvent {
	readonly pointerId: number;
	readonly pressure: number;
	readonly tangentialPressure: number;
	readonly tiltX: number;
	readonly tiltY: number;
	readonly twist: number;
	readonly width: number;
	readonly height: number;
	readonly pointerType: string;
	readonly isPrimary: boolean;
	readonly altitudeAngle: number;
	readonly azimuthAngle: number;

	constructor(type: string, options: PointerEventInit = {}) {
		super(type, options);
		this.pointerId = options.pointerId ?? 1;
		this.pressure = options.pressure ?? 0;
		this.tangentialPressure = options.tangentialPressure ?? 0;
		this.tiltX = options.tiltX ?? 0;
		this.tiltY = options.tiltY ?? 0;
		this.twist = options.twist ?? 0;
		this.width = options.width ?? 1;
		this.height = options.height ?? 1;
		this.pointerType = options.pointerType ?? 'mouse';
		this.isPrimary = options.isPrimary ?? true;
		this.altitudeAngle = 0;
		this.azimuthAngle = 0;
	}

	getCoalescedEvents(): PointerEvent[] {
		return [];
	}
	getPredictedEvents(): PointerEvent[] {
		return [];
	}
}
global.PointerEvent = PointerEventStub as unknown as typeof PointerEvent;

// ─── Element pointer capture & scroll ────────────────────────────────────────
// Used by: @radix-ui/react-slider (setPointerCapture during drag)
//          Radix focus management (scrollIntoView on focus trap)
Element.prototype.scrollIntoView = jest.fn();
Element.prototype.hasPointerCapture = jest.fn(() => false);
Element.prototype.setPointerCapture = jest.fn();
Element.prototype.releasePointerCapture = jest.fn();

// ─── window.CSS ───────────────────────────────────────────────────────────────
// Used by: next-themes and some Radix internals checking CSS feature support
Object.defineProperty(window, 'CSS', {
	writable: true,
	value: { supports: jest.fn(() => false), escape: jest.fn((s: string) => s) }
});
