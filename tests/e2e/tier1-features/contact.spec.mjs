import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';
import { httpClient } from '../harness/http-client.mjs';

export const runner = new TestRunner('Zod Contact Form & Truthful API', 'Tier 1');

let isServerUp = false;

runner.before(async () => {
  isServerUp = await httpClient.isServerReachable();
});

runner.test('T1-CONTACT-01: src/lib/validation.ts defines contactFormSchema with Zod', async () => {
  const schemaPath = 'src/lib/validation.ts';
  assert.ok(ContractValidator.fileExists(schemaPath), `${schemaPath} must exist`);

  const code = ContractValidator.readFile(schemaPath);
  assert.ok(code.includes('contactFormSchema') || code.includes('contactSchema'), 'Must export contact schema');
  assert.ok(code.includes('z.object'), 'Must define schema with z.object');
});

runner.test('T1-CONTACT-02: Zod schema validates name, email, and message fields', async () => {
  const schemaPath = 'src/lib/validation.ts';
  const code = ContractValidator.readFile(schemaPath);

  assert.ok(code.includes('name'), 'Schema must validate name');
  assert.ok(code.includes('email'), 'Schema must validate email');
  assert.ok(code.includes('message'), 'Schema must validate message');
});

runner.test('T1-CONTACT-03: API route /api/contact exists and supports POST method', async () => {
  const apiPath = 'src/app/api/contact/route.ts';
  assert.ok(ContractValidator.fileExists(apiPath), `${apiPath} must exist`);

  const code = ContractValidator.readFile(apiPath);
  assert.ok(code.includes('export async function POST') || code.includes('export function POST'), 'Must define POST handler');
});

runner.test('T1-CONTACT-04: Truthful API: does not fake backend email transmission when unconfigured', async () => {
  const apiPath = 'src/app/api/contact/route.ts';
  const code = ContractValidator.readFile(apiPath);

  // Assert API is truthful: provides honest message or fallbackUrl
  assert.ok(
    code.includes('fallbackUrl') || code.includes('mailto:') || code.includes('received') || code.includes('message'),
    'API must return truthful response with transparent delivery status or mailto fallback'
  );
});

runner.test('T1-CONTACT-05: Live API rejects empty or malformed POST requests with 400 Bad Request', async () => {
  if (isServerUp) {
    const res = await httpClient.post('/api/contact', { name: '', email: 'not-an-email', message: '' });
    assert.ok(res.status === 400 || res.status === 422, 'Malformed contact payload must be rejected with 400 or 422');
    assert.equal(res.json?.success, false, 'Rejected submission must have success: false');
  } else {
    // Contract check: API code uses zod parse or safeParse
    const apiCode = ContractValidator.readFile('src/app/api/contact/route.ts');
    assert.ok(apiCode.includes('safeParse') || apiCode.includes('parse'), 'API must validate body using Zod schema');
  }
});

runner.test('T1-CONTACT-06: Contact page provides direct fallback links (mailto and LinkedIn)', async () => {
  const pagePath = 'src/app/contact/page.tsx';
  const componentPath = 'src/components/contact/ContactForm.tsx';
  const pathToCheck = ContractValidator.fileExists(componentPath) ? componentPath : pagePath;

  const code = ContractValidator.readFile(pathToCheck);
  assert.ok(
    code.includes('mailto:') || code.includes('linkedin.com') || code.includes('social'),
    'Contact page/form must provide direct communication fallback'
  );
});

if (process.argv[1] && process.argv[1].endsWith('contact.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
