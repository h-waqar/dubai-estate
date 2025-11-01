# Fix for `PropertyForm.tsx` Imports

You are correct to point out the error. The type `CreatePropertyInput` should be imported from your types file, not the validator file. 

---

### Incorrect Imports

My previous skeleton had this incorrect import:

```tsx
// Incorrect
import { createPropertyValidator, CreatePropertyInput } from '../validators/createProperty.validator';
```

### Corrected Imports

Please replace the incorrect import with these two lines:

```tsx
// Correct
import { createPropertyValidator } from '../validators/createProperty.validator';
import type { CreatePropertyInput } from '../types/property.types';
```

Using `import type` is best practice when importing only TypeScript types.

---

### Updated `PropertyForm.tsx` Snippet

Here is the top of the `PropertyForm.tsx` file with the corrected imports for your reference:

```tsx
// src/modules/property/components/PropertyForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPropertyValidator } from '../validators/createProperty.validator';
import type { CreatePropertyInput } from '../types/property.types'; // <-- CORRECTED IMPORT
import { createPropertyAction } from '../actions/createProperty';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// ... rest of the component
```
