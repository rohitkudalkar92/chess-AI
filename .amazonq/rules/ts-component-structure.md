# TypeScript Component File Structure

## File Ordering
Every Angular component `.ts` file must follow this exact order:

1. **Imports** — Angular core, third-party, then local/shared imports
2. **@Component decorator** — selector, imports, templateUrl, styleUrl
3. **Class body** — in this order:
   - `@Input()` / `input()` declarations
   - `@Output()` / `EventEmitter` declarations
   - Public properties
   - Private properties
   - Constructor / `inject()` calls
   - Lifecycle hooks (`ngOnInit`, `ngOnDestroy`, etc.)
   - Getters
   - Setters
   - Public methods
   - Private methods

## Import Ordering
```typescript
// 1. Angular core
import { Component, input, Output, EventEmitter } from '@angular/core';
// 2. Angular modules
import { RouterLink } from '@angular/router';
// 3. Third-party libraries
// 4. Local/shared imports
import { Variant } from '../shared/enums';
```

## Rules
- One component per file
- Use `input()` signal inputs where supported, otherwise `@Input()`
- Use shared enums from `shared/enums.ts` instead of inline string literals
- Keep component classes under 200 lines — extract logic into services if larger
- Prefix private properties and methods with `_`
