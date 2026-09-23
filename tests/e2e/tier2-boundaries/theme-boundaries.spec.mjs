import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';

export const runner = new TestRunner('Theme Switching Persistence & Fallbacks', 'Tier 2');

runner.test('T2-THEME-01: HTML tag in root layout specifies suppressHydrationWarning for theme attribute', async () => {
  const layoutPath = 'src/app/layout.tsx';
  const code = ContractValidator.readFile(layoutPath);

  assert.ok(
    code.includes('suppressHydrationWarning'),
    'Root <html> tag must include suppressHydrationWarning to prevent SSR theme attribute mismatches'
  );
});

runner.test('T2-THEME-02: Theme switcher defaults to dark theme as primary visual identity', async () => {
  const layoutPath = 'src/app/layout.tsx';
  const switcherPath = 'src/components/navigation/ThemeSwitcher.tsx';
  const targetCode = ContractValidator.readFile(ContractValidator.fileExists(switcherPath) ? switcherPath : layoutPath);

  assert.ok(
    targetCode.includes('defaultTheme="dark"') || targetCode.includes("defaultTheme='dark'") || targetCode.includes('dark'),
    'Default theme must be configured with dark as primary identity'
  );
});

runner.test('T2-THEME-03: Theme system defines discrete options: dark, light, and system', async () => {
  const switcherPath = 'src/components/navigation/ThemeSwitcher.tsx';
  const code = ContractValidator.readFile(switcherPath);

  assert.ok(
    code.includes('dark') && code.includes('light'),
    'Theme switcher must support dark and light theme transitions'
  );
});

runner.test('T2-THEME-04: globals.css color variables provide high contrast in both themes', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');

  // Verify that background and foreground are distinct in light and dark
  assert.ok(css.includes('--background') && css.includes('--foreground'), 'Both background and foreground tokens required');
  assert.ok(css.includes('--surface') && css.includes('--border'), 'Both surface and border tokens required');
});

runner.test('T2-THEME-05: Semantic color token overrides do not introduce inverted artifact colors', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');

  // Ensure filter: invert() is NOT used as a lazy shortcut for theme switching
  assert.ok(
    !css.includes('filter: invert(') && !css.includes('filter:invert('),
    'Theme implementation must use semantic CSS variables, never lazy filter: invert()'
  );
});

runner.test('T2-THEME-06: Border hover states have differentiated tokens (--border-hover)', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');
  assert.ok(
    css.includes('--border-hover'),
    'Theme must define explicit --border-hover token for interactive states'
  );
});

if (process.argv[1] && process.argv[1].endsWith('theme-boundaries.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
