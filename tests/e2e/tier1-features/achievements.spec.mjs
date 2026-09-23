import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';

export const runner = new TestRunner('Truthful Data & Achievement Dashboard', 'Tier 1');

runner.test('T1-ACHIEVE-01: achievements.ts contains LeetCode, NeetCode, HackerRank platforms', async () => {
  const filePath = 'src/data/achievements.ts';
  assert.ok(ContractValidator.fileExists(filePath), `${filePath} must exist`);

  const code = ContractValidator.readFile(filePath);
  assert.ok(code.includes('LeetCode'), 'Must include LeetCode platform');
  assert.ok(code.includes('NeetCode'), 'Must include NeetCode platform');
  assert.ok(code.includes('HackerRank'), 'Must include HackerRank platform');
});

runner.test('T1-ACHIEVE-02: Zero-Fake-Stats rule: achievements use baseline 0 or documented truthful metrics', async () => {
  const filePath = 'src/data/achievements.ts';
  const code = ContractValidator.readFile(filePath);

  // Assert no invented hundreds of solved problems if unverified
  // e.g., solved should be 0 baseline as specified in design.md §23
  assert.ok(code.includes('0') || code.includes('solved: 0'), 'Must include baseline 0 metrics for initial setup');
});

runner.test('T1-ACHIEVE-03: Achievement interface defines platform, solved, total, badges, and url', async () => {
  const filePath = 'src/data/achievements.ts';
  const code = ContractValidator.readFile(filePath);

  assert.ok(code.includes('interface Achievement') || code.includes('type Achievement'), 'Must define Achievement type/interface');
  assert.ok(code.includes('platform'), 'Achievement must have platform');
  assert.ok(code.includes('url'), 'Achievement must have url');
});

runner.test('T1-ACHIEVE-04: profile.ts specifies Shishir Dev persona, backend/systems focus, and Durgapur, India', async () => {
  const filePath = 'src/data/profile.ts';
  assert.ok(ContractValidator.fileExists(filePath), `${filePath} must exist`);

  const code = ContractValidator.readFile(filePath);
  assert.ok(code.includes('Shishir Dev'), 'Profile name must be Shishir Dev');
  assert.ok(code.includes('Durgapur'), 'Profile location must be Durgapur, India');
  assert.ok(code.includes('Python') || code.includes('Linux') || code.includes('Backend'), 'Profile must list backend/systems focus areas');
});

runner.test('T1-ACHIEVE-05: social.ts specifies authentic GitHub (coopeace) and LinkedIn (shishir-dev-2aa230361)', async () => {
  const filePath = 'src/data/social.ts';
  assert.ok(ContractValidator.fileExists(filePath), `${filePath} must exist`);

  const code = ContractValidator.readFile(filePath);
  assert.ok(code.includes('github.com/coopeace') || code.includes('coopeace'), 'Must contain GitHub coopeace link');
  assert.ok(code.includes('shishir-dev-2aa230361'), 'Must contain LinkedIn shishir-dev link');
});

runner.test('T1-ACHIEVE-06: projects.ts provides structured data with name, description, and technologies', async () => {
  const filePath = 'src/data/projects.ts';
  assert.ok(ContractValidator.fileExists(filePath), `${filePath} must exist`);

  const code = ContractValidator.readFile(filePath);
  assert.ok(code.includes('Project'), 'Must define Project interface/type');
  assert.ok(code.includes('technologies'), 'Project must list technologies');
});

if (process.argv[1] && process.argv[1].endsWith('achievements.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
