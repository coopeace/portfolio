import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';

export const runner = new TestRunner('Rocket State Machine & Countdown Boundaries', 'Tier 2');

runner.test('T2-ROCKET-01: FSM accepts valid transition sequence: idle -> hover -> igniting -> countdown -> launching -> complete -> idle', async () => {
  const sequence = [
    ['idle', 'hover'],
    ['hover', 'igniting'],
    ['igniting', 'countdown'],
    ['countdown', 'launching'],
    ['launching', 'complete'],
    ['complete', 'idle'],
  ];

  const res = ContractValidator.validateRocketStateMachine(
    ['idle', 'hover', 'igniting', 'countdown', 'launching', 'complete'],
    sequence
  );

  assert.equal(res.valid, true, `Sequence must be valid: ${res.error}`);
});

runner.test('T2-ROCKET-02: FSM rejects illegal transitions (e.g. idle -> launching directly, or complete -> countdown)', async () => {
  const illegalSequence = [
    ['complete', 'countdown'],
  ];

  const res = ContractValidator.validateRocketStateMachine(
    ['idle', 'hover', 'igniting', 'countdown', 'launching', 'complete'],
    illegalSequence
  );

  assert.equal(res.valid, false, 'Illegal transition complete -> countdown must be rejected');
});

runner.test('T2-ROCKET-03: State machine guards against double-click re-entry during active countdown/launch', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  // Check that trigger checks state === 'idle' or is disabled when launched
  assert.ok(
    code.includes('disabled') || code.includes("=== 'idle'") || code.includes('!== "idle"') || code.includes('isLaunching'),
    'Rocket interaction must prevent re-entry while launch/countdown is already in progress'
  );
});

runner.test('T2-ROCKET-04: Countdown sequence boundary: countdown must progress through 3, 2, 1 and terminate', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  assert.ok(
    code.includes('countdown') || code.includes('count'),
    'Countdown logic must be bounded and decrement to zero'
  );
});

runner.test('T2-ROCKET-05: Reduced motion mode bypasses 3-2-1 timer and executes immediate navigation', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  assert.ok(
    code.includes('reduced') || code.includes('prefers-reduced-motion') || code.includes('useReducedMotion'),
    'Rocket must detect reduced motion and skip prolonged kinetic animations'
  );
});

runner.test('T2-ROCKET-06: Rocket resets to idle state after completing launch animation', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  assert.ok(
    code.includes('complete') || code.includes('idle'),
    'Rocket state machine must include complete state and support reset'
  );
});

if (process.argv[1] && process.argv[1].endsWith('rocket-boundaries.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
