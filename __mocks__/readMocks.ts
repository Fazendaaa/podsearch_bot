'use strict';

import { readFileSync } from 'fs';
import { join } from 'path';

export const readMock = (filename: string) => JSON.parse(readFileSync(join(__dirname, `./${filename}`), 'utf8'));
