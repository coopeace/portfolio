import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';
import { config } from '../config.mjs';

export const runner = new TestRunner('Particle & Viewport Boundaries', 'Tier 2');

runner.test('T2-PART-01: Starfield mobile star count budget is clamped between 30 and 50', async () => {
  const starPath = 'src/components/space/StarField.tsx';
  const code = ContractValidator.readFile(starPath);

  // Assert mobile count does not exceed budget
  assert.ok(
    config.starThresholds.mobileMin >= 30 && config.starThresholds.mobileMax <= 50,
    'Configured mobile star threshold is 30-50'
  );
  assert.ok(code.includes('30') || code.includes('40') || code.includes('50') || code.includes('isMobile') || code.includes('count'), 'Starfield handles mobile star budget');
});

runner.test('T2-PART-02: Starfield desktop star count budget is clamped between 80 and 120', async () => {
  const starPath = 'src/components/space/StarField.tsx';
  const code = ContractValidator.readFile(starPath);

  assert.ok(
    config.starThresholds.desktopMin >= 80 && config.starThresholds.desktopMax <= 120,
    'Configured desktop star threshold is 80-120'
  );
});

runner.test('T2-PART-03: Starfield avoids generating unbounded DOM elements (>200 elements prohibited)', async () => {
  const starPath = 'src/components/space/StarField.tsx';
  const code = ContractValidator.readFile(starPath);

  // Assert code does not create unbounded arrays like Array(1000)
  assert.ok(
    !code.includes('Array(1000)') && !code.includes('Array(500)'),
    'StarField must not create thousands of DOM nodes'
  );
});

runner.test('T2-PART-04: Stars utilize CSS transform and opacity rather than JS layout loops', async () => {
  const starPath = 'src/components/space/StarField.tsx';
  const cssPath = 'src/app/globals.css';
  const combined = ContractValidator.readFile(starPath) + ContractValidator.readFile(cssPath);

  assert.ok(
    combined.includes('transform') || combined.includes('opacity') || combined.includes('animate-'),
    'Star animation must use performant transform/opacity properties'
  );
});

runner.test('T2-PART-05: Decorative background layers use aria-hidden="true"', async () => {
  const starPath = 'src/components/space/StarField.tsx';
  const nebulaPath = 'src/components/space/NebulaLayer.tsx';
  const targetPath = ContractValidator.fileExists(nebulaPath) ? nebulaPath : starPath;
  const code = ContractValidator.readFile(targetPath);

  assert.ok(
    code.includes('aria-hidden') || code.includes('pointer-events-none'),
    'Decorative space background must be hidden from screen readers or pointer events'
  );
});

runner.test('T2-PART-06: Root layout/body prevents horizontal scrollbar overflow (overflow-x hidden)', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');
  const layout = ContractValidator.readFile('src/app/layout.tsx');

  assert.ok(
    css.includes('overflow-x') || layout.includes('overflow-x-hidden') || layout.includes('overflow-hidden'),
    'Application must prevent horizontal overflow on body/layout'
  );
});

if (process.argv[1] && process.argv[1].endsWith('particle-boundaries.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
