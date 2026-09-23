import { TestRunner, assert } from '../harness/runner.mjs';
import { ContractValidator } from '../harness/contract-validator.mjs';

export const runner = new TestRunner('MDX Blog Pipeline & Content Layer', 'Tier 1');

runner.test('T1-BLOG-01: Blog articles exist in content/blog/ with .mdx extension', async () => {
  const articles = [
    'content/blog/understanding-kmp.mdx',
    'content/blog/linux-terminal.mdx',
    'content/blog/building-network-sniffer.mdx',
  ];

  for (const article of articles) {
    assert.ok(ContractValidator.fileExists(article), `Expected blog article ${article} to exist`);
  }
});

runner.test('T1-BLOG-02: understanding-kmp.mdx has valid frontmatter (title, description, date, category, tags)', async () => {
  const content = ContractValidator.readFile('content/blog/understanding-kmp.mdx');
  const { frontmatter } = ContractValidator.parseFrontmatter(content);

  assert.ok(frontmatter, 'Must contain parsed YAML frontmatter');
  assert.ok(frontmatter.title, 'Frontmatter must have title');
  assert.ok(frontmatter.description, 'Frontmatter must have description');
  assert.ok(frontmatter.date, 'Frontmatter must have date');
  assert.ok(frontmatter.category, 'Frontmatter must have category');
  assert.ok(Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0, 'Frontmatter must have tags array');
});

runner.test('T1-BLOG-03: Dates across all MDX articles follow YYYY-MM-DD format', async () => {
  const articles = [
    'content/blog/understanding-kmp.mdx',
    'content/blog/linux-terminal.mdx',
    'content/blog/building-network-sniffer.mdx',
  ];

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  for (const article of articles) {
    const fileContent = ContractValidator.readFile(article);
    const { frontmatter } = ContractValidator.parseFrontmatter(fileContent);
    assert.ok(frontmatter?.date, `Article ${article} must have date`);
    assert.match(String(frontmatter.date), dateRegex, `Article ${article} date must match YYYY-MM-DD`);
  }
});

runner.test('T1-BLOG-04: MDX articles contain fenced code blocks with language identifiers', async () => {
  const articles = [
    'content/blog/understanding-kmp.mdx',
    'content/blog/linux-terminal.mdx',
    'content/blog/building-network-sniffer.mdx',
  ];

  for (const article of articles) {
    const fileContent = ContractValidator.readFile(article);
    // Regex for fenced code block with language: ```(python|bash|c|typescript|javascript|sh)
    const hasLanguageCodeBlock = /```(python|bash|sh|c|cpp|typescript|javascript|rust|json)/i.test(fileContent);
    assert.ok(hasLanguageCodeBlock, `Article ${article} must contain code blocks with explicit language tags`);
  }
});

runner.test('T1-BLOG-05: src/lib/blog.ts exports getAllPosts and getPostBySlug functions', async () => {
  const blogLibPath = 'src/lib/blog.ts';
  assert.ok(ContractValidator.fileExists(blogLibPath), `${blogLibPath} must exist`);

  const code = ContractValidator.readFile(blogLibPath);
  assert.ok(code.includes('getAllPosts'), 'blog.ts must export getAllPosts');
  assert.ok(code.includes('getPostBySlug'), 'blog.ts must export getPostBySlug');
});

runner.test('T1-BLOG-06: MDX pipeline integrates syntax highlighting plugin (rehype-highlight or equivalent)', async () => {
  const blogLibPath = 'src/lib/blog.ts';
  const code = ContractValidator.readFile(blogLibPath);

  assert.ok(
    code.includes('rehype') || code.includes('highlight') || code.includes('prism'),
    'Blog pipeline must configure syntax highlighting'
  );
});

if (process.argv[1] && process.argv[1].endsWith('blog.spec.mjs')) {
  runner.run().then(res => process.exit(res.failed > 0 ? 1 : 0));
}
