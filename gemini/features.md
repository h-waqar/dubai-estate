# Dubai Estate: Property Module Features

This document provides a technical overview of the `property` module, detailing its core entities, key workflows, and architectural components. The module is responsible for all logic related to property listings, including creation, management, and display.

## Core Entities

The module revolves around a few key data models managed by Prisma.

| Entity         | Description                                                                                                  | Prisma Model      |
| :------------- | :----------------------------------------------------------------------------------------------------------- | :---------------- |
| **Property**   | The central entity representing a real estate listing. It includes details like price, location, and size.     | `Property`        |
| **Feature**    | A specific characteristic of a property (e.g., "Swimming Pool", "Pet Friendly"). These are managed separately. | `Feature`         |
| **PropertyType** | The category of the property (e.g., "Apartment", "Villa", "Townhouse").                                     | `PropertyType`    |
| **MediaUsage** | A polymorphic association linking media files (from the `media` module) to properties as cover or gallery images. | `MediaUsage`      |

---

## Key Workflows & Features

### 1. Property Creation (Admin Flow)

This workflow is designed for administrators and managers to create properties directly through a dedicated form.

-   **UI Component**: `PropertyForm.tsx` provides a comprehensive form for all property fields.
-   **Server Action**: `createPropertyAction` in `src/modules/property/actions/createProperty.ts`.
    -   **Authentication**: Verifies that the user has an `ADMIN` or `MANAGER` role.
    -   **Validation**: Uses `createPropertyServerValidator` to validate and coerce `FormData`.
    -   **Service Layer**: Calls the `createProperty` service to interact with the database.
    -   **Feedback**: Returns success or error states to the client, with path revalidation on success.
-   **Service**: `createProperty` in `src/modules/property/services/createProperty.ts`.
    -   Generates a unique slug for the new property using `generateUniqueSlug`.
    -   Creates the `Property` record with a default status of `DRAFT`.
    -   Creates `MediaUsage` records to link the cover image and gallery images.
-   **Validation**: `createProperty.validator.ts` defines two Zod schemas:
    -   `createPropertyValidator`: For client-side validation within the `PropertyForm`.
    -   `createPropertyServerValidator`: For server-side validation, which includes `z.coerce` to handle `FormData` string values.

### 2. Advertise a Property (User/Agent Flow)

This is a multi-step wizard that allows end-users (likely agents) to submit a property for listing. It has a more guided and user-friendly experience.

-   **UI Wizard**: `AdvertiseWizard.tsx` orchestrates the multi-step process using `framer-motion` for animations.
-   **State Management**: The wizard's state is managed by two Zustand stores:
    -   `useStepStore`: Manages the current step, navigation, and collects data across all steps (`persist` middleware enabled).
    -   `useAdvertiseFormStore`: A separate store for the "Description" step's data (description, keywords, features).
-   **Wizard Steps**:
    1.  **Create**: Select property status (Sale/Rent), type, and title (`StepOneCreate.tsx`).
    2.  **Description**: Add a detailed description, keywords, and select from a predefined list of features (`StepTwoDescription.tsx`).
    3.  **Details**: Specify price, currency, bedrooms, bathrooms, and size (`StepThreeDetails.tsx`).
    4.  **Media**: Upload a cover image and gallery photos using the `MediaLibraryButton` (`StepFourMedia.tsx`).
    5.  **Account**: Handles user authentication. If the user is unauthenticated, it shows fields to create a new account. If authenticated, it greets them (`StepFiveAccount.tsx`).
    6.  **Payment**: A placeholder step for payment integration (`StepSixPayment.tsx`).
    7.  **Success**: A confirmation screen shown upon successful submission (`StepSevenSuccess.tsx`).

### 3. Property Feature Management (Admin CRUD)

This feature allows administrators to manage the list of available property features (e.g., "Air Conditioning", "Swimming Pool").

-   **Server Actions**: `feature.ts` (`src/modules/property/actions/feature.ts`) exposes a full set of CRUD actions:
    -   `listFeatures`
    -   `getFeature`
    -   `createFeature`
    -   `updateFeature`
    -   `deleteFeature`
-   **Service Layer**: The actions are a thin wrapper around the `FeatureService` class (`src/modules/property/services/feature.ts`).
    -   The service contains static methods (`list`, `get`, `create`, `update`, `delete`) that execute Prisma queries.
    -   The `create` and `update` methods automatically generate a URL-friendly `slug` from the feature name.
-   **Validation**: `feature.validator.ts` provides Zod schemas for creation and updates:
    -   `CreateFeatureValidator`: Requires a `name` and allows an optional `category`.
    -   `UpdateFeatureValidator`: Makes all fields optional for partial updates.

---

## Architectural Components

| Component      | Location (`src/modules/property/...`) | Description                                                                                             |
| :------------- | :------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| **Actions**    | `/actions`                            | Server Actions that handle client requests, orchestrate validation, and call services.                  |
| **Services**   | `/services`                           | Business logic layer that interacts directly with the database (Prisma) and performs core operations.     |
| **Validators** | `/validators`                         | Zod schemas for validating data at different layers (client-side forms, server-side actions).           |
| **Components** | `/components`                         | React components specific to the property module, including forms, wizards, and UI elements.            |
| **Stores**     | `/stores`                             | Zustand stores for managing client-side state, particularly for complex UI like the advertising wizard. |
| **Types**      | `/types`                              | TypeScript types and interfaces derived from Zod validators, ensuring type safety across the module.    |

