import { getWeightAfterDrag } from 'modules/Pages/Admin/Spotlights/spotlighthelpers';
describe('spotlight helpers', () => {
    it('correctly calculates the new weight after a drag', () => {
        expect(getWeightAfterDrag(0, 'edit', 10)).toEqual(5);
        expect(getWeightAfterDrag(1, 'edit', 10)).toEqual(25);
        expect(getWeightAfterDrag(2, 'edit', 10)).toEqual(35);
        expect(getWeightAfterDrag(3, 'edit', 10)).toEqual(45);

        expect(getWeightAfterDrag(0, 'edit', 20)).toEqual(5);
        expect(getWeightAfterDrag(1, 'edit', 20)).toEqual(15);
        expect(getWeightAfterDrag(2, 'edit', 20)).toEqual(35);
        expect(getWeightAfterDrag(3, 'edit', 20)).toEqual(45);

        expect(getWeightAfterDrag(0, 'edit', 30)).toEqual(5);
        expect(getWeightAfterDrag(1, 'edit', 30)).toEqual(15);
        expect(getWeightAfterDrag(2, 'edit', 30)).toEqual(25);
        expect(getWeightAfterDrag(3, 'edit', 30)).toEqual(45);

        expect(getWeightAfterDrag(0, 'edit', 40)).toEqual(5);
        expect(getWeightAfterDrag(1, 'edit', 40)).toEqual(15);
        expect(getWeightAfterDrag(2, 'edit', 40)).toEqual(25);
        expect(getWeightAfterDrag(3, 'edit', 40)).toEqual(35);

        expect(getWeightAfterDrag(0, 'add', 1000)).toEqual(5);
        expect(getWeightAfterDrag(1, 'add', 1000)).toEqual(15);
        expect(getWeightAfterDrag(2, 'add', 1000)).toEqual(25);
        expect(getWeightAfterDrag(3, 'add', 1000)).toEqual(35);
        expect(getWeightAfterDrag(3, 'add', 1000)).toEqual(35);
        expect(getWeightAfterDrag(4, 'add', 1000)).toEqual(45);

        expect(getWeightAfterDrag(0, 'clone', 1000)).toEqual(5);
        expect(getWeightAfterDrag(1, 'clone', 1000)).toEqual(15);
        expect(getWeightAfterDrag(2, 'clone', 1000)).toEqual(25);
        expect(getWeightAfterDrag(3, 'clone', 1000)).toEqual(35);
        expect(getWeightAfterDrag(4, 'clone', 1000)).toEqual(45);
    });
});
