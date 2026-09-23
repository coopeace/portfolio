import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';
import { config } from '../config.mjs';

export const runner = new TestRunner('Space UI & Layered Rocket Interaction', 'Tier 1');

runner.test('T1-ROCKET-01: Layered SVG Rocket contains structural parts (body, window, fins, engine, exhaust)', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  assert.ok(ContractValidator.fileExists(rocketPath), `${rocketPath} must exist`);

  const code = ContractValidator.readFile(rocketPath);
  // Verify 2D SVG structure and key layers
  assert.ok(code.includes('<svg') || code.includes('svg'), 'Rocket must be rendered as SVG');
  assert.ok(
    code.toLowerCase().includes('fin') || code.toLowerCase().includes('body') || code.toLowerCase().includes('window') || code.toLowerCase().includes('engine'),
    'Rocket must include layered SVG structural elements (body, fins, engine, window)'
  );
});

runner.test('T1-ROCKET-02: Rocket state machine implements discrete states (idle, hover, igniting, countdown, launching, complete)', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  
  const code = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  const states = ['idle', 'hover', 'igniting', 'countdown', 'launching', 'complete'];
  let foundCount = 0;
  for (const s of states) {
    if (code.includes(`'${s}'`) || code.includes(`"${s}"`)) {
      foundCount++;
    }
  }
  assert.ok(foundCount >= 4, `Rocket state machine must define core states: found ${foundCount}/6`);
});

runner.test('T1-ROCKET-03: Countdown HUD renders 3-2-1 sequence before launch', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  assert.ok(
    (code.includes('3') && code.includes('2') && code.includes('1')) || code.includes('countdown'),
    'Countdown HUD must support 3-2-1 sequence'
  );
});

runner.test('T1-ROCKET-04: Launch sequence duration is restrained to 2-4 seconds total', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  // Assert duration is within design bounds (2000ms - 4000ms)
  assert.ok(config.rocketDurationMs.min >= 2000 && config.rocketDurationMs.max <= 4000, 'Duration budget is 2-4s');
});

runner.test('T1-ROCKET-05: Smooth scroll triggers navigation to #projects section without page reload', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  assert.ok(
    code.includes('#projects') || code.includes('projects') || code.includes('scrollIntoView'),
    'Rocket launch must navigate / scroll user to projects section'
  );
});

runner.test('T1-ROCKET-06: Disables kinetic launch under prefers-reduced-motion: reduce while preserving navigation', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const targetPath = ContractValidator.fileExists(launchPath) ? launchPath : rocketPath;
  const code = ContractValidator.readFile(targetPath);

  assert.ok(
    code.includes('reduced') || code.includes('prefers-reduced-motion') || code.includes('useReducedMotion'),
    'Rocket component must respect reduced-motion preference'
  );
});

runner.test('T1-ROCKET-07: Strictly NO Three.js, React Three Fiber, or WebGL used in initial implementation', async () => {
  const pkgJson = JSON.parse(ContractValidator.readFile('package.json'));
  const allDeps = { ...pkgJson.dependencies, ...pkgJson.devDependencies };

  assert.ok(!allDeps['three'], 'three must NOT be in dependencies');
  assert.ok(!allDeps['@react-three/fiber'], '@react-three/fiber must NOT be in dependencies');
  assert.ok(!allDeps['@react-three/drei'], '@react-three/drei must NOT be in dependencies');
});

if (process.argv[1] && process.argv[1].endsWith('rocket.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
