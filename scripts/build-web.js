#!/usr/bin/env node
// 把单文件 index.html 复制到 www/index.html 供 Capacitor 打包。
// 单文件零依赖，无需打包器；换用构建链时只需替换这里。
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'index.html');
const outdir = path.join(root, 'www');
fs.mkdirSync(outdir, { recursive: true });
fs.copyFileSync(src, path.join(outdir, 'index.html'));
console.log(`www/index.html <- index.html (${fs.statSync(src).size} bytes)`);
