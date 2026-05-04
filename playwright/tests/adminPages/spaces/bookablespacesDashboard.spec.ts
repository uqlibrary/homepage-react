import { expect, test } from '@uq/pw/test';
import { assertAccessibility } from '@uq/pw/lib/axe';
import { assertToastHasMessage } from '@uq/pw/tests/adminPages/spaces/spacesTestHelper';
import { assertExpectedDataSentToServer, setTestDataCookie } from '@uq/pw/lib/helpers';
import { Page } from '@playwright/test';

const CAMPUS_ALL_OPTION = '1';
const CAMPUS_ST_LUCIA_OPTION = '2';
const CAMPUS_PACE_OPTION = '4';
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
        const visibleSpaces = page
            .getByTestId('space-table')
            .locator('tbody')
            .locator(':scope > tr:not(.hidden)');

        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible(); // page had loaded
        await expect(page.getByTestId('spaces-sort-button')).toContainText('Sort by name');
        await page.getByTestId('admin-spaces-list-paginator-select').selectOption('10');
        await expect(visibleSpaces).toHaveCount(10);

        await expect(page.getByTestId(`space-${FORGEN}-name`)).toBeVisible();
        await expect(page.getByTestId(`space-${FORGEN}-outage-upcoming-icon`)).toBeVisible();
        await expect(page.getByTestId(`space-${FORGEN}-outage-current-icon`)).not.toBeVisible();

        await expect(page.getByTestId(`space-${LIVERIS}-name`)).toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}-outage-upcoming-icon`)).not.toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}-outage-current-icon`)).not.toBeVisible();

        // at bottom of "10 spaces showing"
        await expect(page.getByTestId(`space-${PACE}-name`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}-outage-upcoming-icon`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}-outage-current-icon`)).not.toBeVisible();

        const greenTick = (id: string) =>
            page.getByTestId(`${id}`).locator('svg path[d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"]');

        const FORGAN_SMITH_FACILITY_TYPE = 'space-123456-facilitytype';
        const DUTTON_PARK_FACILITY_TYPE = 'space-1234544-facilitytype';
        const LIVERIS_FACILITY_TYPE = 'space-43534-facilitytype';
        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-bookable`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-bookable`)).toBeVisible();

        // Facility Type IDs
        const askus = 54;
        const foodOutlets = 53;
        const productionPrinting = 55;
        const retail = 56;
        const artwork = 57;
        const energyPod = 30;
        const vending = 26;
        const fridge = 20;
        const hotColdWater = 21;
        const kitchen = 3;
        const microwave = 4;
        const pharmacy = 28;
        const pwdToilets = 25;
        const pwdToiletsFlat = 24;
        const recharge = 29;
        const scanning = 31;
        const stationery = 27;
        const toiletsF = 23;
        const toiletsM = 22;
        const adjustable = 39;
        const avEquipment = 8;
        const byod = 32;
        const powerPoint = 33;
        const computer = 5;
        const generalCollection = 42;
        const highUseCollection = 41;
        const lending = 45;
        const lockers = 40;
        const loungeChairs = 47;
        const powerPointB = 7;
        const usbA = 34;
        const usbCHigh = 37;
        const usbCLow = 36;
        const qiCharger = 35;
        const reading = 43;
        const requested = 44;
        const returnStation = 46;
        const dimmable = 48;
        const lowLight = 49;
        const naturalLight = 50;
        const highNoise = 10;
        const lowNoise = 17;
        const ATtech = 11;
        const exam = 52;
        const postgrad = 13;
        const power = 12;
        const underGrad = 14;
        const whiteboard = 38;
        const deskLamp = 16;

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${askus}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${askus}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${foodOutlets}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${foodOutlets}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${productionPrinting}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${productionPrinting}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${retail}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${retail}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${artwork}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${artwork}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${energyPod}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${energyPod}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${vending}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${vending}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${fridge}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${fridge}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${hotColdWater}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${hotColdWater}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${kitchen}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${kitchen}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${microwave}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${microwave}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${pharmacy}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${pharmacy}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${pwdToilets}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${pwdToilets}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${pwdToiletsFlat}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${pwdToiletsFlat}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${recharge}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${recharge}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${scanning}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${scanning}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${stationery}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${stationery}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${toiletsF}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${toiletsF}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${toiletsM}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${toiletsM}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${adjustable}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${adjustable}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${avEquipment}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${avEquipment}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${byod}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${byod}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${powerPoint}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${powerPoint}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${computer}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${computer}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${generalCollection}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${generalCollection}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${highUseCollection}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${highUseCollection}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${lending}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${lending}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${lockers}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${lockers}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${loungeChairs}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${loungeChairs}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${powerPointB}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${powerPointB}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${usbA}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${usbA}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${usbCHigh}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${usbCHigh}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${usbCLow}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${usbCLow}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${qiCharger}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${qiCharger}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${reading}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${reading}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${requested}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${requested}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${returnStation}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${returnStation}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${whiteboard}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${whiteboard}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${deskLamp}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${deskLamp}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${dimmable}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${dimmable}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${lowLight}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${lowLight}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${naturalLight}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${naturalLight}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${highNoise}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${highNoise}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${lowNoise}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${lowNoise}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${ATtech}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${ATtech}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${exam}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${exam}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${postgrad}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${postgrad}`)).toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${power}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${power}`)).not.toBeVisible();

        await expect(page.getByTestId(`${FORGAN_SMITH_FACILITY_TYPE}-${underGrad}`)).toBeVisible();
        await expect(greenTick(`${FORGAN_SMITH_FACILITY_TYPE}-${underGrad}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-bookable`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-bookable`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${askus}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${askus}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${foodOutlets}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${foodOutlets}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${productionPrinting}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${productionPrinting}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${retail}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${retail}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${artwork}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${artwork}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${energyPod}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${energyPod}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${vending}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${vending}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${fridge}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${fridge}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${hotColdWater}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${hotColdWater}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${kitchen}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${kitchen}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${microwave}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${microwave}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${pharmacy}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${pharmacy}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${pwdToilets}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${pwdToilets}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${pwdToiletsFlat}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${pwdToiletsFlat}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${recharge}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${recharge}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${scanning}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${scanning}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${stationery}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${stationery}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${toiletsF}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${toiletsF}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${toiletsM}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${toiletsM}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${adjustable}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${adjustable}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${avEquipment}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${avEquipment}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${byod}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${byod}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${powerPoint}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${powerPoint}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${computer}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${computer}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${generalCollection}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${generalCollection}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${highUseCollection}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${highUseCollection}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${lending}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${lending}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${lockers}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${lockers}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${loungeChairs}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${loungeChairs}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${powerPointB}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${powerPointB}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${usbA}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${usbA}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${usbCHigh}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${usbCHigh}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${usbCLow}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${usbCLow}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${qiCharger}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${qiCharger}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${reading}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${reading}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${requested}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${requested}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${returnStation}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${returnStation}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${deskLamp}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${deskLamp}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${dimmable}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${dimmable}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${lowLight}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${lowLight}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${naturalLight}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${naturalLight}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${highNoise}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${highNoise}`)).toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${lowNoise}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${lowNoise}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${ATtech}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${ATtech}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${exam}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${exam}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${postgrad}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${postgrad}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${power}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${power}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${underGrad}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${underGrad}`)).not.toBeVisible();

        await expect(page.getByTestId(`${DUTTON_PARK_FACILITY_TYPE}-${whiteboard}`)).toBeVisible();
        await expect(greenTick(`${DUTTON_PARK_FACILITY_TYPE}-${whiteboard}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-bookable`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-bookable`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${askus}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${askus}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${foodOutlets}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${foodOutlets}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${productionPrinting}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${productionPrinting}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${retail}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${retail}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${artwork}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${artwork}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${energyPod}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${energyPod}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${vending}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${vending}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${fridge}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${fridge}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${hotColdWater}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${hotColdWater}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${kitchen}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${kitchen}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${microwave}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${microwave}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${pharmacy}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${pharmacy}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${pwdToilets}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${pwdToilets}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${pwdToiletsFlat}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${pwdToiletsFlat}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${recharge}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${recharge}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${scanning}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${scanning}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${stationery}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${stationery}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${toiletsF}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${toiletsF}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${toiletsM}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${toiletsM}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${adjustable}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${adjustable}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${avEquipment}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${avEquipment}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${byod}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${byod}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${powerPoint}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${powerPoint}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${computer}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${computer}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${generalCollection}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${generalCollection}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${highUseCollection}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${highUseCollection}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${lending}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${lending}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${lockers}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${lockers}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${loungeChairs}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${loungeChairs}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${powerPointB}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${powerPointB}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${usbA}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${usbA}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${usbCHigh}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${usbCHigh}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${usbCLow}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${usbCLow}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${qiCharger}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${qiCharger}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${reading}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${reading}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${requested}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${requested}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${returnStation}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${returnStation}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${deskLamp}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${deskLamp}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${dimmable}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${dimmable}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${lowLight}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${lowLight}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${naturalLight}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${naturalLight}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${highNoise}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${highNoise}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${lowNoise}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${lowNoise}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${ATtech}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${ATtech}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${exam}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${exam}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${postgrad}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${postgrad}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${power}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${power}`)).not.toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${underGrad}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${underGrad}`)).toBeVisible();

        await expect(page.getByTestId(`${LIVERIS_FACILITY_TYPE}-${whiteboard}`)).toBeVisible();
        await expect(greenTick(`${LIVERIS_FACILITY_TYPE}-${whiteboard}`)).not.toBeVisible();
    });
    test('single result is as expected', async ({ page }) => {
        await page.goto('/admin/spaces?user=libSpaces&responseType=facilityTypesWithOne');
        await page.setViewportSize({ width: 1300, height: 1000 });
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        await expect(page.getByTestId('spaces-dashboard-header-row').locator('> th')).toHaveCount(3);
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
            await expect(page.getByTestId('spaces-sort-button')).toContainText('Sort by name');

            // initially paginator limit of 5 is visible and sorted by name
            await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
            await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
            await expect(page.getByTestId(`space-${PACE}`)).not.toBeVisible();
            await expect(page.getByTestId(`space-${LIVERIS}`)).not.toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS3}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS4}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS5}`)).toBeVisible();

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

            // only St Lucia spaces display on the first page, still sorted by name
            await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
            await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
            await expect(page.getByTestId(`space-${LIVERIS}`)).not.toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS3}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS4}`)).toBeVisible();
            await expect(page.getByTestId(`space-${ARMUS5}`)).toBeVisible();
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            // open campus selector
            await campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_PACE_OPTION)).toContainText('Dutton Park');

            // choose PACE
            await campusOptionLabel(CAMPUS_PACE_OPTION).click(); // select PACE campus option
            await expect(campusSelector.locator('input')).toHaveValue(PACE_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('Dutton Park');
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
            await expect(page.getByTestId('spaces-sort-button')).toContainText('Sort by name');

            // initially all first page space rows are visible in name order
            await expect(
                page
                    .getByTestId('space-table')
                    .locator('tbody')
                    .locator(':scope > tr'),
            ).toHaveCount(PAGINATE_TO_SHOW_5);
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

            await expect(campusSelector.locator('input')).not.toBeDisabled();
            await expect(librarySelector.locator('input')).toBeDisabled();
            await expect(floorSelector.locator('input')).toBeDisabled();

            // open campus selector
            await campusSelector.click();
            await expect(campusOptionLabel(CAMPUS_PACE_OPTION)).toContainText('Dutton Park');

            // choose PACE
            await campusOptionLabel(CAMPUS_PACE_OPTION).click();
            await expect(campusSelector.locator('input')).toHaveValue(PACE_RECORD_ID);
            await expect(campusSelector.locator('div')).toContainText('Dutton Park');
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
            await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5); // first page of St Lucia spaces display
            await expect(lawSpace).toBeVisible();
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();

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
            await expect(paceSpace).not.toBeVisible();
            await expect(liverisSpace).not.toBeVisible();
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
        await expect(page.getByTestId('spaces-sort-button')).toContainText('Sort by name');
        await page.getByTestId('admin-spaces-list-paginator-select').selectOption('10');

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
        await expect(page.getByTestId('spaces-sort-button')).toContainText('Sort by name');

        await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}`)).not.toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}`)).not.toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS3}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS4}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS5}`)).toBeVisible();

        // paginator shows correct number
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–5 of 16');

        // go to next page of pagination, 6-16 of 16
        const paginationBlock = page.getByTestId('pagination-block');
        const nextPaginationButton = paginationBlock.locator('[aria-label="Go to next page"]');
        await expect(nextPaginationButton).toBeVisible();
        await nextPaginationButton.click();
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('6–10 of 16');
        await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        await expect(page.getByTestId(`space-${ARMUS1}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS6}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS7}`)).toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}`)).toBeVisible();

        // go to back to first page of pagination, 1-5 of 16
        const previousPaginationButton = paginationBlock.locator('[aria-label="Go to previous page"]');
        await expect(previousPaginationButton).toBeVisible();
        await previousPaginationButton.click();
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–5 of 16');
        await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}`)).not.toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}`)).not.toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS3}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS4}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS5}`)).toBeVisible();

        await expect(campusSelector.locator('input')).not.toBeDisabled();
        await campusSelector.click();

        // limit to St Lucia only
        await expect(campusOptionLabel(CAMPUS_ST_LUCIA_OPTION)).toContainText('St Lucia');
        await campusOptionLabel(CAMPUS_ST_LUCIA_OPTION).click(); // choose St Lucia
        await expect(campusSelector.locator('input')).toHaveValue(ST_LUCIA_RECORD_ID);
        await expect(campusSelector.locator('div')).toContainText('St Lucia');
        await expect(librarySelector.locator('input')).not.toBeDisabled();
        await expect(floorSelector.locator('input')).toBeDisabled();

        // only St Lucia spaces display on the first page, still sorted by name
        await expect(visibleSpaces).toHaveCount(PAGINATE_TO_SHOW_5);
        await expect(page.getByTestId(`space-${FORGEN}`)).toBeVisible();
        await expect(page.getByTestId(`space-${PACE}`)).not.toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}`)).not.toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS2}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS3}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS4}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS5}`)).toBeVisible();

        // paginator shows correct number
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–5 of 11');

        // paginate
        const nextPageButton = page.locator('[aria-label="Go to next page"]');
        await expect(nextPageButton).toBeVisible();
        await nextPageButton.click();

        // next page of St Lucia spaces display
        await expect(visibleSpaces).toHaveCount(5); // the second page of a set of 11
        await expect(page.getByTestId(`space-${ARMUS7}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS6}`)).toBeVisible();
        await expect(page.getByTestId(`space-${ARMUS1}`)).toBeVisible();
        await expect(page.getByTestId(`space-${LIVERIS}`)).toBeVisible();

        // paginator shows correct number
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('6–10 of 11');

        // change number of rows displayed
        const rowsperpageSelector = page.getByTestId('admin-spaces-list-paginator-select');
        await expect(rowsperpageSelector).toBeVisible();
        await rowsperpageSelector.selectOption('10'); // choose '10 per page'
        await expect(visibleSpaces).toHaveCount(10);

        // paginator shows correct number
        await expect(pageCountDisplay).toBeVisible();
        await expect(pageCountDisplay).toContainText('1–10 of 11');
    });
    test('remembers pagination', async ({ page, context }) => {
        await page.goto('/admin/spaces?user=libSpaces');
        await page.setViewportSize({ width: 1300, height: 1000 });

        // wait for page to load
        await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

        // initally 5 rows showing
        const pageCountDisplay2 = page.locator('.MuiTablePagination-displayedRows');
        await expect(pageCountDisplay2).toBeVisible();
        await expect(pageCountDisplay2).toContainText('1–5 of 16');

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
        await expect(pageCountDisplay).toContainText('1–10 of 16');

        await expect(
            page
                .getByTestId('space-table')
                .locator('tbody')
                .locator(':scope > tr:not(.hidden)'),
        ).toHaveCount(10);
    });
    test.describe('can bulk manage facility types', () => {
        const changeCheckboxes = async (page: Page) => {
            const artwork = 57;
            const energyPod = 30;

            const editButton = (id: number) => page.getByTestId(`facility-type-column-edit-${id}`);
            const cancelButton = (id: number) => page.getByTestId(`facility-type-column-cancel-${id}`);
            const saveButton = (id: number) => page.getByTestId(`facility-type-column-save-${id}`);

            // initally, all edit buttons are enabled
            await expect(editButton(energyPod)).toBeVisible();
            await expect(editButton(energyPod)).not.toBeDisabled();
            await expect(editButton(artwork)).toBeVisible();
            await expect(editButton(artwork)).not.toBeDisabled();

            // and the control buttons are not visible
            await expect(cancelButton(artwork)).not.toBeVisible();
            await expect(saveButton(artwork)).not.toBeVisible();
            await expect(cancelButton(energyPod)).not.toBeVisible();
            await expect(saveButton(energyPod)).not.toBeVisible();

            // now, choose to edit the artwork types
            await editButton(artwork).click();

            // artwork edit buttons change to control buttons
            await expect(editButton(artwork)).not.toBeVisible();
            await expect(cancelButton(artwork)).toBeVisible();
            await expect(saveButton(artwork)).toBeVisible();

            // other buttons unchanged
            await expect(cancelButton(energyPod)).not.toBeVisible();
            await expect(saveButton(energyPod)).not.toBeVisible();
            await expect(editButton(energyPod)).toBeVisible();
            await expect(editButton(energyPod)).toBeDisabled();

            const facilityTypeCheckbox = (spaceId: number, facilityTypeId: number) =>
                page.getByTestId(`space-${spaceId}-facilitytype-${facilityTypeId}`).locator('input');

            // first artwork checkbox is checked. uncheck it
            const firstSpace = 123456;
            await expect(facilityTypeCheckbox(firstSpace, artwork)).toBeVisible();
            await expect(facilityTypeCheckbox(firstSpace, artwork)).toBeChecked();
            await facilityTypeCheckbox(firstSpace, artwork).uncheck();

            // second artwork checkbox is unchecked. check it
            const secondSpace = 2;
            await expect(facilityTypeCheckbox(secondSpace, artwork)).toBeVisible();
            await expect(facilityTypeCheckbox(secondSpace, artwork)).not.toBeChecked();
            await facilityTypeCheckbox(secondSpace, artwork).check();

            // and save
            await saveButton(artwork).click();
        };
        test('can save', async ({ page, context }) => {
            await page.goto('/admin/spaces?user=libSpaces');
            await page.setViewportSize({
                width: 1300,
                height: 1000,
            });

            await setTestDataCookie(context, page);

            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

            await changeCheckboxes(page);

            // success message displays
            await assertToastHasMessage(page, 'Change to facility types saved.');

            const expectedValues = [
                { checked: false, space_id: '1' },
                { checked: true, space_id: '2' }, // changed
                { checked: false, space_id: '3' },
                { checked: false, space_id: '4' },
                { checked: false, space_id: '5' },
                { checked: false, space_id: '6' },
                { checked: false, space_id: '7' },
                { checked: false, space_id: '8' },
                { checked: false, space_id: '9' },
                { checked: false, space_id: '10' },
                { checked: false, space_id: '11' },
                { checked: true, space_id: '13' },
                { checked: true, space_id: '14' },
                { checked: false, space_id: '43534' },
                { checked: false, space_id: '123456' },
                { checked: false, space_id: '1234544' }, // changed
            ];
            await assertExpectedDataSentToServer(page, expectedValues);
        });
        test('failed save displays correctly', async ({ page, context }) => {
            await page.goto('/admin/spaces?user=libSpaces&responseType=bulkFacilitiesUpdateError');
            await page.setViewportSize({
                width: 1300,
                height: 1000,
            });

            await setTestDataCookie(context, page);

            // wait for page to load
            await expect(page.getByTestId('admin-spaces-page-title').getByText(/Manage Spaces/)).toBeVisible();

            await changeCheckboxes(page);

            // error dialog displays
            await expect(page.getByTestId('message-title')).toBeVisible();
            await expect(page.getByTestId('message-title')).toContainText(
                '[BSMS-001] Sorry, an error occurred - updating the facility types failed. The admins have been informed',
            );
        });
    });
});
