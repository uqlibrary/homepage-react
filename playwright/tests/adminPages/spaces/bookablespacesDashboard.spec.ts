import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

const CAMPUS_ALL_OPTION = '1';
const CAMPUS_ST_LUCIA_OPTION = '2';
const CAMPUS_PACE_OPTION = '3';
const ST_LUCIA_RECORD_ID = '1'; // '2' is gatton, which has no Spaces in our mock data
const PACE_RECORD_ID = '3';
const PAGINATE_TO_SHOW_5 = 5;

const FORGEN = '123456';
const PACE = '1234544';
const LIVERIS = '43534';
const ARMUS1 = '1';
const ARMUS2 = '2';
const ARMUS3 = '3';
const ARMUS4 = '4';
const ARMUS5 = '5';
const ARMUS6 = '6';
const ARMUS7 = '7';

test.describe('Spaces Admin - manage locations', () => {
    test('page has correct data', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

        const greenTick = (id: string) =>
            page.getByTestId(`${id}`).locator('svg path[d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"]');

        const FORGAN_SMITH_FACILITY_TYPE = 'space-123456-facilitytype';
        const DUTTON_PARK_FACILITY_TYPE = 'space-1234544-facilitytype';
        const LIVERIS_FACILITY_TYPE = 'space-43534-facilitytype';
        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-askus-service`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-askus-service`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-food-outlets`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-food-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-production-printing-services`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-production-printing-services`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-retail-outlets`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-retail-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-contains-artwork`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-contains-artwork`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-bookable`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-bookable`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-energy-pod`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-energy-pod`)).not.toBeVisible();

        await expect(
            page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-food-drink-vending-machinesnack-bar`),
        ).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-food-drink-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-fridge`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-fridge`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-hot-cold-water`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-hot-cold-water`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-kitchen`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-kitchen`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-microwave`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-microwave`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-pharmacy-vending-machinesnack-bar`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-pharmacy-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-pwd-toilets-automatic-door`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-pwd-toilets-automatic-door`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-pwd-toilets-lie-flat`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-pwd-toilets-lie-flat`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-recharge-station`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-recharge-station`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-self-printing-scanning`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-self-printing-scanning`)).toBeVisible();

        await expect(
            page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-stationery-vending-machinesnack-bar`),
        ).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-stationery-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-toilets-female`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-toilets-female`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-toilets-male`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-toilets-male`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-adjustable-desks`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-adjustable-desks`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-av-equipment`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-av-equipment`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-byod-station`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-byod-station`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-client-accessible-power-point`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-client-accessible-power-point`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-computer`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-computer`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-general-collections`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-general-collections`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-high-use-collections`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-high-use-collections`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-lending`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-lending`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-lockers`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-lockers`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-lounge-chairs`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-lounge-chairs`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-on-desk-power-point`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-on-desk-power-point`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-on-desk-usb-a`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-on-desk-usb-a`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-on-desk-usb-c-high-power`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-on-desk-usb-c-high-power`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-on-desk-usb-c-low-power`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-on-desk-usb-c-low-power`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-qi-chargers`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-qi-chargers`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-recreational-reading-collection`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-recreational-reading-collection`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-requested-items`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-requested-items`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-return-station`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-return-station`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-whiteboard`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-whiteboard`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-desk-lamp`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-desk-lamp`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-dimmable`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-dimmable`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-low-light`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-low-light`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-natural`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-natural`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-high-noise-level`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-high-noise-level`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-low-noise-level`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-low-noise-level`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-at-technology`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-at-technology`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-exam-friendly`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-exam-friendly`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-postgraduate-spaces`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-postgraduate-spaces`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-power-outlets`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-power-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-undergrad-spaces`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-undergrad-spaces`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-askus-service`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-askus-service`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-food-outlets`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-food-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-production-printing-services`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-production-printing-services`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-retail-outlets`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-retail-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-contains-artwork`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-contains-artwork`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-bookable`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-bookable`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-energy-pod`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-energy-pod`)).not.toBeVisible();

        await expect(
            page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-food-drink-vending-machinesnack-bar`),
        ).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-food-drink-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-fridge`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-fridge`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-hot-cold-water`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-hot-cold-water`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-kitchen`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-kitchen`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-microwave`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-microwave`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-pharmacy-vending-machinesnack-bar`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-pharmacy-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-pwd-toilets-automatic-door`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-pwd-toilets-automatic-door`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-pwd-toilets-lie-flat`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-pwd-toilets-lie-flat`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-recharge-station`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-recharge-station`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-self-printing-scanning`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-self-printing-scanning`)).toBeVisible();

        await expect(
            page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-stationery-vending-machinesnack-bar`),
        ).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-stationery-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-toilets-female`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-toilets-female`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-toilets-male`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-toilets-male`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-adjustable-desks`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-adjustable-desks`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-av-equipment`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-av-equipment`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-byod-station`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-byod-station`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-client-accessible-power-point`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-client-accessible-power-point`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-computer`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-computer`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-general-collections`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-general-collections`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-high-use-collections`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-high-use-collections`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-lending`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-lending`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-lockers`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-lockers`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-lounge-chairs`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-lounge-chairs`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-on-desk-power-point`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-on-desk-power-point`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-on-desk-usb-a`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-on-desk-usb-a`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-on-desk-usb-c-high-power`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-on-desk-usb-c-high-power`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-on-desk-usb-c-low-power`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-on-desk-usb-c-low-power`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-qi-chargers`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-qi-chargers`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-recreational-reading-collection`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-recreational-reading-collection`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-requested-items`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-requested-items`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-return-station`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-return-station`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-desk-lamp`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-desk-lamp`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-dimmable`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-dimmable`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-low-light`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-low-light`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-natural`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-natural`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-high-noise-level`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-high-noise-level`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-low-noise-level`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-low-noise-level`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-at-technology`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-at-technology`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-exam-friendly`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-exam-friendly`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-postgraduate-spaces`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-postgraduate-spaces`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-power-outlets`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-power-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-undergrad-spaces`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-undergrad-spaces`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-whiteboard`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-whiteboard`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-askus-service`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-askus-service`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-food-outlets`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-food-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-production-printing-services`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-production-printing-services`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-retail-outlets`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-retail-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-contains-artwork`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-contains-artwork`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-bookable`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-bookable`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-energy-pod`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-energy-pod`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-food-drink-vending-machinesnack-bar`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-food-drink-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-fridge`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-fridge`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-hot-cold-water`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-hot-cold-water`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-kitchen`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-kitchen`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-microwave`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-microwave`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-pharmacy-vending-machinesnack-bar`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-pharmacy-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-pwd-toilets-automatic-door`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-pwd-toilets-automatic-door`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-pwd-toilets-lie-flat`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-pwd-toilets-lie-flat`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-recharge-station`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-recharge-station`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-self-printing-scanning`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-self-printing-scanning`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-stationery-vending-machinesnack-bar`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-stationery-vending-machinesnack-bar`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-toilets-female`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-toilets-female`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-toilets-male`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-toilets-male`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-adjustable-desks`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-adjustable-desks`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-av-equipment`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-av-equipment`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-byod-station`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-byod-station`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-client-accessible-power-point`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-client-accessible-power-point`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-computer`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-computer`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-general-collections`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-general-collections`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-high-use-collections`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-high-use-collections`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-lending`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-lending`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-lockers`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-lockers`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-lounge-chairs`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-lounge-chairs`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-on-desk-power-point`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-on-desk-power-point`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-on-desk-usb-a`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-on-desk-usb-a`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-on-desk-usb-c-high-power`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-on-desk-usb-c-high-power`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-on-desk-usb-c-low-power`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-on-desk-usb-c-low-power`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-qi-chargers`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-qi-chargers`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-recreational-reading-collection`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-recreational-reading-collection`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-requested-items`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-requested-items`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-return-station`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-return-station`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-desk-lamp`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-desk-lamp`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-dimmable`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-dimmable`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-low-light`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-low-light`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-natural`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-natural`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-high-noise-level`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-high-noise-level`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-low-noise-level`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-low-noise-level`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-at-technology`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-at-technology`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-exam-friendly`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-exam-friendly`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-postgraduate-spaces`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-postgraduate-spaces`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-power-outlets`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-power-outlets`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-undergrad-spaces`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-undergrad-spaces`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-whiteboard`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-whiteboard`)).not.toBeVisible();
    });
    test('single result is as expected', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces&responseType=facilityTypesWithOne');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        await expect(page.getByTestId('spaces-dashboard-header-row').locator('> th')).toHaveCount(2);
    });
    test.describe('is accessible', () => {
        test('spaces dashboard page is accessible', async ({ page }) => {
            await page.goto('/admin/spaces?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

            await assertAccessibility(page, '[data-testid="SpacesAdminPage"]');
        });
        test('navigation menu is accessible', async ({ page }) => {
            await page.goto('/admin/spaces?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

            // open navigation menu
            await page.getByTestId('admin-spaces-menu-button').click();
            await expect(
                page.getByTestId('admin-spaces-visit-dashboard-button').getByText(/Manage Spaces/),
            ).toBeVisible(); // menu has loaded

            await assertAccessibility(page, '[data-testid="admin-spaces-menu"]');
        });
    });
    test.describe('can filter', () => {
        test('by campus', async ({ page }) => {
            const visibleSpaces = page
                .getByTestId('space-table')
                .locator('tbody')
                .locator(':scope > tr:not(.hiddenRow)');
            const lawSpace = page.getByTestId(`edit-space-${FORGEN}-button`);
            const paceSpace = page.getByTestId(`edit-space-${PACE}-button`);
            const liverisSpace = page.getByTestId(`edit-space-${LIVERIS}-button`);

            const campusSelector = page.getByTestId('filter-by-campus');
            const librarySelector = page.getByTestId('filter-by-library');
            const floorSelector = page.getByTestId('filter-by-floor');

            const campusOptionLabel = (optionIndex: string) =>
                page.locator(`ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(${optionIndex})`);

            await page.goto('/admin/spaces?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

            // initially paginator limit of 5 is visible
            await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
            await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
            await expect(page.getByTestId(`space-${PACE}`)).toBeVisible();
            await expect(page.getByTestId(`space-${LIVERIS}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS1}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            await expect(campusSelector.locator('input')).toBeEmpty();
            await campusSelector.click(); // open campus selector

            // limit to St Lucia only
            await expect(campusOptionLabel(CAMPUS_ST_LUCIA_OPTION)).toContainText('St Lucia');
            await campusOptionLabel(CAMPUS_ST_LUCIA_OPTION).click(); // choose St Lucia
            await expect(campusSelector.locator('input')).toHaveValue(ST_LUCIA_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('St Lucia');
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // only St Lucia spaces display
            await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
            await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
            await expect(page.getByTestId(`space-${LIVERIS}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS1}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS3}`)).toBeVisible();
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).toBeVisible();

            // open campus selector
            await campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_PACE_OPTION)).toContainText('PACE');

            // choose PACE
            await campusOptionLabel(CAMPUS_PACE_OPTION).click(); // select PACE campus option
            await expect(campusSelector.locator('input')).toHaveValue(PACE_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('PACE');
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // only PACE spaces display
            await expect(visibleSpaces).toHaveCount(1);
            await expect(lawSpace).not.toBeVisible();
            await expect(paceSpace).toBeVisible();
            await expect(liverisSpace).not.toBeVisible();
            await expect(page.getByTestId(`space-${PACE}`)).toBeVisible();

            // reopen campus selector
            await campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_ALL_OPTION)).toBeVisible();
            await expect(campusOptionLabel(CAMPUS_ALL_OPTION)).toContainText('Show all campuses');

            // show all campuses
            await campusOptionLabel(CAMPUS_ALL_OPTION).click();
            await expect(campusSelector.locator('input')).toHaveValue('');
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // first page of all campus spaces display
            await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        });
        test('by locations', async ({ page }) => {
            const visibleSpaces = page
                .getByTestId('space-table')
                .locator('tbody')
                .locator(':scope > tr:not(.hidden)');
            const lawSpace = page.getByTestId(`edit-space-${FORGEN}-button`);
            const paceSpace = page.getByTestId(`edit-space-${PACE}-button`);
            const liverisSpace = page.getByTestId(`edit-space-${LIVERIS}-button`);

            const campusSelector = page.getByTestId('filter-by-campus');
            const librarySelector = page.getByTestId('filter-by-library');
            const floorSelector = page.getByTestId('filter-by-floor');

            const campusOptionLabel = (optionIndex: string) =>
                page.locator(`ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(${optionIndex})`);

            await page.goto('/admin/spaces?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

            // initially all first page space rows are visible
            await expect(
                page
                    .getByTestId('space-table')
                    .locator('tbody')
                    .locator(':scope > tr'),
            ).toHaveCount(PAGINATE_TO_SHOW_5);
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).toBeVisible();
            await expect(liverisSpace).toBeVisible();

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // open campus selector
            await campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_PACE_OPTION)).toContainText('PACE');

            // choose PACE
            await campusOptionLabel(CAMPUS_PACE_OPTION).click();
            await expect(campusSelector.locator('input')).toHaveValue(PACE_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('PACE');
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();
            await expect(visibleSpaces).toHaveCount(1); // only PACE spaces display
            await expect(lawSpace).not.toBeVisible();
            await expect(paceSpace).toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            // click away to ensure that the drop down is closed (the next line has been flakey)
            await page.getByTestId('admin-spaces-page-title').click(); // reopen campus selector

            // reopen campus selector
            await campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_ST_LUCIA_OPTION)).toContainText('St Lucia');

            // Change to St Lucia
            await campusOptionLabel(CAMPUS_ST_LUCIA_OPTION).click();
            await expect(campusSelector.locator('input')).toHaveValue(ST_LUCIA_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('St Lucia');
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();
            await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5); // only one page of St Lucia spaces display
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).toBeVisible();

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // open the library selector
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).toBeEmpty();
            await librarySelector.click();
            const lawLibraryOption = page.locator('ul[aria-labelledby="filter-by-library-label"] li:last-of-type');
            await expect(lawLibraryOption).toContainText('Walter Harrison Law Library');

            // choose Walter Harrison library
            await lawLibraryOption.click(); // choose Walter Harrison
            await expect(visibleSpaces).toHaveCount(1); // only the Walter Harrison space displays
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeEmpty();

            // open Floor selector
            await floorSelector.click();
            const secondFloorOption = 'ul[aria-labelledby="filter-by-floor-label"] li:nth-of-type(2)';
            await expect(page.locator(secondFloorOption)).toContainText('3A');

            // choose Floor 3a
            await page.locator(secondFloorOption).click(); // choose 3A
            await expect(visibleSpaces).toHaveCount(0); // No spaces display
            await expect(lawSpace).not.toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();
            await expect(floorSelector.locator('input')).not.toBeDisabled();

            // reopen floor selector
            await floorSelector.click();
            const firstFloorOption = 'ul[aria-labelledby="filter-by-floor-label"] li:nth-of-type(1)';
            await expect(page.locator(firstFloorOption)).toContainText('2');

            // choose Floor 2
            await page.locator(firstFloorOption).click(); // choose floor "2"
            await expect(visibleSpaces).toHaveCount(1); // 1 space displays
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            // reopen campus selector
            await campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_ALL_OPTION)).toContainText('Show all campuses');

            // choose no campus (resets and shows any Space)
            await campusOptionLabel(CAMPUS_ALL_OPTION).click();
            await expect(campusSelector.locator('input')).toHaveValue('');
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();
            await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5); // first page of all campus spaces display

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).toBeVisible();
            await expect(liverisSpace).toBeVisible();
        });
    });
    test('can navigate from dashboard to homepage', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const optionsButton = page.getByTestId('admin-spaces-menu-button');
        const visitHomepageButton = page.getByTestId('admin-spaces-visit-homepage-button');

        await expect(visitHomepageButton).not.toBeVisible();
        await expect(page.getByTestId('admin-spaces-menu')).not.toBeVisible();
        await expect(optionsButton).toBeVisible();
        await optionsButton.click();

        await expect(page.getByTestId('admin-spaces-menu')).toBeVisible();
        await expect(visitHomepageButton).toBeVisible();
        await visitHomepageButton.click();

        await expect(page).toHaveURL('http://localhost:2020/spaces?user=libSpaces');
    });
    test('can expand and shrink page', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        const pageWidth = 1300;
        await page.setViewportSize({ width: pageWidth, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const tableWrapper = page.getByTestId('table-wrapper');
        await expect(tableWrapper).toBeVisible();
        const tableWrapperBoundingBox = await tableWrapper.boundingBox();
        await expect(tableWrapperBoundingBox?.width).toBeGreaterThan(1130);
        await expect(tableWrapperBoundingBox?.width).toBeLessThan(1150);

        const pushOutbutton = page.getByTestId('table-pushout-button');
        await expect(pushOutbutton).toBeVisible();
        await pushOutbutton.click();

        const tableWrapperBoundingBox2 = await tableWrapper.boundingBox();
        await expect(tableWrapperBoundingBox2?.width).toBeGreaterThan(pageWidth - 200);
        await expect(tableWrapperBoundingBox2?.width).toBeLessThan(pageWidth);

        const pushInbutton = page.getByTestId('table-pushin-button');
        await expect(pushInbutton).toBeVisible();
        await pushInbutton.click();

        await page.waitForTimeout(500); // cant think of anything to watch for the redraw to be done
        const tableWrapperBoundingBox3 = await tableWrapper.boundingBox();
        await expect(tableWrapperBoundingBox3?.width).toBeGreaterThan(1130);
        await expect(tableWrapperBoundingBox3?.width).toBeLessThan(1150);
    });
    test('can open and close friendly locations', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const descriptionPanel = page.getByTestId(`space-description-${LIVERIS}`);
        const expandButton = page.getByTestId(`space-${LIVERIS}-expand-button`);
        const collapseButton = page.getByTestId(`space-${LIVERIS}-collapse-button`);

        // "friendly" location description starts off hidden
        await expect(descriptionPanel).not.toBeVisible();
        await expect(collapseButton).not.toBeVisible();
        await expect(expandButton).toBeVisible();

        // click the expand button
        await expandButton.click();

        // description shows and buttons have swapped
        await expect(descriptionPanel).toBeVisible();
        await expect(collapseButton).toBeVisible();
        await expect(expandButton).not.toBeVisible();

        // click the collapse button
        await collapseButton.click();

        // description disappears again and buttons have swapped
        await expect(descriptionPanel).not.toBeVisible();
        await expect(collapseButton).not.toBeVisible();
        await expect(expandButton).toBeVisible();
    });
    test('pagination works', async ({ page }) => {
        const visibleSpaces = page
            .getByTestId('space-table')
            .locator('tbody')
            .locator(':scope > tr:not(.hidden)');

        const campusSelector = page.getByTestId('filter-by-campus');
        const librarySelector = page.getByTestId('filter-by-library');
        const floorSelector = page.getByTestId('filter-by-floor');

        const campusOptionLabel = (optionIndex: string) =>
            page.locator(`ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(${optionIndex})`);

        const pageCountDisplay = page.locator('.MuiTablePagination-displayedRows');

        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}`)).toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS1}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();

        // paginator shows correct number
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–5 of 10');

        // go to next page of pagination, 6-10 of 10
        const paginationBlock = page.getByTestId('pagination-block');
        const nextPaginationButton = paginationBlock.locator('[aria-label="Go to next page"]');
        await expect(nextPaginationButton).toBeVisible();
        await nextPaginationButton.click();
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('6–10 of 10');
        await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        await expect(page.getByTestId(`space-${ARMUS3}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS4}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS5}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS6}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS7}`)).toBeVisible();

        // go to back to first page of pagination, 1-5 of 10
        const previousPaginationButton = paginationBlock.locator('[aria-label="Go to previous page"]');
        await expect(previousPaginationButton).toBeVisible();
        await previousPaginationButton.click();
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–5 of 10');
        await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}`)).toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS1}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();

        await expect(campusSelector.locator('input')).not.toBeDisabled();
        await campusSelector.click();

        // limit to St Lucia only
        await expect(campusOptionLabel(CAMPUS_ST_LUCIA_OPTION)).toContainText('St Lucia');
        await campusOptionLabel(CAMPUS_ST_LUCIA_OPTION).click(); // choose St Lucia
        await expect(campusSelector.locator('input')).toHaveValue(ST_LUCIA_RECORD_ID);
        await expect(campusSelector.locator('div')).toContainText('St Lucia');
        await expect(librarySelector.locator('input')).not.toBeDisabled();
        await expect(floorSelector.locator('input')).toBeDisabled();

        // only St Lucia spaces display
        await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}`)).not.toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS1}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS3}`)).toBeVisible();

        // paginator shows correct number
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–5 of 9');

        // paginate
        const nextPageButton = page.locator('[aria-label="Go to next page"]');
        await expect(nextPageButton).toBeVisible();
        nextPageButton.click();

        // next page of St Lucia spaces display
        await expect(visibleSpaces).toHaveCount(4); // the second page of a set of 9
        await expect(page.getByTestId('space-4')).toBeVisible();
        await expect(page.getByTestId('space-5')).toBeVisible();
        await expect(page.getByTestId('space-6')).toBeVisible();
        await expect(page.getByTestId('space-7')).toBeVisible();

        // paginator shows correct number
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('6–9 of 9');

        // change number of rows displayed
        const rowsperpageSelector = page.getByTestId('admin-spaces-list-paginator-select');
        await expect(rowsperpageSelector).toBeVisible();
        await rowsperpageSelector.selectOption('10'); // choose '10 per page'
        await expect(visibleSpaces).toHaveCount(9); // all st lucia records

        // paginator shows correct number
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–9 of 9');
    });
    test('remembers pagination', async ({ page, context }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        // initally 5 rows showing
        const pageCountDisplay2 = page.locator('.MuiTablePagination-displayedRows');
        await expect(pageCountDisplay2).toBeVisible();
        await expect(pageCountDisplay2).toContainText('1–5 of 10');

        await expect(
            page
                .getByTestId('space-table')
                .locator('tbody')
                .locator(':scope > tr:not(.hidden)'),
        ).toHaveCount(5);

        // cookie not present
        const cookies = await context.cookies();
        const savedCookie = cookies.find(c => c.name === 'spaces-list-paginator');
        expect(savedCookie).not.toBeDefined();

        // open rows-per-page selector in paginator
        await expect(page.getByTestId('admin-spaces-list-paginator-select')).toBeVisible();
        await page.getByTestId('admin-spaces-list-paginator-select').selectOption('10');

        await expect(
            page
                .getByTestId('space-table')
                .locator('tbody')
                .locator(':scope > tr:not(.hidden)'),
        ).toHaveCount(10);

        // reload page to show number of rows has increased
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        // now 10 rows showing
        const pageCountDisplay = page.locator('.MuiTablePagination-displayedRows');
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–10 of 10');

        await expect(
            page
                .getByTestId('space-table')
                .locator('tbody')
                .locator(':scope > tr:not(.hidden)'),
        ).toHaveCount(10);
    });
});
