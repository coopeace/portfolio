import { runner as themeRunner } from './tier1-features/theme.spec.mjs';
import { runner as rocketRunner } from './tier1-features/rocket.spec.mjs';
import { runner as routesRunner } from './tier1-features/routes.spec.mjs';
import { runner as achievementsRunner } from './tier1-features/achievements.spec.mjs';
import { runner as blogRunner } from './tier1-features/blog.spec.mjs';
import { runner as contactRunner } from './tier1-features/contact.spec.mjs';
import { runner as responsiveRunner } from './tier1-features/responsive.spec.mjs';

import { runner as contactBoundariesRunner } from './tier2-boundaries/contact-boundaries.spec.mjs';
import { runner as rocketBoundariesRunner } from './tier2-boundaries/rocket-boundaries.spec.mjs';
import { runner as themeBoundariesRunner } from './tier2-boundaries/theme-boundaries.spec.mjs';
import { runner as blogBoundariesRunner } from './tier2-boundaries/blog-boundaries.spec.mjs';
import { runner as routeBoundariesRunner } from './tier2-boundaries/route-boundaries.spec.mjs';
import { runner as particleBoundariesRunner } from './tier2-boundaries/particle-boundaries.spec.mjs';

import { runner as pairwiseRunner } from './tier3-combinations/pairwise-matrix.spec.mjs';
import { runner as journeysRunner } from './tier4-journeys/user-journeys.spec.mjs';

const suites = [
  // Tier 1
  themeRunner,
  rocketRunner,
  routesRunner,
  achievementsRunner,
  blogRunner,
  contactRunner,
  responsiveRunner,

  // Tier 2
  contactBoundariesRunner,
  rocketBoundariesRunner,
  themeBoundariesRunner,
  blogBoundariesRunner,
  routeBoundariesRunner,
  particleBoundariesRunner,

  // Tier 3
  pairwiseRunner,

  // Tier 4
  journeysRunner,
];

async function main() {
  console.log('\n======================================================');
  console.log('   SHISHIR DEV PORTFOLIO — MASTER E2E TEST RUNNER     ');
  console.log('   4-Tier Dual Track Opaque-Box Test Suite            ');
  console.log('======================================================\n');

  const suiteResults = [];
  const tierStats = {
    'Tier 1': { passed: 0, failed: 0, total: 0 },
    'Tier 2': { passed: 0, failed: 0, total: 0 },
    'Tier 3': { passed: 0, failed: 0, total: 0 },
    'Tier 4': { passed: 0, failed: 0, total: 0 },
  };

  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  const overallStart = Date.now();

  for (const suite of suites) {
    const res = await suite.run();
    suiteResults.push(res);

    const tier = res.tier;
    if (tierStats[tier]) {
      tierStats[tier].passed += res.passed;
      tierStats[tier].failed += res.failed;
      tierStats[tier].total += res.total;
    }

    totalPassed += res.passed;
    totalFailed += res.failed;
    totalTests += res.total;
  }

  const overallDuration = Date.now() - overallStart;

  console.log('\n======================================================');
  console.log('                  FINAL TEST REPORT                   ');
  console.log('======================================================');
  console.log(`Execution Time: ${overallDuration}ms`);
  console.log(`Total Suites:   ${suites.length}`);
  console.log(`Total Tests:    ${totalTests}`);
  console.log(`Total Passed:   ${totalPassed}`);
  console.log(`Total Failed:   ${totalFailed}`);
  console.log('------------------------------------------------------');
  console.log('Tier Breakdown:');
  for (const [tier, stats] of Object.entries(tierStats)) {
    const status = stats.failed === 0 ? '[OK]' : '[FAILED]';
    console.log(`  ${tier.padEnd(8)}: ${stats.passed}/${stats.total} passed (failed: ${stats.failed}) ${status}`);
  }
  console.log('======================================================\n');

  if (totalFailed > 0) {
    console.error(`[!] E2E Test Run Completed with ${totalFailed} failure(s).`);
    process.exit(1);
  } else {
    console.log('[*] All E2E Test Suites Passed Successfully!');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
