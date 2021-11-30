import { ariaLabelForLocation, hasDepartments } from './Hours';
// import { accounts } from '../mock/data';

const validWhitty = {
    alt: 'Whitty building, Mater,',
    campus: 'Other',
    departments: [
        {
            hours: '6:30am - 10pm',
            name: 'Study space',
        },
    ],
    name: 'Whitty Mater',
    url: 'https://web.library.uq.edu.au/locations-hours',
};
describe('the departments are shown correctly', () => {
    it('should know a library has departments', () => {
        expect(hasDepartments(validWhitty)).toEqual(true);
    });
    it('should know a library has no displayable departments', () => {
        const testdata = {
            alt: 'Fryer',
            campus: 'St Lucia',
            departments: [
                {
                    hours: 'ByApp',
                    name: 'AskUs desk & collections', // <-- this name isnt in hoursLocale.departmentsMap
                },
            ],
            name: 'FW Robinson Reading Room',
            url: 'https://web.library.uq.edu.au/locations-hours/',
        };
        expect(hasDepartments(testdata)).toEqual(false);
    });
});
describe('the aria label is correct', () => {
    it('the aria label is correct', () => {
        expect(ariaLabelForLocation(validWhitty).trim()).toEqual('Whitty Mater. Study space hours are 6:30am - 10pm');
    });
});
