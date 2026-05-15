import { join } from 'node:path';

import { toKebabCase, toPascalCase } from '../utils/casing';
import { writeProjectFile } from '../utils/file-writer';
import { logSummary } from '../utils/logger';

export function genComponent(options: {
  dryRun?: boolean;
  feature: string;
  force?: boolean;
  name: string;
}) {
  const fileName = toKebabCase(options.name);
  const componentName = toPascalCase(options.name);
  const featureName = toKebabCase(options.feature);
  const path = join(
    'src',
    'features',
    featureName,
    'components',
    `${fileName}.tsx`
  );
  const content = `interface ${componentName}Props {\n  title?: string;\n}\n\nexport function ${componentName}({ title = '${componentName}' }: ${componentName}Props) {\n  return <div>{title}</div>;\n}\n`;
  const files =
    writeProjectFile({ content, ...options, path }) === 'created' ? [path] : [];

  logSummary(files, Boolean(options.dryRun));
}
