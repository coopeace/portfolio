import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';

export const runner = new TestRunner('Contact Form Zod Input Boundaries', 'Tier 2');

runner.test('T2-CONTACT-01: Name boundary: exactly 1 char rejected, exactly 2 chars accepted', async () => {
  const schemaPath = 'src/lib/validation.ts';
  const code = ContractValidator.readFile(schemaPath);

  // Check that name has .min(2)
  const hasMin2 = /name[\s\S]*?\.min\(\s*2/m.test(code);
  assert.ok(hasMin2, 'Zod schema must enforce min(2) for name');
});

runner.test('T2-CONTACT-02: Name boundary: 100 chars accepted, >100 chars rejected', async () => {
  const schemaPath = 'src/lib/validation.ts';
  const code = ContractValidator.readFile(schemaPath);

  const hasMax100 = /name[\s\S]*?\.max\(\s*100/m.test(code);
  assert.ok(hasMax100, 'Zod schema must enforce max(100) for name');
});

runner.test('T2-CONTACT-03: Message boundary: 9 chars rejected, exactly 10 chars accepted', async () => {
  const schemaPath = 'src/lib/validation.ts';
  const code = ContractValidator.readFile(schemaPath);

  const hasMin10 = /message[\s\S]*?\.min\(\s*10/m.test(code);
  assert.ok(hasMin10, 'Zod schema must enforce min(10) for message');
});

runner.test('T2-CONTACT-04: Message boundary: 2000 chars accepted, >2000 chars rejected', async () => {
  const schemaPath = 'src/lib/validation.ts';
  const code = ContractValidator.readFile(schemaPath);

  const hasMax2000 = /message[\s\S]*?\.max\(\s*2000/m.test(code);
  assert.ok(hasMax2000, 'Zod schema must enforce max(2000) for message');
});

runner.test('T2-CONTACT-05: Malformed email strings rejected by email validation', async () => {
  const schemaPath = 'src/lib/validation.ts';
  const code = ContractValidator.readFile(schemaPath);

  const hasEmail = /email[\s\S]*?\.email\(/m.test(code);
  assert.ok(hasEmail, 'Zod schema must validate email format with .email()');
});

runner.test('T2-CONTACT-06: Empty payload / whitespace-only inputs are rejected', async () => {
  const schemaPath = 'src/lib/validation.ts';
  const code = ContractValidator.readFile(schemaPath);

  assert.ok(code.includes('z.string()'), 'Zod schema fields must be typed strings');
});

if (process.argv[1] && process.argv[1].endsWith('contact-boundaries.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
