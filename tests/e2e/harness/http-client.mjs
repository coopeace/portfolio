import { config } from '../config.mjs';

export class HttpClient {
  constructor(baseUrl = config.serverUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async isServerReachable() {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${this.baseUrl}/`, { signal: controller.signal });
      clearTimeout(id);
      return res.status < 500;
    } catch {
      return false;
    }
  }

  async get(routePath, options = {}) {
    const url = `${this.baseUrl}${routePath.startsWith('/') ? routePath : '/' + routePath}`;
    const controller = new AbortController();
    const timeout = options.timeout || config.timeoutMs;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const start = Date.now();
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/json,*/*',
          ...(options.headers || {}),
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const duration = Date.now() - start;
      const text = await res.text();

      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        duration,
        body: text,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw new Error(`HTTP GET ${url} failed: ${err.message}`);
    }
  }

  async post(routePath, data = {}, options = {}) {
    const url = `${this.baseUrl}${routePath.startsWith('/') ? routePath : '/' + routePath}`;
    const controller = new AbortController();
    const timeout = options.timeout || config.timeoutMs;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const start = Date.now();
    try {
      const isJson = typeof data === 'object' && !(data instanceof FormData);
      const body = isJson ? JSON.stringify(data) : data;
      const headers = {
        'Accept': 'application/json',
        ...(isJson ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      };

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const duration = Date.now() - start;
      const text = await res.text();

      let json = null;
      try {
        json = JSON.parse(text);
      } catch {
        // Not JSON
      }

      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        duration,
        body: text,
        json,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      throw new Error(`HTTP POST ${url} failed: ${err.message}`);
    }
  }
}

export const httpClient = new HttpClient();
