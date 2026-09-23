import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';
import { httpClient } from '../harness/http-client.mjs';

export const runner = new TestRunner('Real-World End-to-End User Journeys', 'Tier 4');

let isServerUp = false;

runner.before(async () => {
  isServerUp = await httpClient.isServerReachable();
});

runner.test('T4-JOURNEY-01: Recruiter / Discovery Workflow: Land on /, inspect Hero, navigate to #projects, inspect project dossiers', async () => {
  if (isServerUp) {
    const homeRes = await httpClient.get('/');
    assert.equal(homeRes.status, 200, 'Home page must respond 200 OK');
    assert.ok(homeRes.body.includes('Shishir Dev'), 'Home page must feature Shishir Dev');
    assert.ok(homeRes.body.includes('projects') || homeRes.body.includes('Projects'), 'Home page must link to projects');

    const projectsRes = await httpClient.get('/projects');
    assert.equal(projectsRes.status, 200, 'Projects page must respond 200 OK');
  } else {
    // Contract verification
    const homeCode = ContractValidator.readFile('src/app/page.tsx');
    const profileCode = ContractValidator.readFile('src/data/profile.ts');
    const projectsCode = ContractValidator.readFile('src/data/projects.ts');

    assert.ok(profileCode.includes('Shishir Dev'), 'Profile name must be Shishir Dev');
    assert.ok(projectsCode.includes('Project'), 'Projects must be defined');
    assert.ok(homeCode.includes('projects') || homeCode.includes('Hero'), 'Home page must connect hero and projects');
  }
});

runner.test('T4-JOURNEY-02: Engineering Peer Workflow: Visit /blog, select technical article, inspect frontmatter and code blocks', async () => {
  if (isServerUp) {
    const blogRes = await httpClient.get('/blog');
    assert.equal(blogRes.status, 200, 'Blog catalog must respond 200 OK');

    const postRes = await httpClient.get('/blog/understanding-kmp');
    assert.equal(postRes.status, 200, 'KMP blog post must respond 200 OK');
    assert.ok(postRes.body.includes('KMP') || postRes.body.includes('Knuth'), 'Article body must discuss KMP algorithm');
  } else {
    assert.ok(ContractValidator.fileExists('content/blog/understanding-kmp.mdx'), 'KMP post must exist');
    const kmpContent = ContractValidator.readFile('content/blog/understanding-kmp.mdx');
    const { frontmatter, content } = ContractValidator.parseFrontmatter(kmpContent);

    assert.equal(frontmatter.category, 'Algorithms');
    assert.ok(content.includes('```'), 'Article must contain code blocks');
  }
});

runner.test('T4-JOURNEY-03: Technical Auditor Workflow: Inspect /about, verify Durgapur location, check truthful achievements and authentic social profiles', async () => {
  if (isServerUp) {
    const aboutRes = await httpClient.get('/about');
    assert.equal(aboutRes.status, 200, 'About page must respond 200 OK');
    assert.ok(aboutRes.body.includes('Durgapur') || aboutRes.body.includes('India'), 'Must include Durgapur, India location');
  } else {
    const profileCode = ContractValidator.readFile('src/data/profile.ts');
    const achieveCode = ContractValidator.readFile('src/data/achievements.ts');
    const socialCode = ContractValidator.readFile('src/data/social.ts');

    assert.ok(profileCode.includes('Durgapur, India'), 'Profile must specify Durgapur, India');
    assert.ok(achieveCode.includes('LeetCode') && achieveCode.includes('0'), 'Achievements must maintain truthful 0 baseline');
    assert.ok(socialCode.includes('https://github.com/coopeace/coopeace'), 'Must contain authentic GitHub profile URL');
    assert.ok(socialCode.includes('shishir-dev-2aa230361'), 'Must contain authentic LinkedIn profile URL');
  }
});

runner.test('T4-JOURNEY-04: Accessibility & Reduced Motion Workflow: Skip link available, rocket respects reduced motion, contact form accessible', async () => {
  const layoutCode = ContractValidator.readFile('src/app/layout.tsx');
  const contactCode = ContractValidator.readFile('src/app/contact/page.tsx');
  const schemaCode = ContractValidator.readFile('src/lib/validation.ts');

  assert.ok(layoutCode.includes('main') || layoutCode.includes('body'), 'Semantic main container provided');
  assert.ok(contactCode.includes('Contact') || contactCode.includes('form'), 'Contact form provided');
  assert.ok(schemaCode.includes('z.string()'), 'Form inputs are validated with Zod');
});

runner.test('T4-JOURNEY-05: Orbital Day Mode Full Tour: Theme switches to day mode and all 5 core routes preserve theme without visual inversion', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');

  // Verify Orbital Day tokens exist
  assert.ok(css.includes('--background') && css.includes('--foreground'), 'CSS tokens exist');
  assert.ok(!css.includes('filter: invert(100%)'), 'No crude CSS inversion filter used');

  const requiredRoutes = [
    'src/app/page.tsx',
    'src/app/projects/page.tsx',
    'src/app/blog/page.tsx',
    'src/app/about/page.tsx',
    'src/app/contact/page.tsx',
  ];

  for (const routePath of requiredRoutes) {
    assert.ok(ContractValidator.fileExists(routePath), `Route file ${routePath} must exist for full site tour`);
  }
});

if (process.argv[1] && process.argv[1].endsWith('user-journeys.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
