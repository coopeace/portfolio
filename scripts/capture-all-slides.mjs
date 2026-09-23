import fs from 'fs';
import path from 'path';

const DEBUGGER_PORT = 9222;

async function getNewPageWsUrl() {
  const res = await fetch(`http://localhost:${DEBUGGER_PORT}/json/new?about:blank`, { method: 'PUT' });
  const data = await res.json();
  return data.webSocketDebuggerUrl;
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.callbacks = new Map();
    this.id = 0;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  async send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function captureSlide(cdp, url, theme, outputPath, scrollTo = null) {
  console.log(`[Capture] Navigating to ${url} (Theme: ${theme})...`);

  // Emulate Retina 4K (1920x1080 @ 2x scale = 3840x2160)
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 2,
    mobile: false,
  });

  // Emulate color scheme
  await cdp.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-color-scheme', value: theme }],
  });

  await cdp.send('Page.navigate', { url });

  // Wait for load event
  await new Promise((r) => setTimeout(r, 2200));

  // Force theme classes and storage
  await cdp.send('Runtime.evaluate', {
    expression: `
      (function() {
        if ('${theme}' === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          document.documentElement.style.colorScheme = 'light';
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
          localStorage.setItem('theme', 'dark');
        }
        ${scrollTo ? `window.scrollTo({ top: ${scrollTo}, behavior: 'instant' });` : ''}
      })()
    `,
  });

  // Wait for layout and styles to paint
  await new Promise((r) => setTimeout(r, 1200));

  console.log(`[Capture] Taking screenshot -> ${outputPath}`);
  const result = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
  });

  const buffer = Buffer.from(result.data, 'base64');
  fs.writeFileSync(outputPath, buffer);
  console.log(`[Capture] Saved ${outputPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

async function main() {
  const outDir = path.resolve('public/presentation');
  fs.mkdirSync(outDir, { recursive: true });

  const wsUrl = await getNewPageWsUrl();
  const cdp = new CDPClient(wsUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const slides = [\n    { url: 'http://localhost:3088/', theme: 'dark', file: '01-hero-mission-4k.png' },
    { url: 'http://localhost:3088/about', theme: 'dark', file: '02-about-4k.png' },
    { url: 'http://localhost:3088/projects', theme: 'dark', file: '03-projects-4k.png' },
    { url: 'http://localhost:3088/blog', theme: 'dark', file: '04-blog-4k.png' },
    { url: 'http://localhost:3088/projects/packet-lens', theme: 'dark', file: '05-packetlens-dossier-4k.png' },
    { url: 'http://localhost:3088/contact', theme: 'dark', file: '06-contact-4k.png' },
    { url: 'http://localhost:3088/', theme: 'light', file: '01-hero-mission-light-4k.png' },
    { url: 'http://localhost:3088/about', theme: 'light', file: '02-about-light-4k.png' },
    { url: 'http://localhost:3088/projects', theme: 'light', file: '03-projects-light-4k.png' },
    { url: 'http://localhost:3088/blog', theme: 'light', file: '04-blog-light-4k.png' },
    { url: 'http://localhost:3088/projects/packet-lens', theme: 'light', file: '05-packetlens-dossier-light-4k.png' },
    { url: 'http://localhost:3088/contact', theme: 'light', file: '06-contact-light-4k.png' },
  ];

  for (const slide of slides) {
    const dest = path.join(outDir, slide.file);
    await captureSlide(cdp, slide.url, slide.theme, dest, slide.scrollTo);
  }

  cdp.close();
  console.log('All slides successfully generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
