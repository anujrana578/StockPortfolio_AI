import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const python = process.env.PYTHON || 'python';
const children = [];
let stopping = false;

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null) child.kill('SIGTERM');
  }
  process.exitCode = exitCode;
}

function start(command, args, label) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
  });
  children.push(child);
  child.on('error', (error) => {
    console.error(`[${label}] Could not start: ${error.message}`);
    stopAll(1);
  });
  child.on('exit', (code, signal) => {
    if (!stopping) {
      if (code !== 0) console.error(`[${label}] exited (${signal || code}).`);
      stopAll(code ?? 1);
    }
  });
  return child;
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

start(python, ['app.py'], 'Flask API');
start(process.execPath, [resolve(projectRoot, 'node_modules/vite/bin/vite.js')], 'Vite');
