import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';

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

        await expect(page.getByTestId('spaces-dashboard-header-row').locator('> th')).toHaveCount(3);
    });
    test('spaces dashboard page is accessible', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

        await assertAccessibility(page, '[data-testid="StandardPage"]', {
            disabledRules: ['empty-table-header', 'scrollable-region-focusable'], // as this is an admin page we don't care that much
        });
    });
    test.describe('can filter', () => {
        test('by campus', async ({ page }) => {
            await page.goto('/admin/spaces?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

            // initally all space rows are visible
            await expect(
                page
                    .getByTestId('space-table')
                    .locator('tbody')
                    .locator(':scope > tr'),
            ).toHaveCount(3);

            await expect(page.getByTestId('filter-by-campus')).toBeVisible();

            await expect(page.getByTestId('filter-by-campus').locator('input')).toBeVisible();
            await expect(page.getByTestId('filter-by-campus').locator('input')).toBeEmpty();
            page.getByTestId('filter-by-campus').click();
            await expect(page.locator('ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(2)')).toContainText(
                'St Lucia',
            );
            page.locator('ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(2)').click(); // choose St Lucia
            await expect(page.getByTestId('filter-by-campus').locator('input')).toHaveValue('1');
            await expect(page.getByTestId('filter-by-campus').locator('div')).toContainText('St Lucia');

            // only St Lucia spaces display
            await expect(
                page
                    .getByTestId('space-table')
                    .locator('tbody')
                    .locator(':scope > tr:not(.hidden)'),
            ).toHaveCount(2);

            // choose PACE
            page.getByTestId('filter-by-campus').click();
            await expect(page.locator('ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(3)')).toContainText(
                'PACE',
            );
            page.locator('ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(3)').click(); // choose PCE
            await expect(page.getByTestId('filter-by-campus').locator('input')).toHaveValue('3');
            await expect(page.getByTestId('filter-by-campus').locator('div')).toContainText('PACE');

            // only PACE spaces display
            await expect(
                page
                    .getByTestId('space-table')
                    .locator('tbody')
                    .locator(':scope > tr:not(.hidden)'),
            ).toHaveCount(1);

            // deselect campuses
            page.getByTestId('filter-by-campus').click();
            await expect(page.locator('ul[aria-labelledby="filter-by-campus-label"] li:first-of-type')).toContainText(
                'Show all campuses',
            );
            page.locator('ul[aria-labelledby="filter-by-campus-label"] li:first-of-type').click(); // unset
            await expect(page.getByTestId('filter-by-campus').locator('input')).toHaveValue('');

            // all campus spaces display
            await expect(
                page
                    .getByTestId('space-table')
                    .locator('tbody')
                    .locator(':scope > tr:not(.hidden)'),
            ).toHaveCount(3);
        });
    });
});
