# Discover Reusable Components

This project uses the following:

1. [create-react-library](https://github.com/transitive-bullshit/create-react-library#readme) for the component build, but updated to use the latest versions
1. [create-react-app](https://github.com/facebook/create-react-app) for automated tests and eslint config
1. [Storybook](https://storybook.js.org) for component documentation

## Quick Start

```bash
npm install
npm start
```

This starts Storybook to display the components.

## Usage

Import the components from `reusable`. Since the components aren't published to npm, they're referenced via the GitHub repo instead.

```js
import Button from "reusable/lib/Button";
```

Note that for performance reasons, named imports aren't supported. [Named imports would import the entire library without special config](https://github.com/mcdpartners/react-bank/pull/671).

Apps like Zelle and billpay are configured to build this library before they start. However, if you change code in this project, **you need to restart to see your changes reflected in your app**. Ideally, we'd be using Lerna so symlinks would give us immediate feedback, but our CircleCI instance doesn't have enough RAM to run Lerna's bootstrap. That's why this is simply referenced via filepath in billpay/zelle's package.json.

## How to add a new component

- [ ] Create a folder that matches the component's name
- [ ] Configure [rollup.js](https://github.com/mcdpartners/react-bank/pull/671/files#diff-34ebfcd1b75d45f72a0bc78c504a4b9dR13) to export the component
- [ ] Create storybook stories that showcase each relevant feature
- [ ] Add a barrel (index.js) to keep imports short
- [ ] Add automated tests using Jest or Cypress

## TODO: The docs below are in progress for an upcoming forms feature.

## Form Implementation

Forms are implemented using the following components to programmatically enforce consistency and reduce boilerplate:

- `Form` - Use this instead of a `form` tag. See the comments at the top of the file for more information.
- Reusable form inputs such as `TextInput`, and `SelectInput`. There are also specialized wrappers over these inputs such as `DateInput` and `SelectCountry`. These inputs automatically run required field validation upon blur. See the comments at the top of each for more info.
- `useFormHandlers` - This Hook centralizes reusable input logic and utilizes context data that is set by `Form` and `FormSection`. This hook is used by `TextInput`, `SelectInput`, etc.

The items above utilize React's context to share data and methods.

### Form Rules:

1. Use `<Form>` instead of `<form>`. See `<Form>` for the required props.
1. Wrap each form section in `<FormSection>`. Each form section has a name and number. A form section typically groups an array of items. **Example**: Each beneficiary has its own `<FormSection>`. A form section declaration assures that each input in `<FormSection>` has a unique HTML ID. The input's name and sectionNumber are concatenated to create a unique HTML ID).
1. Use `<TextInput>`, `<SelectInput>`, etc. instead of separate `<label>`, `<input>`, `<select>` tags. Note that many props such as `id` and `onChange` are automatically set via data from context which is provided via `<Form>` and `<FormSection>`. Custom validation is supported. See `DateInput` for an example.
1. `<ValidationSummary>` displays the error summary upon submission. It pulls errors from `FormContext`, which is populated by `<Form>`.

Open questions:

1. Should all client-side validation pass before the server is called? Yes.
2. How should client-side validation errors display? What about "tips" such as date input? Leave as is for now.
3. If "Add new beneficiary" is clicked when the form is already submitted, what should happen? - Set formSubmitted to false when addBeneficiary is clicked so validation doesn't show required errors on newly added fields.
4. What about dirty form handling? Yes, it matters, but optional.
5. Should the submit button be disabled during submit? Yes, while HTTP call is in progress.
