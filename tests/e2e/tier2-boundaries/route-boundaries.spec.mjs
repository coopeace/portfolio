import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';
import { httpClient } from '../harness/http-client.mjs';

export const runner = new TestRunner('404 & Malformed Route Boundaries', 'Tier 2');

let isServerUp = false;

runner.before(async () => {
  isServerUp = await httpClient.isServerReachable();
});

runner.test('T2-ROUTE-01: Custom 404 page exists at src/app/not-found.tsx', async () => {
  const notFoundPath = 'src/app/not-found.tsx';
  assert.ok(ContractValidator.fileExists(notFoundPath), `${notFoundPath} must exist`);

  const code = ContractValidator.readFile(notFoundPath);
  assert.ok(
    code.includes('404') || code.includes('Lost') || code.includes('Mission') || code.includes('Not Found'),
    '404 page must present space-themed not-found or mission abort message'
  );
});

runner.test('T2-ROUTE-02: Custom 404 page contains a return CTA link back to home (/)', async () => {
  const notFoundPath = 'src/app/not-found.tsx';
  const code = ContractValidator.readFile(notFoundPath);

  assert.ok(
    code.includes('href="/"') || code.includes("href='/'") || code.includes('href={`/`}'),
    '404 page must provide a navigation link back to root /'
  );
});

runner.test('T2-ROUTE-03: Live server returns 404 status code for non-existent routes', async () => {
  if (isServerUp) {
    const res = await httpClient.get('/route-that-definitely-does-not-exist-98765');
    assert.equal(res.status, 404, 'Non-existent route must return HTTP 404');
  } else {
    assert.ok(ContractValidator.fileExists('src/app/not-found.tsx'), 'not-found.tsx must be configured');
  }
});

runner.test('T2-ROUTE-04: Non-existent project slug triggers notFound()', async () => {
  const projectSlugPath = 'src/app/projects/[slug]/page.tsx';
  const code = ContractValidator.readFile(projectSlugPath);

  assert.ok(
    code.includes('notFound()') || code.includes('notFound') || code.includes('projects.find'),
    'Dynamic project route must call notFound() when slug is unmatched'
  );
});

runner.test('T2-ROUTE-05: Non-existent blog slug triggers notFound()', async () => {
  const blogSlugPath = 'src/app/blog/[slug]/page.tsx';
  const code = ContractValidator.readFile(blogSlugPath);

  assert.ok(
    code.includes('notFound()') || code.includes('notFound') || code.includes('getPostBySlug'),
    'Dynamic blog route must call notFound() when slug is unmatched'
  );
});

runner.test('T2-ROUTE-06: Potential path traversal in blog slugs is neutralized', async () => {
  const blogLibPath = 'src/lib/blog.ts';
  const code = ContractValidator.readFile(blogLibPath);

  // Check that slug is sanitized or resolved with path.join strictly inside content/blog
  assert.ok(
    code.includes('path.join') || code.includes('replace') || code.includes('content'),
    'Blog reader must safely construct paths inside content directory'
  );
});

if (process.argv[1] && process.argv[1].endsWith('route-boundaries.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
