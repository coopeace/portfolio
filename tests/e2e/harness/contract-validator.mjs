import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.mjs';

export class ContractValidator {
  static getFilePath(relativePath) {
    return path.join(config.projectRoot, relativePath);
  }

  static fileExists(relativePath) {
    const fullPath = this.getFilePath(relativePath);
    return fs.existsSync(fullPath);
  }

  static readFile(relativePath) {
    const fullPath = this.getFilePath(relativePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${relativePath}`);
    }
    return fs.readFileSync(fullPath, 'utf8');
  }

  static parseFrontmatter(fileContent) {
    const match = fileContent.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
    if (!match) {
      return { frontmatter: null, content: fileContent };
    }

    const rawYaml = match[1];
    const content = match[2];
    const frontmatter = {};

    const lines = rawYaml.split(/\r?\n/);
    let currentKey = null;
    let inArray = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('- ') && inArray && currentKey) {
        frontmatter[currentKey].push(trimmed.replace(/^-\s*/, '').replace(/^['"]|['"]$/g, ''));
        continue;
      }

      const colonIdx = line.indexOf(':');
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx).trim();
        const valuePart = line.slice(colonIdx + 1).trim();

        if (valuePart === '') {
          // Might be an array
          currentKey = key;
          frontmatter[key] = [];
          inArray = true;
        } else {
          inArray = false;
          currentKey = null;
          let val = valuePart.replace(/^['"]|['"]$/g, '');
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          frontmatter[key] = val;
        }
      }
    }

    return { frontmatter, content };
  }

  static validateRocketStateMachine(states, transitions) {
    // Valid states: idle, hover, igniting, countdown, launching, complete
    const validStates = ['idle', 'hover', 'igniting', 'countdown', 'launching', 'complete'];
    const invalidStates = states.filter(s => !validStates.includes(s));
    if (invalidStates.length > 0) {
      return { valid: false, error: `Invalid states: ${invalidStates.join(', ')}` };
    }

    // Expected transition paths
    const validTransitions = {
      idle: ['hover', 'igniting', 'countdown'],
      hover: ['idle', 'igniting', 'countdown'],
      igniting: ['countdown', 'launching'],
      countdown: ['launching', 'idle'],
      launching: ['complete'],
      complete: ['idle'],
    };

    for (const [from, to] of transitions) {
      if (!validTransitions[from] || !validTransitions[from].includes(to)) {
        return { valid: false, error: `Illegal transition from ${from} to ${to}` };
      }
    }

    return { valid: true, error: null };
  }
}
