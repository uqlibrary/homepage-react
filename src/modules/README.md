# Modules

- UI components

## Testing

Global test setup is done in /src/test.setup.js:

### Previewing tests in the browser

We use [Jest Preview](https://github.com/nvh95/jest-preview) to visualise Jest tests in the browser. To do this, first make sure you have a terminal running the Preview server (will open a Chrome tab):

```shell
name@machine homepage-react % npm run jest-preview
```

then import the preview library in your test file:

```javascript
import { preview } from 'test-utils';
```

then somewhere in your test, where you'd like to see what the rendered output looks like in the browser, call:

```javascript
preview.debug();
```

### Firing clicks etc.

We have begun using the [user-event](https://testing-library.com/docs/user-event/intro) library to simulate clicking of objects, selecting options from lists, and entering text (besides many other features). 
This library replaces the previous use of fireEvent and act() with a simpler and more browser-accurate API:

```javascript
import {userEvent} from 'test-utils';

// somewhere in your code

// 1. clicking a button etc.
userEvent.click(getByTestId('some-id'));

// 2. clicking a select and choosing an option 
// Note there are additional options for 'selectOptions' - see the docos
userEvent.click(getByTestId('your-select'));
await userEvent.selectOptions(getByRole('listbox'), 'whatever label text');
        
// 3. entering text - this has the additional benefit of auto-clicking the element first
// Note there are additional options for 'type' - see the docos
await userEvent.type(getByTestId('your-input'), 'some text');

```
