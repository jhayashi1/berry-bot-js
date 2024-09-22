import * as esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/index.ts'],
    outdir: 'dist',
    format: 'cjs',
    platform: 'node',
    target: 'node20.10',
    bundle: true,
    minifySyntax: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    keepNames: true,
    sourcemap: true,
    sourcesContent: false,
    logLevel: 'info'
}).catch(() => process.exit(1));
