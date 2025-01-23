# Modules

- UI components

## Testing

Global test setup is done in /src/test.setup.js:

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
