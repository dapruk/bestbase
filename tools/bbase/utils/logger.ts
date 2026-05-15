export function logInfo(message: string) {
  console.log(message);
}

export function logError(message: string) {
  console.error(message);
}

export function logSummary(files: string[], dryRun: boolean) {
  const prefix = dryRun ? '[dry-run]' : '[created]';

  files.forEach((file) => logInfo(`${prefix} ${file}`));
  logInfo(`${files.length} file(s) planned/created.`);
}
