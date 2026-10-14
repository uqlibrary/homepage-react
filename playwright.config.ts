import { defineConfig, devices } from '@playwright/test';
import { Config as IstanbulMergerConfig } from './playwright/lib/coverage/istanbul/ReportMerger';
import { baseURL, istanbulReportPartialsDir, istanbulStructureDir } from './playwright/lib/constants';
import * as process from 'node:process';
import * as os from 'node:os';

// CI runs 3 workers per 4-vCPU pipe ('75%' of 4). Local dev is capped at the lesser of half the
// machine's cores and 4, to keep local memory and CPU use in check.
const localWorkers = Math.min(4, Math.max(1, Math.floor(os.cpus().length / 2)));

export default defineConfig({
    outputDir: `playwright/.results/${process.env.PW_SHARD_INDEX || ''}`,
    testDir: 'playwright/tests',
    timeout: 120_000,
    expect: {
        timeout: 10_000,
    },
    fullyParallel: true,
    failOnFlakyTests: !process.env.CI_BRANCH,
    forbidOnly: !!process.env.CI_BRANCH,
    retries: process.env.CI_BRANCH ? 2 : 0,
    workers: process.env.CI_BRANCH ? '75%' : localWorkers,
    reporter: [
        ['list'],
        [
            './playwright/lib/coverage/istanbul/ReportMerger.ts',
            {
                outputDir: 'coverage/playwright',
                jsonPartialsDir: istanbulReportPartialsDir,
                structureDir: istanbulStructureDir,
                jsonReportFilename: process.env.PW_CC_REPORT_FILENAME,
            } as IstanbulMergerConfig,
        ],
    ],
    use: {
        baseURL,
        trace: 'retain-on-failure',
        headless: process.env.PW_HEADED === 'true' ? false : true,
        ignoreHTTPSErrors: true,
        bypassCSP: true,
        launchOptions: {
            args: ['--disable-web-security', '--disable-ipv6', '--disable-dev-shm-usage'],
        },
    },
    projects: [
        {
            name: 'chromium-headless-shell',
            use: {
                ...devices['Desktop Chrome'],
                viewport: {
                    width: 1000,
                    height: 660,
                },
            },
        },
    ],
    webServer: {
        command: 'npm run start:mock',
        url: baseURL,
        timeout: 5 * 60 * 1000,
        reuseExistingServer: true,
    },
});
