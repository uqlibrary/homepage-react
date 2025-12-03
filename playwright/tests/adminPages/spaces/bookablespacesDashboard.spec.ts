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

        await expect(page.getByTestId('spaces-dashboard-header-row').locator('> th')).toHaveCount(2);
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
        const CAMPUS_ALL_OPTION = '1';
        const CAMPUS_ST_LUCIA_OPTION = '2';
        const CAMPUS_PACE_OPTION = '3';
        const ST_LUCIA_RECORD_ID = '1'; // '2' is gatton, which has no Spaces in our mock data
        const PACE_RECORD_ID = '3';
        test('by campus', async ({ page }) => {
            const visibleSpaces = page
                .getByTestId('space-table')
                .locator('tbody')
                .locator(':scope > tr:not(.hidden)');
            const lawSpace = page.getByTestId('edit-space-123456-button');
            const paceSpace = page.getByTestId('edit-space-1234544-button');
            const liverisSpace = page.getByTestId('edit-space-43534-button');

            const campusSelector = page.getByTestId('filter-by-campus');
            const librarySelector = page.getByTestId('filter-by-library');
            const floorSelector = page.getByTestId('filter-by-floor');

            const campusOptionLabel = (optionIndex: string) =>
                page.locator(`ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(${optionIndex})`);

            await page.goto('/admin/spaces?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

            // initially all space rows are visible
            await expect(visibleSpaces).toHaveCount(3);

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            await expect(campusSelector.locator('input')).toBeEmpty();
            campusSelector.click();

            await expect(campusOptionLabel(CAMPUS_ST_LUCIA_OPTION)).toContainText('St Lucia');
            campusOptionLabel(CAMPUS_ST_LUCIA_OPTION).click(); // choose St Lucia
            await expect(campusSelector.locator('input')).toHaveValue(ST_LUCIA_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('St Lucia');
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // only St Lucia spaces display
            await expect(visibleSpaces).toHaveCount(2);
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).toBeVisible();

            // choose PACE
            campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_PACE_OPTION)).toContainText('PACE');
            campusOptionLabel(CAMPUS_PACE_OPTION).click(); // choose PACE
            await expect(campusSelector.locator('input')).toHaveValue(PACE_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('PACE');
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // only PACE spaces display
            await expect(visibleSpaces).toHaveCount(1);
            await expect(lawSpace).not.toBeVisible();
            await expect(paceSpace).toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            // deselect campuses
            campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_ALL_OPTION)).toContainText('Show all campuses');
            campusOptionLabel(CAMPUS_ALL_OPTION).click(); // unset
            await expect(campusSelector.locator('input')).toHaveValue('');
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // all campus spaces display
            await expect(visibleSpaces).toHaveCount(3);
        });
        test('by locations', async ({ page }) => {
            const visibleSpaces = page
                .getByTestId('space-table')
                .locator('tbody')
                .locator(':scope > tr:not(.hidden)');
            const lawSpace = page.getByTestId('edit-space-123456-button');
            const paceSpace = page.getByTestId('edit-space-1234544-button');
            const liverisSpace = page.getByTestId('edit-space-43534-button');

            const campusSelector = page.getByTestId('filter-by-campus');
            const librarySelector = page.getByTestId('filter-by-library');
            const floorSelector = page.getByTestId('filter-by-floor');

            const campusOptionLabel = (optionIndex: string) =>
                page.locator(`ul[aria-labelledby="filter-by-campus-label"] li:nth-of-type(${optionIndex})`);

            await page.goto('/admin/spaces?user=libSpaces');
            await page.setViewportSize({ width: 1300, height: 1000 });
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded

            // initially all space rows are visible
            await expect(
                page
                    .getByTestId('space-table')
                    .locator('tbody')
                    .locator(':scope > tr'),
            ).toHaveCount(3);
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).toBeVisible();
            await expect(liverisSpace).toBeVisible();

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // choose PACE
            campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_PACE_OPTION)).toContainText('PACE');
            campusOptionLabel(CAMPUS_PACE_OPTION).click(); // choose PACE
            await expect(campusSelector.locator('input')).toHaveValue(PACE_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('PACE');
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();
            await expect(visibleSpaces).toHaveCount(1); // only PACE spaces display
            await expect(lawSpace).not.toBeVisible();
            await expect(paceSpace).toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            // Change to St Lucia
            campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_ST_LUCIA_OPTION)).toContainText('St Lucia');
            campusOptionLabel(CAMPUS_ST_LUCIA_OPTION).click();
            await expect(campusSelector.locator('input')).toHaveValue(ST_LUCIA_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('St Lucia');
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();
            await expect(visibleSpaces).toHaveCount(2); // only St Lucia spaces display
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).toBeVisible();

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // choose Walter Harrison library
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).toBeEmpty();
            librarySelector.click();
            const firstLibraryOption = page.locator('ul[aria-labelledby="filter-by-library-label"] li:nth-of-type(1)');
            await expect(firstLibraryOption).toContainText('Walter Harrison Law Library');
            firstLibraryOption.click(); // choose Walter Harrison
            await expect(visibleSpaces).toHaveCount(1); // only the Walter Harrison space displays
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).not.toBeDisabled();

            // choose Floor 3a
            await expect(floorSelector.locator('input')).not.toBeDisabled();
            await expect(floorSelector.locator('input')).toBeEmpty();
            floorSelector.click();
            const secondFloorOption = 'ul[aria-labelledby="filter-by-floor-label"] li:nth-of-type(2)';
            await expect(page.locator(secondFloorOption)).toContainText('3A');
            page.locator(secondFloorOption).click(); // choose 3A
            await expect(visibleSpaces).toHaveCount(0); // No spaces display
            await expect(lawSpace).not.toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            // choose Floor 2
            await expect(floorSelector.locator('input')).not.toBeDisabled();
            floorSelector.click();
            const firstFloorOption = 'ul[aria-labelledby="filter-by-floor-label"] li:nth-of-type(1)';
            await expect(page.locator(firstFloorOption)).toContainText('2');
            page.locator(firstFloorOption).click(); // choose floor "2"
            await expect(visibleSpaces).toHaveCount(1); // 1 space displays
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            // deselect campuses
            campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_ALL_OPTION)).toContainText('Show all campuses');
            campusOptionLabel(CAMPUS_ALL_OPTION).click(); // unset
            await expect(campusSelector.locator('input')).toHaveValue('');
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();
            await expect(visibleSpaces).toHaveCount(3); // all campus spaces display

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
        optionsButton.click();

        await expect(page.getByTestId('admin-spaces-menu')).toBeVisible();
        await expect(visitHomepageButton).toBeVisible();
        visitHomepageButton.click();

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
        pushOutbutton.click();

        const tableWrapperBoundingBox2 = await tableWrapper.boundingBox();
        await expect(tableWrapperBoundingBox2?.width).toBeGreaterThan(pageWidth - 200);
        await expect(tableWrapperBoundingBox2?.width).toBeLessThan(pageWidth);

        const pushInbutton = page.getByTestId('table-pushin-button');
        await expect(pushInbutton).toBeVisible();
        pushInbutton.click();

        await page.waitForTimeout(500); // cant think of any way to wait for the redraw!
        const tableWrapperBoundingBox3 = await tableWrapper.boundingBox();
        await expect(tableWrapperBoundingBox3?.width).toBeGreaterThan(1130);
        await expect(tableWrapperBoundingBox3?.width).toBeLessThan(1150);
    });
    test('can open and close friendly locations', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        const descriptionPanel = page.getByTestId('space-description-43534');
        const expandButton = page.getByTestId('space-43534-expand-button');
        const collapseButton = page.getByTestId('space-43534-collapse-button');

        // "friendly" location description starts off hidden
        await expect(descriptionPanel).not.toBeVisible();
        await expect(collapseButton).not.toBeVisible();
        await expect(expandButton).toBeVisible();

        // click the expand button
        expandButton.click();

        // description shows and buttons have swapped
        await expect(descriptionPanel).toBeVisible();
        await expect(collapseButton).toBeVisible();
        await expect(expandButton).not.toBeVisible();

        // click the collapse button
        collapseButton.click();

        // description disappears again and buttons have swapped
        await expect(descriptionPanel).not.toBeVisible();
        await expect(collapseButton).not.toBeVisible();
        await expect(expandButton).toBeVisible();
    });
});
