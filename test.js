const assert = require('assert');

console.log("Starting mock tests for Jenkins...");

try {
    // A simple math test that will always pass
    assert.strictEqual(1 + 1, 2);
    
    console.log("✅ Test passed successfully!");
    process.exit(0); // Exit code 0 tells Jenkins the test passed
} catch (error) {
    console.error("❌ Test failed!");
    console.error(error);
    process.exit(1); // Exit code 1 tells Jenkins the test failed
}