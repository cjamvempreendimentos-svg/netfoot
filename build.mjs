import { copyFile, cp, mkdir, rm } from 'node:fs/promises';

const files = [
  'index.html',
  'calcados.html',
  'perfumaria.html',
  'sobre.html',
  'atendimento.html',
  'styles.css',
  'script.js'
];

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await Promise.all(files.map(file => copyFile(file, `dist/${file}`)));
await cp('assets', 'dist/assets', { recursive: true });

console.log(`Build concluído: ${files.length} arquivos publicados em dist/.`);
