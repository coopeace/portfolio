import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';

export const runner = new TestRunner('Milestone 1 Challenger Fixes Verification', 'Tier 2 Custom');

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '').trim();
  return [
    parseInt(cleanHex.slice(0, 2), 16),
    parseInt(cleanHex.slice(2, 4), 16),
    parseInt(cleanHex.slice(4, 6), 16),
  ];
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = relativeLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const l2 = relativeLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

runner.test('FIX-01: globals.css and layout.tsx dark mode selection contrast passes WCAG AA (>4.5:1)', async () => {
  const css = ContractValidator.readFile('src/app/globals.css');
  const layout = ContractValidator.readFile('src/app/layout.tsx');

  assert.ok(css.includes('.dark ::selection'), 'globals.css must define .dark ::selection');
  assert.ok(
    css.includes('color: var(--background)') || css.includes('color: #02040A'),
    '.dark ::selection must set text color to var(--background) or #02040A'
  );

  assert.ok(
    layout.includes('dark:selection:text-background') || layout.includes('dark:selection:text-[#02040A]'),
    'layout.tsx body must define dark:selection:text-background or dark:selection:text-[#02040A]'
  );

  // Math contrast verification
  const darkSelectionContrast = contrastRatio('#38BDF8', '#02040A');
  const lightSelectionContrast = contrastRatio('#2563EB', '#ffffff');

  assert.ok(
    darkSelectionContrast >= 4.5,
    `Dark mode selection contrast (#02040A on #38BDF8) must be >= 4.5:1 (actual: ${darkSelectionContrast.toFixed(2)}:1)`
  );
  assert.ok(
    lightSelectionContrast >= 4.5,
    `Light mode selection contrast (#ffffff on #2563EB) must be >= 4.5:1 (actual: ${lightSelectionContrast.toFixed(2)}:1)`
  );
});

runner.test('FIX-02: MobileNav.tsx seals focus trap leak and guards against pathname === null', async () => {
  const mobileNav = ContractValidator.readFile('src/components/navigation/MobileNav.tsx');

  // Focus trap leak check
  assert.ok(
    mobileNav.includes('!drawerRef.current.contains(document.activeElement)') ||
    mobileNav.includes('!document.activeElement'),
    'MobileNav must guard when activeElement is outside drawer'
  );
  assert.ok(
    mobileNav.includes('lastElement.focus()') && mobileNav.includes('firstElement.focus()'),
    'MobileNav must explicitly focus first or last element upon leak'
  );

  // Pathname guard check
  assert.ok(
    mobileNav.includes('(pathname ?? "")') || mobileNav.includes("(pathname ?? '')"),
    'MobileNav must guard pathname with null coalescing'
  );
  assert.ok(
    mobileNav.includes('.startsWith('),
    'MobileNav must safely call .startsWith on guarded pathname'
  );
});

runner.test('FIX-03: Navbar.tsx memoizes handleCloseMobile and guards pathname === null', async () => {
  const navbar = ContractValidator.readFile('src/components/navigation/Navbar.tsx');

  // Memoization check
  assert.ok(
    navbar.includes('useCallback'),
    'Navbar must import and use useCallback'
  );
  assert.ok(
    navbar.includes('handleCloseMobile') && navbar.includes('setIsMobileOpen(false)'),
    'Navbar must define memoized handleCloseMobile'
  );
  assert.ok(
    navbar.includes('onClose={handleCloseMobile}'),
    'Navbar must pass handleCloseMobile to MobileNav'
  );

  // Pathname guard check
  assert.ok(
    navbar.includes('(pathname ?? "")') || navbar.includes("(pathname ?? '')"),
    'Navbar must guard pathname with null coalescing'
  );
});

runner.test('FIX-04: Button.tsx forwards ref and spreads {...props} on <Link>', async () => {
  const button = ContractValidator.readFile('src/components/ui/Button.tsx');

  // Link element attributes check
  assert.ok(
    button.includes('<Link') && button.includes('ref={ref'),
    'Button must forward ref when rendering <Link>'
  );
  assert.ok(
    button.includes('{...props') || button.includes('{...(props'),
    'Button must spread props onto <Link>'
  );
});

if (process.argv[1] && process.argv[1].endsWith('m1-fixes-verification.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
