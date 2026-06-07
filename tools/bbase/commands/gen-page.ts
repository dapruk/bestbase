import { join } from 'node:path';

import { toKebabCase, toPascalCase } from '../utils/casing';
import { writeProjectFile } from '../utils/file-writer';
import { logError, logSummary } from '../utils/logger';

export type PageTemplate = 'auth' | 'dashboard';

export interface GenPageOptions {
  dryRun?: boolean | undefined;
  force?: boolean | undefined;
  name: string;
  template?: PageTemplate | undefined;
}

export function genPage(options: GenPageOptions) {
  if (options.template === 'auth') {
    generateAuthPages(options);
    return;
  }

  if (options.template !== 'dashboard') {
    logError(
      'Template page belum tersedia. Gunakan: --dashboard-page atau --auth-pages'
    );
    process.exitCode = 1;
    return;
  }

  const pageName = toKebabCase(options.name);
  const pagePascal = toPascalCase(pageName);
  const path = join('src', 'pages', pageName, `${pagePascal}Page.tsx`);
  const content = dashboardPageTemplate(pagePascal);
  const files =
    writeProjectFile({ content, ...options, path }) === 'created' ? [path] : [];

  logSummary(files, Boolean(options.dryRun));
}

function generateAuthPages(options: GenPageOptions) {
  const files: string[] = [];
  const write = (path: string, content: string) => {
    if (writeProjectFile({ content, ...options, path }) === 'created') {
      files.push(path);
    }
  };

  write(
    join('src', 'pages', 'login', 'LoginPage.tsx'),
    authPageTemplate({
      description: 'Masuk dengan email dan password.',
      fields: [
        { autocomplete: 'email', label: 'Email', name: 'email', type: 'email' },
        {
          autocomplete: 'current-password',
          label: 'Password',
          name: 'password',
          type: 'password',
        },
      ],
      submitText: 'Masuk',
      title: 'Login',
    })
  );
  write(
    join('src', 'pages', 'register', 'RegisterPage.tsx'),
    authPageTemplate({
      description: 'Buat akun baru untuk mulai memakai aplikasi.',
      fields: [
        { autocomplete: 'name', label: 'Name', name: 'name', type: 'text' },
        { autocomplete: 'email', label: 'Email', name: 'email', type: 'email' },
        {
          autocomplete: 'new-password',
          label: 'Password',
          name: 'password',
          type: 'password',
        },
        {
          autocomplete: 'new-password',
          label: 'Confirm password',
          name: 'confirmPassword',
          type: 'password',
        },
      ],
      submitText: 'Daftar',
      title: 'Register',
    })
  );
  write(
    join('src', 'pages', 'forgot-password', 'ForgotPasswordPage.tsx'),
    authPageTemplate({
      description: 'Kirim instruksi reset password ke email pengguna.',
      fields: [
        { autocomplete: 'email', label: 'Email', name: 'email', type: 'email' },
      ],
      submitText: 'Kirim instruksi',
      title: 'Forgot Password',
    })
  );

  logSummary(files, Boolean(options.dryRun));
}

function dashboardPageTemplate(pagePascal: string) {
  return `import { BaseButton } from '@/shared/components/button';\nimport { PaneLayout } from '@/shared/components/layout';\nimport { Badge } from '@/shared/components/ui/badge';\nimport { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';\n\ninterface DashboardKpi {\n  label: string;\n  tone: 'good' | 'neutral' | 'warning';\n  trend: string;\n  value: string;\n}\n\ninterface DashboardSeriesPoint {\n  label: string;\n  value: number;\n}\n\ninterface DashboardActivity {\n  description: string;\n  label: string;\n  time: string;\n}\n\nconst kpis: DashboardKpi[] = [\n  { label: 'Revenue', tone: 'good', trend: '+12.4%', value: 'Rp42.8M' },\n  { label: 'Open orders', tone: 'neutral', trend: '+8', value: '128' },\n  { label: 'Pending review', tone: 'warning', trend: '14 items', value: '24' },\n  { label: 'Conversion', tone: 'good', trend: '+2.1%', value: '7.8%' },\n];\n\nconst series: DashboardSeriesPoint[] = [\n  { label: 'Mon', value: 42 },\n  { label: 'Tue', value: 58 },\n  { label: 'Wed', value: 36 },\n  { label: 'Thu', value: 74 },\n  { label: 'Fri', value: 64 },\n  { label: 'Sat', value: 48 },\n  { label: 'Sun', value: 68 },\n];\n\nconst activities: DashboardActivity[] = [\n  { label: 'Invoice approved', description: 'Finance team approved a pending invoice.', time: '2m ago' },\n  { label: 'New customer', description: 'A customer completed onboarding.', time: '18m ago' },\n  { label: 'Stock warning', description: 'One product is near reorder threshold.', time: '1h ago' },\n];\n\nexport function ${pagePascal}Page() {\n  return (\n    <section className="flex flex-col gap-4">\n      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">\n        <div>\n          <h1 className="text-2xl font-semibold tracking-tight">${pagePascal}</h1>\n          <p className="text-sm text-muted-foreground">Operational snapshot ready to connect to real data.</p>\n        </div>\n        <div className="flex gap-2">\n          <BaseButton variant="outline">Export</BaseButton>\n          <BaseButton>New action</BaseButton>\n        </div>\n      </div>\n\n      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">\n        {kpis.map((kpi) => (\n          <Card key={kpi.label}>\n            <CardHeader>\n              <CardDescription>{kpi.label}</CardDescription>\n              <CardTitle>{kpi.value}</CardTitle>\n            </CardHeader>\n            <CardContent>\n              <Badge variant={kpi.tone === 'warning' ? 'secondary' : 'default'}>{kpi.trend}</Badge>\n            </CardContent>\n          </Card>\n        ))}\n      </div>\n\n      <PaneLayout gap={16}>\n        <PaneLayout.Pane size={65}>\n          <Card className="w-full">\n            <CardHeader>\n              <CardTitle>Weekly performance</CardTitle>\n              <CardDescription>Replace placeholder series with query data.</CardDescription>\n            </CardHeader>\n            <CardContent>\n              <div className="flex h-64 items-end gap-3">\n                {series.map((point) => (\n                  <div key={point.label} className="flex flex-1 flex-col items-center gap-2">\n                    <div className="w-full rounded-t bg-primary" style={{ height: \`\${point.value}%\` }} />\n                    <span className="text-xs text-muted-foreground">{point.label}</span>\n                  </div>\n                ))}\n              </div>\n            </CardContent>\n          </Card>\n        </PaneLayout.Pane>\n\n        <PaneLayout.Pane size={35}>\n          <Card className="w-full">\n            <CardHeader>\n              <CardTitle>Recent activity</CardTitle>\n              <CardDescription>Keep this presentational; fetch in container/store later.</CardDescription>\n            </CardHeader>\n            <CardContent>\n              <div className="flex flex-col gap-4">\n                {activities.map((activity) => (\n                  <div key={activity.label} className="border-b pb-3 last:border-b-0 last:pb-0">\n                    <div className="flex items-center justify-between gap-3">\n                      <p className="text-sm font-medium">{activity.label}</p>\n                      <span className="text-xs text-muted-foreground">{activity.time}</span>\n                    </div>\n                    <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>\n                  </div>\n                ))}\n              </div>\n            </CardContent>\n          </Card>\n        </PaneLayout.Pane>\n      </PaneLayout>\n    </section>\n  );\n}\n`;
}

function authPageTemplate({
  description,
  fields,
  submitText,
  title,
}: {
  description: string;
  fields: Array<{
    autocomplete: string;
    label: string;
    name: string;
    type: string;
  }>;
  submitText: string;
  title: string;
}) {
  const fieldMarkup = fields
    .map(
      (field) =>
        `          <div className="grid gap-2">\n            <Label htmlFor="${field.name}">${field.label}</Label>\n            <Input autoComplete="${field.autocomplete}" id="${field.name}" name="${field.name}" type="${field.type}" />\n          </div>`
    )
    .join('\n');
  const componentName = `${title.replace(/\s+/gu, '')}Page`;

  return `import { BaseButton } from '@/shared/components/button';\nimport { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';\nimport { Input } from '@/shared/components/ui/input';\nimport { Label } from '@/shared/components/ui/label';\n\nexport function ${componentName}() {\n  return (\n    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">\n      <Card className="w-full max-w-sm">\n        <CardHeader>\n          <CardTitle>${title}</CardTitle>\n          <CardDescription>${description}</CardDescription>\n        </CardHeader>\n        <CardContent>\n          <form className="grid gap-4">\n${fieldMarkup}\n            <BaseButton fullWidth type="submit">${submitText}</BaseButton>\n          </form>\n        </CardContent>\n      </Card>\n    </section>\n  );\n}\n`;
}
