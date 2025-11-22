# Implementation Plan - Connect Advertise Wizard to Backend

The goal is to fully functionalize the "Advertise Property" wizard by connecting the existing frontend components to the backend `createProperty` action.

## User Review Required

> [!IMPORTANT]
> I will be consolidating the form state into `useAdvertiseFormStore` and removing the loose `data` object usage in `useStepStore`. This ensures type safety and consistency.

> [!WARNING]
> The current `StepSixPayment` collects credit card info. I will NOT be implementing a real payment gateway integration in this task, but I will ensure the data is collected and passed to the backend (or mocked/handled safely). For now, the backend `createProperty` does not seem to handle payment data, so I will focus on creating the *Property* first. The payment step will be treated as a confirmation step for now.

## Proposed Changes

### State Management

#### [MODIFY] [useAdvertiseFormStore.ts](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/stores/useAdvertiseFormStore.ts)
-   Expand `AdvertiseFormState` to include all fields required by `createPropertyValidator` and the wizard steps:
    -   `price`, `currency`
    -   `bedrooms`, `bathrooms`, `propertySize`
    -   `location`, `address`, `latitude`, `longitude`
    -   `coverImage`, `gallery`
    -   `username`, `email`, `password` (for new account creation, if needed)
    -   `plan`, `paymentMethod`
-   Add a `submit` action (or keep it in the component) that calls the server action.

#### [MODIFY] [useStepStore.ts](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/stores/useStepStore.ts)
-   Remove the `data` field as we are moving state to `useAdvertiseFormStore`.
-   Keep navigation logic (`next`, `prev`, `goTo`).

### Frontend Components

I will update each step to use `useAdvertiseFormStore` for data binding.

#### [MODIFY] [StepOneCreate.tsx](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/components/advertise/steps/StepOneCreate.tsx)
-   Bind to `useAdvertiseFormStore`.

#### [MODIFY] [StepTwoDescription.tsx](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/components/advertise/steps/StepTwoDescription.tsx)
-   Ensure it uses the updated store correctly.

#### [MODIFY] [StepThreeDetails.tsx](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/components/advertise/steps/StepThreeDetails.tsx)
-   Bind to `useAdvertiseFormStore`.

#### [MODIFY] [StepFourMedia.tsx](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/components/advertise/steps/StepFourMedia.tsx)
-   Bind to `useAdvertiseFormStore`.

#### [MODIFY] [StepFiveAccount.tsx](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/components/advertise/steps/StepFiveAccount.tsx)
-   Bind to `useAdvertiseFormStore`.

#### [MODIFY] [StepSixPayment.tsx](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/components/advertise/steps/StepSixPayment.tsx)
-   Bind to `useAdvertiseFormStore`.
-   **Implement Submission**: Add a "Submit & Pay" (or "Create Listing") button.
-   Call `createPropertyAction` with the collected data.
-   On success, call `next()` to go to `StepSevenSuccess`.

### Backend

#### [MODIFY] [createProperty.ts](file:///c:/Users/hamza/code/JS/dubai-estate/src/modules/property/actions/createProperty.ts)
-   Ensure it handles all fields correctly.
-   (Optional) Handle user creation if the user is not logged in (the current code checks for session, so we might need to handle the "New Account" flow from Step 5. For this task, I will assume the user is logged in or the `createProperty` action will be updated to handle registration if needed. *Correction*: The current action enforces auth. I will stick to that for now and maybe show an error if not logged in, or if the user wants registration, that's a bigger scope. I'll assume the user is logged in for the "Advertise" flow to work smoothly, or I'll check if I need to register the user first. *Decision*: I will focus on Property Creation. If the user is new, they should probably register first. I'll check if `StepFiveAccount` handles registration. It seems to collect data. I might need a separate `registerUser` action if I want to support inline registration).

## Verification Plan

### Manual Verification
1.  **Navigate** to `/advertise`.
2.  **Step 1**: Select "Sale", "Apartment", enter Title "Test Property", select Location. Click Next.
3.  **Step 2**: Enter Description, add Keywords, select Features. Click Next.
4.  **Step 3**: Enter Price, Bedrooms, Bathrooms, Size. Click Next.
5.  **Step 4**: Select Cover Image and Gallery Images (using the media library mock/component). Click Next.
6.  **Step 5**: Select Plan. (If not logged in, try to enter details - *Note: I will verify if I can support inline registration, otherwise I'll require login*). Click Next.
7.  **Step 6**: Enter dummy card details. Click **Submit**.
8.  **Verify**:
    -   Check if redirected to Success step.
    -   Check Database (Prisma Studio or query) to see if the property exists with all fields.
