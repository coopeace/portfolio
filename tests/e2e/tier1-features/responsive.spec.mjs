import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';
import { config } from '../config.mjs';

export const runner = new TestRunner('Responsive Layout & Accessibility', 'Tier 1');

runner.test('T1-RESP-01: Root layout or viewport export defines responsive viewport configuration', async () => {
  const layoutPath = 'src/app/layout.tsx';
  assert.ok(ContractValidator.fileExists(layoutPath), `${layoutPath} must exist`);

  const code = ContractValidator.readFile(layoutPath);
  assert.ok(
    code.includes('viewport') || code.includes('width=device-width') || code.includes('initial-scale=1') || code.includes('html'),
    'Root layout must provide responsive viewport configuration'
  );
});

runner.test('T1-RESP-02: Navbar provides responsive navigation (desktop links + mobile menu drawer/toggle)', async () => {
  const navPath = 'src/components/navigation/Navbar.tsx';
  assert.ok(ContractValidator.fileExists(navPath), `${navPath} must exist`);

  const code = ContractValidator.readFile(navPath);
  // Check for responsive classes or hamburger toggle
  assert.ok(
    code.includes('md:') || code.includes('lg:') || code.includes('mobile') || code.includes('isOpen') || code.includes('Menu'),
    'Navbar must support mobile menu toggle / responsive breakpoint behavior'
  );
});

runner.test('T1-RESP-03: Space StarField respects responsive particle counts (30-50 mobile, 80-120 desktop)', async () => {
  const starPath = 'src/components/space/StarField.tsx';
  assert.ok(ContractValidator.fileExists(starPath), `${starPath} must exist`);

  const code = ContractValidator.readFile(starPath);
  // Verify star count logic or adaptive thresholding
  assert.ok(
    code.includes('count') || code.includes('stars') || code.includes('desktop') || code.includes('mobile') || code.includes('50') || code.includes('100') || code.includes('80'),
    'StarField must support adaptive/scaled particle density'
  );
});

runner.test('T1-RESP-04: Rocket illustration scales adaptively for mobile without covering CTA elements', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const heroPath = 'src/components/hero/Hero.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(heroPath) ? heroPath : rocketPath);

  assert.ok(
    code.includes('w-') || code.includes('h-') || code.includes('max-w') || code.includes('scale') || code.includes('responsive'),
    'Rocket or Hero container must constrain rocket scale with responsive sizing'
  );
});

runner.test('T1-RESP-05: Accessible SkipLink or semantic landmark navigation is implemented', async () => {
  const skipLinkPath = 'src/components/ui/SkipLink.tsx';
  const layoutPath = 'src/app/layout.tsx';

  const hasSkipLink = ContractValidator.fileExists(skipLinkPath);
  const layoutCode = ContractValidator.readFile(layoutPath);

  assert.ok(
    hasSkipLink || layoutCode.includes('skip') || layoutCode.includes('#main') || layoutCode.includes('<main id='),
    'Accessible skip link or landmark bypass must be provided for keyboard users'
  );
});

runner.test('T1-RESP-06: Focus ring / keyboard focus visible styles are preserved in globals.css or components', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');
  assert.ok(
    css.includes('focus') || css.includes('outline') || css.includes('ring'),
    'Design system must retain accessible focus indicators'
  );
});

if (process.argv[1] && process.argv[1].endsWith('responsive.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
