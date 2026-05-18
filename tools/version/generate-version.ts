import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

interface PackageJson {
  version?: string;
}

function hasFlag(flag: string): boolean {
  return process.argv.slice(2).includes(flag);
}

function withLocalSuffix(version: string): string {
  return version.endsWith('-local') ? version : `${version}-local`;
}

const packageJson = JSON.parse(
  readFileSync(resolve('package.json'), 'utf8')
) as PackageJson;

const baseVersion =
  process.env.VITE_APP_VERSION || packageJson.version || '0.0.0';
const shouldUseLocalVersion =
  hasFlag('--local') ||
  process.env.BESTBASE_LOCAL_VERSION === 'true' ||
  process.env.NODE_ENV === 'development';
const version = shouldUseLocalVersion
  ? withLocalSuffix(baseVersion)
  : baseVersion;
const outputPath = resolve('public/version.json');
const payload = {
  buildTime: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  version,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

console.info(`Generated public/version.json for version ${version}`);
