import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  projectRoot: path.resolve(__dirname, '../../'),
  serverUrl: process.env.TEST_SERVER_URL || 'http://localhost:3000',
  isLiveMode: Boolean(process.env.TEST_SERVER_URL),
  timeoutMs: 5000,
  routes: [
    '/',
    '/projects',
    '/projects/systems-kernel-monitor',
    '/blog',
    '/blog/understanding-kmp',
    '/blog/linux-terminal',
    '/blog/building-network-sniffer',
    '/about',
    '/contact',
  ],
  apiRoutes: [
    '/api/contact',
  ],
  themeTokens: [
    '--background',
    '--foreground',
    '--surface',
    '--surface-elevated',
    '--border',
    '--border-hover',
    '--accent',
    '--accent-secondary',
    '--muted',
    '--success',
  ],
  expectedColors: {
    dark: {
      background: '#02040A',
      surface: '#050816',
    },
    light: {
      background: '#F7FAFF',
      surface: '#EEF6FF',
    },
  },
  starThresholds: {
    mobileMin: 30,
    mobileMax: 50,
    desktopMin: 80,
    desktopMax: 120,
  },
  rocketDurationMs: {
    min: 2000,
    max: 4000,
  },
};
