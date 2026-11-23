// Empties the build folder before a build, so files removed from src/ or public/
// do not linger in _site/. Only ever touches _site/ inside this project.
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
rmSync(join(projectRoot, '_site'), { recursive: true, force: true });
