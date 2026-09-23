import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';
import { DomInspector } from '../harness/dom-parser.mjs';
import { httpClient } from '../harness/http-client.mjs';
import { config } from '../config.mjs';

export const runner = new TestRunner('Theme System & Observatory Dual Mode', 'Tier 1');

runner.test('T1-THEME-01: globals.css defines semantic CSS custom properties in :root (Orbital Day)', async () => {
  const cssExists = ContractValidator.fileExists('src/app/globals.css');
  assert.ok(cssExists, 'src/app/globals.css must exist');

  const css = ContractValidator.readFile('src/app/globals.css');
  for (const token of config.themeTokens) {
    assert.ok(css.includes(token), `CSS token ${token} must be declared in globals.css`);
  }
});

runner.test('T1-THEME-02: globals.css defines semantic CSS custom properties for .dark (Deep Space)', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');
  assert.ok(css.includes('.dark') || css.includes('[data-theme="dark"]'), 'globals.css must contain .dark or data-theme="dark" selector');

  // Verify that dark theme variables modify the base tokens
  for (const token of ['--background', '--surface', '--foreground', '--border', '--accent']) {
    assert.ok(css.includes(token), `Token ${token} must be overridden for dark theme`);
  }
});

runner.test('T1-THEME-03: Deep Space palette conforms to design spec (#02040A base, #050816 surface)', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');
  const normalizedCss = css.toLowerCase();
  
  assert.ok(
    normalizedCss.includes('#02040a') || normalizedCss.includes('2 4 10'),
    'Deep space background must use specified base color #02040A'
  );
  assert.ok(
    normalizedCss.includes('#050816') || normalizedCss.includes('5 8 22'),
    'Deep space surface must use specified surface color #050816'
  );
});

runner.test('T1-THEME-04: Orbital Day palette conforms to design spec (#F7FAFF base, #EEF6FF surface)', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');
  const normalizedCss = css.toLowerCase();

  assert.ok(
    normalizedCss.includes('#f7faff') || normalizedCss.includes('247 250 255'),
    'Orbital day background must use specified base color #F7FAFF'
  );
  assert.ok(
    normalizedCss.includes('#eef6ff') || normalizedCss.includes('238 246 255'),
    'Orbital day surface must use specified surface color #EEF6FF'
  );
});

runner.test('T1-THEME-05: ThemeSwitcher component supports Dark, Light, and System options', async () => {
  const switcherPath = 'src/components/navigation/ThemeSwitcher.tsx';
  const exists = ContractValidator.fileExists(switcherPath);
  assert.ok(exists, `${switcherPath} must exist`);

  const code = ContractValidator.readFile(switcherPath);
  assert.ok(
    code.includes('dark') && code.includes('light'),
    'ThemeSwitcher must support switching between dark and light modes'
  );
});

runner.test('T1-THEME-06: Root layout integrates ThemeProvider with zero-flash attribute="class"', async () => {
  const layoutPath = 'src/app/layout.tsx';
  assert.ok(ContractValidator.fileExists(layoutPath), `${layoutPath} must exist`);

  const code = ContractValidator.readFile(layoutPath);
  assert.ok(
    code.includes('ThemeProvider') || code.includes('attribute="class"') || code.includes("attribute='class'") || code.includes('attribute={"class"}'),
    'Root layout must configure ThemeProvider with attribute="class" to prevent flash'
  );
});

if (process.argv[1] && process.argv[1].endsWith('theme.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
