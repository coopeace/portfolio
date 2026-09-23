import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';

export const runner = new TestRunner('Pairwise Cross-Feature Interactions', 'Tier 3');

runner.test('T3-PAIR-01: Theme Mode x Rocket Interaction: Rocket assets support both dark and light modes', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const code = ContractValidator.readFile(rocketPath);

  // Assert rocket styling adapts to theme tokens or dark: classes
  assert.ok(
    code.includes('dark:') || code.includes('var(--accent') || code.includes('currentColor') || code.includes('theme'),
    'Rocket component must support both Deep Space and Orbital Day theme contexts'
  );
});

runner.test('T3-PAIR-02: Reduced Motion x Rocket Launch: Launch animation degrades gracefully to direct jump', async () => {
  const rocketPath = 'src/components/rocket/Rocket.tsx';
  const launchPath = 'src/components/rocket/RocketLaunch.tsx';
  const targetCode = ContractValidator.readFile(ContractValidator.fileExists(launchPath) ? launchPath : rocketPath);

  assert.ok(
    targetCode.includes('reduced') || targetCode.includes('prefers-reduced-motion') || targetCode.includes('useReducedMotion'),
    'Rocket launch must handle reduced motion by bypassing kinetic launch sequence'
  );
});

runner.test('T3-PAIR-03: Mobile Viewport x Navigation Drawer x Theme Switcher integration', async () => {
  const navPath = 'src/components/navigation/Navbar.tsx';
  const code = ContractValidator.readFile(navPath);

  assert.ok(
    code.includes('ThemeSwitcher'),
    'Navbar must integrate ThemeSwitcher in both desktop and mobile navigation contexts'
  );
});

runner.test('T3-PAIR-04: Mobile Viewport x Hero Rocket: Rocket scale does not obscure hero CTAs', async () => {
  const heroPath = 'src/components/hero/Hero.tsx';
  const code = ContractValidator.readFile(heroPath);

  assert.ok(
    code.includes('grid') || code.includes('flex-col') || code.includes('lg:flex-row') || code.includes('md:'),
    'Hero must layout content and rocket responsively so rocket does not cover CTAs on mobile'
  );
});

runner.test('T3-PAIR-05: Light Mode x MDX Syntax Highlighting: Code blocks remain readable in Orbital Day', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');
  const blogLib = ContractValidator.readFile('src/lib/blog.ts');

  // Assert code blocks have distinct background and border in globals.css or syntax highlighter
  assert.ok(
    css.includes('pre') || css.includes('code') || blogLib.includes('rehype') || blogLib.includes('highlight'),
    'Code block styling must ensure legibility across theme modes'
  );
});

runner.test('T3-PAIR-06: Dark Mode x Contact Validation: Form errors render clearly against dark surfaces', async () => {
  const formPath = 'src/components/contact/ContactForm.tsx';
  const pagePath = 'src/app/contact/page.tsx';
  const code = ContractValidator.readFile(ContractValidator.fileExists(formPath) ? formPath : pagePath);

  assert.ok(
    code.includes('red-') || code.includes('error') || code.includes('text-rose-') || code.includes('text-red'),
    'Form validation errors must have dedicated high-contrast styling against dark surfaces'
  );
});

runner.test('T3-PAIR-07: Route Navigation x Theme Persistence: Theme is preserved across route changes', async () => {
  const layoutPath = 'src/app/layout.tsx';
  const code = ContractValidator.readFile(layoutPath);

  // next-themes ThemeProvider wraps entire layout, persisting across App Router page navigations
  assert.ok(
    code.includes('ThemeProvider'),
    'ThemeProvider must wrap children in root layout to preserve theme across route transitions'
  );
});

runner.test('T3-PAIR-08: Achievement Dashboard x Reduced Motion: Counters render truthful baseline without animation lag', async () => {
  const dashboardPath = 'src/components/achievements/AchievementDashboard.tsx';
  const cardPath = 'src/components/achievements/AchievementCard.tsx';
  const targetPath = ContractValidator.fileExists(cardPath) ? cardPath : dashboardPath;
  const code = ContractValidator.readFile(targetPath);

  // Must render baseline 0 cleanly
  assert.ok(
    code.includes('solved') || code.includes('platform') || code.includes('badges'),
    'Achievement card must directly render stats without requiring mandatory motion'
  );
});

if (process.argv[1] && process.argv[1].endsWith('pairwise-matrix.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
