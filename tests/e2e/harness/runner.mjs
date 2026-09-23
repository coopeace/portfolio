import assert from 'node:assert/strict';

export class TestRunner {
  constructor(suiteName, tier = 'Tier 1') {
    this.suiteName = suiteName;
    this.tier = tier;
    this.tests = [];
    this.results = [];
    this.beforeHooks = [];
    this.afterHooks = [];
  }

  before(fn) {
    this.beforeHooks.push(fn);
  }

  after(fn) {
    this.afterHooks.push(fn);
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  it(name, fn) {
    this.test(name, fn);
  }

  async run() {
    console.log(`\n======================================================`);
    console.log(`[${this.tier}] Running Suite: ${this.suiteName}`);
    console.log(`======================================================`);

    const startTime = Date.now();
    let passed = 0;
    let failed = 0;

    for (const hook of this.beforeHooks) {
      try {
        await hook();
      } catch (err) {
        console.error(`  [!] Before-hook failed:`, err.message);
      }
    }

    for (const test of this.tests) {
      const testStart = Date.now();
      try {
        await test.fn();
        const duration = Date.now() - testStart;
        console.log(`  [PASS] ${test.name} (${duration}ms)`);
        passed++;
        this.results.push({ name: test.name, status: 'pass', duration, error: null });
      } catch (err) {
        const duration = Date.now() - testStart;
        console.error(`  [FAIL] ${test.name} (${duration}ms)`);
        console.error(`         Error: ${err.message}`);
        failed++;
        this.results.push({ name: test.name, status: 'fail', duration, error: err.message, stack: err.stack });
      }
    }

    for (const hook of this.afterHooks) {
      try {
        await hook();
      } catch (err) {
        console.error(`  [!] After-hook failed:`, err.message);
      }
    }

    const totalDuration = Date.now() - startTime;
    console.log(`------------------------------------------------------`);
    console.log(`Suite Summary: ${passed} passed, ${failed} failed, ${this.tests.length} total (${totalDuration}ms)\n`);

    return {
      suiteName: this.suiteName,
      tier: this.tier,
      passed,
      failed,
      total: this.tests.length,
      duration: totalDuration,
      results: this.results,
    };
  }
}

export { assert };
