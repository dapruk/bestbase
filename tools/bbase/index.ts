#!/usr/bin/env node
import { genComponent } from './commands/gen-component';
import { genFeature } from './commands/gen-feature';
import { genStore } from './commands/gen-store';
import { initProject } from './commands/init';
import { logError, logInfo } from './utils/logger';

function hasFlag(args: string[], flag: string): boolean {
  return args.includes(flag);
}

function getOption(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function printHelp() {
  logInfo(
    `bestbase local CLI\n\nCommands:\n  npm run bbase -- gen feat {name}\n  npm run bbase -- gen component {name} --feature {feature}\n  npm run bbase -- gen store {name} --feature {feature}\n`
      + `  npm run bbase -- init\n`
  );
}

const args = process.argv.slice(2);

if (args.length === 0 || hasFlag(args, '--help')) {
  printHelp();
  process.exit(0);
}

const [scope, command, name] = args;

if (scope === 'init') {
  await initProject({
    dryRun: hasFlag(args, '--dry-run'),
    force: hasFlag(args, '--force'),
    rendering: getOption(args, '--rendering') as 'spa' | 'server' | undefined,
    router: getOption(args, '--router') as
      | 'tanstack'
      | 'react-router-framework'
      | 'uninitialized'
      | undefined,
  });
  process.exit(process.exitCode ?? 0);
}

if (scope !== 'gen' || !command || !name) {
  logError('Command tidak valid.');
  printHelp();
  process.exit(1);
}

const common = {
  dryRun: hasFlag(args, '--dry-run'),
  force: hasFlag(args, '--force'),
};

if (command === 'feat') {
  genFeature({
    ...common,
    listView: hasFlag(args, '--list-view'),
    name,
    permission: getOption(args, '--permission'),
    persist: getOption(args, '--persist') as
      | 'none'
      | 'session'
      | 'local'
      | 'redis'
      | undefined,
    protected: hasFlag(args, '--protected'),
    public: hasFlag(args, '--public'),
    route: hasFlag(args, '--route'),
    routePath: getOption(args, '--path'),
    schema: hasFlag(args, '--schema'),
    service: hasFlag(args, '--service'),
    store: hasFlag(args, '--store'),
    test: hasFlag(args, '--test'),
  });
  process.exit(0);
}

if (command === 'component') {
  const feature = getOption(args, '--feature');

  if (!feature) {
    logError('--feature wajib diisi untuk gen component.');
    process.exit(1);
  }

  genComponent({ ...common, feature, name });
  process.exit(0);
}

if (command === 'store') {
  const feature = getOption(args, '--feature');

  if (!feature) {
    logError('--feature wajib diisi untuk gen store.');
    process.exit(1);
  }

  genStore({ ...common, feature, name });
  process.exit(0);
}

logError(`Command gen ${command} belum tersedia.`);
process.exit(1);
