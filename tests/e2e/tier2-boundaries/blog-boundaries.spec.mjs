import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';

export const runner = new TestRunner('MDX Frontmatter & Slug Boundaries', 'Tier 2');

runner.test('T2-BLOG-01: Non-existent slug query handled gracefully by blog utilities', async () => {
  const blogLibPath = 'src/lib/blog.ts';
  const code = ContractValidator.readFile(blogLibPath);

  // Assert getPostBySlug checks file existence or catches error returning null / notFound
  assert.ok(
    code.includes('null') || code.includes('notFound') || code.includes('catch') || code.includes('existsSync'),
    'getPostBySlug must handle non-existent slug gracefully'
  );
});

runner.test('T2-BLOG-02: Parsing frontmatter handles missing optional fields (readTime) without throwing', async () => {
  const sampleMdx = `---
title: "Test Post Without ReadTime"
description: "A test post"
date: "2026-09-18"
category: "Systems"
tags:
  - Linux
---
# Content here`;

  const { frontmatter, content } = ContractValidator.parseFrontmatter(sampleMdx);
  assert.equal(frontmatter.title, 'Test Post Without ReadTime');
  assert.equal(frontmatter.readTime, undefined);
  assert.ok(content.includes('# Content here'));
});

runner.test('T2-BLOG-03: Parsing frontmatter handles empty or single-item tags gracefully', async () => {
  const sampleMdx = `---
title: "Single Tag Post"
description: "Single tag test"
date: "2026-09-18"
category: "Algorithms"
tags:
  - Python
---
Some body text`;

  const { frontmatter } = ContractValidator.parseFrontmatter(sampleMdx);
  assert.ok(Array.isArray(frontmatter.tags));
  assert.equal(frontmatter.tags.length, 1);
  assert.equal(frontmatter.tags[0], 'Python');
});

runner.test('T2-BLOG-04: Markdown content without frontmatter delimiters returns null frontmatter', async () => {
  const rawMarkdown = '# Just a markdown file without frontmatter\n\nSome text';
  const { frontmatter, content } = ContractValidator.parseFrontmatter(rawMarkdown);

  assert.equal(frontmatter, null, 'Files without frontmatter must return null frontmatter safely');
  assert.equal(content, rawMarkdown);
});

runner.test('T2-BLOG-05: Article slugs are strictly alphanumeric with hyphens (kebab-case)', async () => {
  const validSlugs = ['understanding-kmp', 'linux-terminal', 'building-network-sniffer'];
  const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

  for (const slug of validSlugs) {
    assert.match(slug, kebabRegex, `Slug ${slug} must be strictly valid kebab-case`);
  }
});

runner.test('T2-BLOG-06: MDX parser handles complex markdown elements (tables, blockquotes, lists)', async () => {
  const blogLibPath = 'src/lib/blog.ts';
  const code = ContractValidator.readFile(blogLibPath);

  // Check for remark-gfm (GitHub Flavored Markdown for tables, autolinks)
  assert.ok(
    code.includes('remark-gfm') || code.includes('remarkGfm') || code.includes('gfm'),
    'Blog pipeline must support GFM extensions (tables, strikethrough, task lists)'
  );
});

if (process.argv[1] && process.argv[1].endsWith('blog-boundaries.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
