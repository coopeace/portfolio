export class DomInspector {
  static extractMeta(html, propertyOrName) {
    const regex = new RegExp(`<meta\\s+[^>]*(?:name|property)=["']${propertyOrName}["'][^>]*content=["']([^"']*)["']`, 'i');
    const match = html.match(regex);
    if (match) return match[1];

    // Check inverse ordering: content first, then name/property
    const regexInverse = new RegExp(`<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${propertyOrName}["']`, 'i');
    const matchInverse = html.match(regexInverse);
    return matchInverse ? matchInverse[1] : null;
  }

  static extractTitle(html) {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match ? match[1].trim() : null;
  }

  static hasTag(html, tagName) {
    const regex = new RegExp(`<${tagName}\\b[^>]*>`, 'i');
    return regex.test(html);
  }

  static countTags(html, tagName) {
    const regex = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
    const matches = html.match(regex);
    return matches ? matches.length : 0;
  }

  static findAttributes(html, tagName, attributeName) {
    const regex = new RegExp(`<${tagName}\\b[^>]*\\b${attributeName}=["']([^"']*)["'][^>]*>`, 'gi');
    const results = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      results.push(match[1]);
    }
    return results;
  }

  static hasSemanticLandmarks(html) {
    return {
      hasHeader: this.hasTag(html, 'header'),
      hasNav: this.hasTag(html, 'nav'),
      hasMain: this.hasTag(html, 'main'),
      hasFooter: this.hasTag(html, 'footer'),
      hasSection: this.hasTag(html, 'section'),
      hasArticle: this.hasTag(html, 'article'),
    };
  }

  static extractLinks(html) {
    const hrefs = [];
    const regex = /<a\b[^>]*\bhref=["']([^"']*)["'][^>]*>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
      hrefs.push(match[1]);
    }
    return hrefs;
  }

  static extractCssVariables(cssContent) {
    const vars = new Map();
    const regex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = regex.exec(cssContent)) !== null) {
      vars.set(match[1].trim(), match[2].trim());
    }
    return vars;
  }

  static hasClass(html, className) {
    const regex = new RegExp(`class=["'][^"']*\\b${className}\\b[^"']*["']`, 'i');
    return regex.test(html);
  }

  static hasText(html, text) {
    return html.includes(text);
  }
}
