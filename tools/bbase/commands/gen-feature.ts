import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import { toKebabCase, toPascalCase } from '../utils/casing';
import { writeProjectFile } from '../utils/file-writer';
import { logInfo, logSummary } from '../utils/logger';

const FEATURE_DIRS = [
  'components',
  'containers',
  'stores',
  'hooks',
  'services',
  'schemas',
  'types',
  'utils',
  'constants',
  'pages',
];

export interface GenFeatureOptions {
  dryRun?: boolean | undefined;
  force?: boolean | undefined;
  listView?: boolean | undefined;
  name: string;
  permission?: string | undefined;
  persist?: 'none' | 'session' | 'local' | 'redis' | undefined;
  protected?: boolean | undefined;
  public?: boolean | undefined;
  route?: boolean | undefined;
  routePath?: string | undefined;
  schema?: boolean | undefined;
  service?: boolean | undefined;
  store?: boolean | undefined;
  test?: boolean | undefined;
}

export function genFeature(options: GenFeatureOptions) {
  const featureName = toKebabCase(options.name);
  const featurePascal = toPascalCase(featureName);
  const featureCamel = `${featurePascal.charAt(0).toLowerCase()}${featurePascal.slice(1)}`;
  const root = join('src', 'features', featureName);
  const files: string[] = [];

  const writeFeatureFile = (path: string, content: string) => {
    if (
      writeProjectFile({
        content,
        dryRun: options.dryRun,
        force: options.force,
        path,
      }) === 'created'
    ) {
      files.push(path);
    }
  };

  if (!options.dryRun) {
    FEATURE_DIRS.forEach((dir) =>
      mkdirSync(join(root, dir), { recursive: true })
    );
  }

  FEATURE_DIRS.forEach((dir) => {
    const path = join(root, dir, '.gitkeep');
    if (writeProjectFile({ content: '', ...options, path }) === 'created') {
      files.push(path);
    }
  });

  const indexPath = join(root, 'index.ts');
  writeFeatureFile(indexPath, `export {};\n`);

  if (options.store) {
    const storePath = join(root, 'stores', `${featureName}.store.ts`);
    const content = `import { createStore } from '@/core/rx/create-store';\n\nexport interface ${featurePascal}State {\n  ready: boolean;\n}\n\nexport const ${featureName.replace(/-/g, '')}Store = createStore<${featurePascal}State>({\n  ready: false,\n});\n`;
    writeFeatureFile(storePath, content);
  }

  if (options.service && !options.listView) {
    const servicePath = join(root, 'services', `${featureName}.service.ts`);
    const content = `import { api } from '@/core/http/fetcher';\n\nexport const ${featureName.replace(/-/g, '')}Service = {\n  list: () => api.get('/${featureName}'),\n};\n`;
    writeFeatureFile(servicePath, content);
  }

  if (options.schema && !options.listView) {
    const schemaPath = join(root, 'schemas', `${featureName}.schema.ts`);
    const content = `import { z } from 'zod';\n\nexport const ${featureName.replace(/-/g, '')}Schema = z.object({\n  id: z.string(),\n});\n`;
    writeFeatureFile(schemaPath, content);
  }

  if (options.listView) {
    const listViewFiles: Array<[string, string]> = [
      [
        join(root, 'types', `${featureName}.types.ts`),
        `export interface ${featurePascal} {\n  id: string;\n}\n\nexport interface ${featurePascal}Filter {\n  search?: string;\n}\n`,
      ],
      [
        join(root, 'constants', `${featureName}-permissions.constants.ts`),
        `export const ${featureCamel}Permissions = {\n  read: '${featureName}:read',\n  create: '${featureName}:create',\n  update: '${featureName}:update',\n  delete: '${featureName}:delete',\n} as const;\n`,
      ],
      [
        join(root, 'schemas', `${featureName}.schema.ts`),
        `import { z } from 'zod';\n\nexport const ${featureCamel}Schema = z.object({\n  id: z.string(),\n});\n\nexport const ${featureCamel}ListSchema = z.array(${featureCamel}Schema);\n`,
      ],
      [
        join(root, 'schemas', `${featureName}-filter.schema.ts`),
        `import { z } from 'zod';\n\nexport const ${featureCamel}FilterSchema = z.object({\n  search: z.string().optional(),\n});\n`,
      ],
      [
        join(root, 'schemas', `${featureName}-form.schema.ts`),
        `import { z } from 'zod';\n\nexport const ${featureCamel}FormSchema = z.object({});\n`,
      ],
      [
        join(root, 'services', `${featureName}.service.ts`),
        `import { api } from '@/core/http/fetcher';\n\nimport { ${featureCamel}ListSchema, ${featureCamel}Schema } from '../schemas/${featureName}.schema';\nimport type { ${featurePascal}Filter } from '../types/${featureName}.types';\n\nexport const ${featureCamel}Service = {\n  list: (params: ${featurePascal}Filter = {}) =>\n    api.get('/${featureName}', {\n      params,\n      responseSchema: ${featureCamel}ListSchema,\n    }),\n  detail: (id: string) =>\n    api.get(\`/${featureName}/\${id}\`, {\n      responseSchema: ${featureCamel}Schema,\n    }),\n};\n`,
      ],
      [
        join(root, 'containers', `${featureName}-list.container.tsx`),
        `export function ${featurePascal}ListContainer() {\n  return <div>${featurePascal} list container</div>;\n}\n`,
      ],
      [
        join(root, 'containers', `${featureName}-detail.container.tsx`),
        `export function ${featurePascal}DetailContainer() {\n  return <div>${featurePascal} detail container</div>;\n}\n`,
      ],
      [
        join(root, 'containers', `${featureName}-form.container.tsx`),
        `export function ${featurePascal}FormContainer() {\n  return <div>${featurePascal} form container</div>;\n}\n`,
      ],
      [
        join(root, 'pages', `${featureName}-list.page.tsx`),
        `import { ${featurePascal}ListContainer } from '../containers/${featureName}-list.container';\n\nexport function ${featurePascal}ListPage() {\n  return <${featurePascal}ListContainer />;\n}\n`,
      ],
      [
        join(root, 'pages', `${featureName}-detail.page.tsx`),
        `import { ${featurePascal}DetailContainer } from '../containers/${featureName}-detail.container';\n\nexport function ${featurePascal}DetailPage() {\n  return <${featurePascal}DetailContainer />;\n}\n`,
      ],
      [
        join(root, 'pages', `${featureName}-form.page.tsx`),
        `import { ${featurePascal}FormContainer } from '../containers/${featureName}-form.container';\n\nexport function ${featurePascal}FormPage() {\n  return <${featurePascal}FormContainer />;\n}\n`,
      ],
      [
        join(root, 'utils', `${featureName}.mapper.ts`),
        `import type { ${featurePascal} } from '../types/${featureName}.types';\n\nexport function map${featurePascal}(value: ${featurePascal}): ${featurePascal} {\n  return value;\n}\n`,
      ],
    ];

    listViewFiles.forEach(([path, content]) => writeFeatureFile(path, content));
    logInfo(
      '--list-view scaffold aktif: list/detail/form dibuat tanpa UI CRUD polished. Route/nav integration tetap fase berikutnya.'
    );
  }

  logSummary(files, Boolean(options.dryRun));
}
