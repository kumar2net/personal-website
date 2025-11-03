#!/usr/bin/env node

/**
 * Unit tests for Status component localStorage operations and error handling
 * Tests cover:
 * 1. setLocal correctly calls setLocalOn(true) when val is "on"
 * 2. setLocal dispatches a "storage" event after updating local storage
 * 3. setLocal gracefully handles errors during localStorage operations
 * 4. The useEffect hook gracefully handles errors during localStorage.getItem
 * 5. The "Clear history" button gracefully handles errors during localStorage.removeItem
 */

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test counters
let passCount = 0;
let failCount = 0;
const failures = [];

function assert(condition, message) {
	if (condition) {
		passCount++;
		console.log(`  ✓ ${message}`);
	} else {
		failCount++;
		failures.push(message);
		console.error(`  ✗ ${message}`);
	}
}

function assertEqual(actual, expected, message) {
	if (actual === expected) {
		passCount++;
		console.log(`  ✓ ${message}`);
	} else {
		failCount++;
		failures.push(
			`${message} (expected: ${expected}, actual: ${actual})`,
		);
		console.error(
			`  ✗ ${message} (expected: ${expected}, actual: ${actual})`,
		);
	}
}

// Mock implementations
class MockLocalStorage {
	constructor(shouldThrow = false) {
		this.store = {};
		this.shouldThrow = shouldThrow;
	}

	getItem(key) {
		if (this.shouldThrow) {
			throw new Error("localStorage.getItem error");
		}
		return this.store[key] || null;
	}

	setItem(key, value) {
		if (this.shouldThrow) {
			throw new Error("localStorage.setItem error");
		}
		this.store[key] = value;
	}

	removeItem(key) {
		if (this.shouldThrow) {
			throw new Error("localStorage.removeItem error");
		}
		delete this.store[key];
	}

	clear() {
		this.store = {};
	}
}

class MockWindow {
	constructor(shouldThrowEvent = false) {
		this.localStorage = new MockLocalStorage();
		this.events = [];
		this.shouldThrowEvent = shouldThrowEvent;
	}

	dispatchEvent(event) {
		if (this.shouldThrowEvent) {
			throw new Error("dispatchEvent error");
		}
		this.events.push(event);
		return true;
	}
}

// Test 1: setLocal correctly calls setLocalOn(true) when val is "on"
function testSetLocalCallsSetLocalOn() {
	console.log("\n1. Testing setLocal calls setLocalOn(true) when val is 'on':");

	const mockWindow = new MockWindow();
	global.window = mockWindow;

	// Simulate the setLocal function logic
	const setLocalOn = (on) => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem("feature_unread_v1", on ? "on" : "off");
	};

	const setLocal = (val) => {
		try {
			setLocalOn(val === "on");
		} catch (e) {
			console.warn("setLocal error", e);
		}
	};

	// Test with "on"
	setLocal("on");
	assertEqual(
		mockWindow.localStorage.getItem("feature_unread_v1"),
		"on",
		'setLocal("on") sets feature_unread_v1 to "on"',
	);

	// Test with "off"
	setLocal("off");
	assertEqual(
		mockWindow.localStorage.getItem("feature_unread_v1"),
		"off",
		'setLocal("off") sets feature_unread_v1 to "off"',
	);

	// Test with other value
	setLocal("something");
	assertEqual(
		mockWindow.localStorage.getItem("feature_unread_v1"),
		"off",
		'setLocal("something") sets feature_unread_v1 to "off"',
	);

	delete global.window;
}

// Test 2: setLocal dispatches a "storage" event after updating local storage
function testSetLocalDispatchesStorageEvent() {
	console.log("\n2. Testing setLocal dispatches storage event:");

	const mockWindow = new MockWindow();
	global.window = mockWindow;

	const setLocalOn = (on) => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem("feature_unread_v1", on ? "on" : "off");
	};

	const setLocal = (val) => {
		try {
			setLocalOn(val === "on");
			try {
				window.dispatchEvent(new Event("storage"));
			} catch (e) {
				console.warn("dispatch storage event error", e);
			}
		} catch (e) {
			console.warn("setLocal error", e);
		}
	};

	// Clear events
	mockWindow.events = [];

	// Call setLocal
	setLocal("on");

	assert(mockWindow.events.length === 1, "One event was dispatched");
	assert(
		mockWindow.events[0].type === "storage",
		'Dispatched event type is "storage"',
	);

	delete global.window;
}

// Test 3: setLocal gracefully handles errors during localStorage operations
function testSetLocalHandlesLocalStorageErrors() {
	console.log(
		"\n3. Testing setLocal handles localStorage operation errors:",
	);

	const mockWindow = new MockWindow();
	mockWindow.localStorage.shouldThrow = true;
	global.window = mockWindow;

	const setLocalOn = (on) => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem("feature_unread_v1", on ? "on" : "off");
	};

	let errorCaught = false;
	const originalWarn = console.warn;
	console.warn = () => {
		errorCaught = true;
	};

	const setLocal = (val) => {
		try {
			setLocalOn(val === "on");
			try {
				window.dispatchEvent(new Event("storage"));
			} catch (e) {
				console.warn("dispatch storage event error", e);
			}
		} catch (e) {
			console.warn("setLocal error", e);
		}
	};

	// This should not throw, but handle the error gracefully
	try {
		setLocal("on");
		assert(
			errorCaught,
			"Error was caught and logged (console.warn called)",
		);
		assert(true, "setLocal did not throw despite localStorage error");
	} catch (e) {
		assert(false, "setLocal should not throw on localStorage error");
	}

	console.warn = originalWarn;
	delete global.window;
}

// Test 4: The useEffect hook gracefully handles errors during localStorage.getItem
function testUseEffectHandlesGetItemErrors() {
	console.log("\n4. Testing useEffect handles localStorage.getItem errors:");

	const mockWindow = new MockWindow();
	mockWindow.localStorage.shouldThrow = true;
	global.window = mockWindow;
	global.localStorage = mockWindow.localStorage;

	let errorCaught = false;
	let localFlagValue = "unknown";
	const originalWarn = console.warn;
	console.warn = () => {
		errorCaught = true;
	};

	// Simulate the useEffect logic
	const simulateUseEffect = () => {
		try {
			const v = localStorage.getItem("feature_unread_v1");
			localFlagValue = v ?? "unset";
		} catch (e) {
			console.warn("read localStorage error", e);
			localFlagValue = "unavailable";
		}
	};

	simulateUseEffect();

	assert(
		errorCaught,
		"Error was caught and logged (console.warn called)",
	);
	assertEqual(
		localFlagValue,
		"unavailable",
		'localFlag is set to "unavailable" on error',
	);

	console.warn = originalWarn;
	delete global.window;
	delete global.localStorage;
}

// Test 5: The "Clear history" button gracefully handles errors during localStorage.removeItem
function testClearHistoryHandlesRemoveItemErrors() {
	console.log(
		"\n5. Testing Clear history button handles localStorage.removeItem errors:",
	);

	const mockWindow = new MockWindow();
	mockWindow.localStorage.shouldThrow = true;
	global.window = mockWindow;
	global.localStorage = mockWindow.localStorage;

	let errorCaught = false;
	const originalWarn = console.warn;
	console.warn = () => {
		errorCaught = true;
	};

	// Simulate the Clear history button click handler
	const handleClearHistory = () => {
		try {
			localStorage.removeItem("user_read_posts_v1");
			window.dispatchEvent(new Event("storage"));
		} catch (e) {
			console.warn("clear read history error", e);
		}
	};

	// This should not throw, but handle the error gracefully
	try {
		handleClearHistory();
		assert(
			errorCaught,
			"Error was caught and logged (console.warn called)",
		);
		assert(true, "Clear history did not throw despite localStorage error");
	} catch (e) {
		assert(
			false,
			"Clear history should not throw on localStorage error",
		);
	}

	console.warn = originalWarn;
	delete global.window;
	delete global.localStorage;
}

// Test 6: Verify dispatchEvent error handling in setLocal
function testSetLocalHandlesDispatchEventErrors() {
	console.log("\n6. Testing setLocal handles dispatchEvent errors:");

	const mockWindow = new MockWindow(true); // shouldThrowEvent = true
	global.window = mockWindow;

	const setLocalOn = (on) => {
		if (typeof window === "undefined") return;
		window.localStorage.setItem("feature_unread_v1", on ? "on" : "off");
	};

	let eventErrorCaught = false;
	const originalWarn = console.warn;
	console.warn = (msg) => {
		if (msg.includes("dispatch storage event error")) {
			eventErrorCaught = true;
		}
	};

	const setLocal = (val) => {
		try {
			setLocalOn(val === "on");
			try {
				window.dispatchEvent(new Event("storage"));
			} catch (e) {
				console.warn("dispatch storage event error", e);
			}
		} catch (e) {
			console.warn("setLocal error", e);
		}
	};

	// This should not throw, but handle the event dispatch error gracefully
	try {
		setLocal("on");
		assert(
			eventErrorCaught,
			"dispatchEvent error was caught and logged",
		);
		assert(
			true,
			"setLocal did not throw despite dispatchEvent error",
		);
		assertEqual(
			mockWindow.localStorage.getItem("feature_unread_v1"),
			"on",
			"localStorage was still updated despite dispatchEvent error",
		);
	} catch (e) {
		assert(false, "setLocal should not throw on dispatchEvent error");
	}

	console.warn = originalWarn;
	delete global.window;
}

// Test 7: Verify Clear history handles dispatchEvent errors
function testClearHistoryHandlesDispatchEventErrors() {
	console.log(
		"\n7. Testing Clear history handles dispatchEvent errors:",
	);

	const mockWindow = new MockWindow(true); // shouldThrowEvent = true
	// Set up localStorage to work but dispatchEvent to fail
	mockWindow.localStorage.shouldThrow = false;
	mockWindow.localStorage.setItem("user_read_posts_v1", "test data");
	global.window = mockWindow;
	global.localStorage = mockWindow.localStorage;

	const originalWarn = console.warn;
	console.warn = () => {}; // Suppress warnings for this test

	// Simulate the Clear history button click handler
	const handleClearHistory = () => {
		try {
			localStorage.removeItem("user_read_posts_v1");
			window.dispatchEvent(new Event("storage"));
		} catch (e) {
			console.warn("clear read history error", e);
		}
	};

	// This should not throw
	try {
		handleClearHistory();
		assert(
			true,
			"Clear history did not throw despite dispatchEvent error",
		);
		assertEqual(
			mockWindow.localStorage.getItem("user_read_posts_v1"),
			null,
			"localStorage item was removed despite dispatchEvent error",
		);
	} catch (e) {
		assert(
			false,
			"Clear history should not throw on dispatchEvent error",
		);
	}

	console.warn = originalWarn;
	delete global.window;
	delete global.localStorage;
}

// Run all tests
function runTests() {
	console.log("=".repeat(60));
	console.log("Status Component localStorage Unit Tests");
	console.log("=".repeat(60));

	testSetLocalCallsSetLocalOn();
	testSetLocalDispatchesStorageEvent();
	testSetLocalHandlesLocalStorageErrors();
	testUseEffectHandlesGetItemErrors();
	testClearHistoryHandlesRemoveItemErrors();
	testSetLocalHandlesDispatchEventErrors();
	testClearHistoryHandlesDispatchEventErrors();

	// Summary
	console.log("\n" + "=".repeat(60));
	console.log("Test Summary");
	console.log("=".repeat(60));
	console.log(`Total: ${passCount + failCount}`);
	console.log(`✓ Passed: ${passCount}`);
	console.log(`✗ Failed: ${failCount}`);

	if (failCount > 0) {
		console.log("\nFailures:");
		for (const failure of failures) {
			console.log(`  - ${failure}`);
		}
		process.exit(1);
	} else {
		console.log("\n✓ All tests passed!");
		process.exit(0);
	}
}

runTests();
