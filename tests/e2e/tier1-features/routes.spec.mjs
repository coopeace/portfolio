import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';
import { DomInspector } from '../harness/dom-parser.mjs';
import { httpClient } from '../harness/http-client.mjs';

export const runner = new TestRunner('Core Routes & Semantic Layout', 'Tier 1');

let isServerUp = false;

runner.before(async () => {
  isServerUp = await httpClient.isServerReachable();
  if (isServerUp) {
    console.log('  [INFO] Live test server detected. Running live HTTP route probes.');
  } else {
    console.log('  [INFO] Test server not running. Running route file contract validation.');
  }
});

runner.test('T1-ROUTE-01: Route / (Home) renders with valid semantic structure and main sections', async () => {
  if (isServerUp) {
    const res = await httpClient.get('/');
    assert.equal(res.status, 200, 'Home page must respond with 200 OK');
    const landmarks = DomInspector.hasSemanticLandmarks(res.body);
    assert.ok(landmarks.hasNav, 'Home page must contain <nav>');
    assert.ok(landmarks.hasMain, 'Home page must contain <main>');
    assert.ok(landmarks.hasFooter, 'Home page must contain <footer>');
  } else {
    assert.ok(ContractValidator.fileExists('src/app/page.tsx'), 'src/app/page.tsx must exist');
    const code = ContractValidator.readFile('src/app/page.tsx');
    assert.ok(code.includes('Hero') || code.includes('hero'), 'Home page must render Hero');
  }
});

runner.test('T1-ROUTE-02: Route /projects (Catalog) exists and defines projects layout', async () => {
  if (isServerUp) {
    const res = await httpClient.get('/projects');
    assert.equal(res.status, 200, 'Projects catalog must respond with 200 OK');
    assert.ok(res.body.toLowerCase().includes('project'), 'Projects page must mention projects');
  } else {
    assert.ok(ContractValidator.fileExists('src/app/projects/page.tsx'), 'src/app/projects/page.tsx must exist');
  }
});

runner.test('T1-ROUTE-03: Route /projects/[slug] exists for dynamic project dossiers', async () => {
  assert.ok(
    ContractValidator.fileExists('src/app/projects/[slug]/page.tsx'),
    'src/app/projects/[slug]/page.tsx must exist'
  );
  const code = ContractValidator.readFile('src/app/projects/[slug]/page.tsx');
  assert.ok(code.includes('params'), 'Project detail page must accept route params');
});

runner.test('T1-ROUTE-04: Route /blog (Catalog) exists and renders blog listing', async () => {
  if (isServerUp) {
    const res = await httpClient.get('/blog');
    assert.equal(res.status, 200, 'Blog catalog must respond with 200 OK');
    assert.ok(res.body.toLowerCase().includes('blog'), 'Blog catalog must mention blog');
  } else {
    assert.ok(ContractValidator.fileExists('src/app/blog/page.tsx'), 'src/app/blog/page.tsx must exist');
  }
});

runner.test('T1-ROUTE-05: Route /blog/[slug] exists for dynamic MDX post rendering', async () => {
  assert.ok(
    ContractValidator.fileExists('src/app/blog/[slug]/page.tsx'),
    'src/app/blog/[slug]/page.tsx must exist'
  );
});

runner.test('T1-ROUTE-06: Route /about exists and details backend/systems focus & Durgapur location', async () => {
  if (isServerUp) {
    const res = await httpClient.get('/about');
    assert.equal(res.status, 200, 'About page must respond with 200 OK');
    assert.ok(res.body.includes('Durgapur') || res.body.includes('India'), 'About page must mention Durgapur/India');
  } else {
    assert.ok(ContractValidator.fileExists('src/app/about/page.tsx'), 'src/app/about/page.tsx must exist');
  }
});

runner.test('T1-ROUTE-07: Route /contact exists and renders contact form and direct fallbacks', async () => {
  if (isServerUp) {
    const res = await httpClient.get('/contact');
    assert.equal(res.status, 200, 'Contact page must respond with 200 OK');
  } else {
    assert.ok(ContractValidator.fileExists('src/app/contact/page.tsx'), 'src/app/contact/page.tsx must exist');
  }
});

runner.test('T1-ROUTE-08: UI enforces semantic HTML: interactive elements use real button and a elements', async () => {
  // Check component templates for clickable div anti-patterns
  const navbarPath = 'src/components/navigation/Navbar.tsx';
  if (ContractValidator.fileExists(navbarPath)) {
    const code = ContractValidator.readFile(navbarPath);
    // Disallow <div onClick= without role="button"
    const hasClickableDivWithoutRole = /<div[^>]*onClick(?![^>]*role=["']button["'])[^>]*>/i.test(code);
    assert.ok(!hasClickableDivWithoutRole, 'Navbar must not use clickable div elements without semantic role');
  }
});

if (process.argv[1] && process.argv[1].endsWith('routes.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
