import { test, expect, Page } from '@uq/pw/test';
import { baseURL } from '../../lib/constants';

// The chatbot page fetches a DirectLine token from Microsoft's Power Platform,
// then connects to the DirectLine stream (WebSocket) to receive bot messages.
// These mocks intercept all external calls, so the test runs without network access.

const MOCK_CONV_ID = 'mock-conv-id';
const MOCK_TOKEN = 'mock-directline-token';
const MOCK_STREAM_URL = `${baseURL.replace('http', 'ws')}/mock-directline-stream`;
const BOT_WELCOME_TEXT = 'I work in a question and answer format';

async function setupChatbotMocks(page: Page) {
    // Regional channel settings — tells webchat to use localhost as the DirectLine host
    await page.route('**/powervirtualagents/regionalchannelsettings**', route =>
        route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({ channelUrlsById: { directline: `${baseURL}/` } }),
        }),
    );

    // DirectLine token
    await page.route('**/powervirtualagents/botsbyschema/**', route =>
        route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({ token: MOCK_TOKEN }),
        }),
    );

    // Start conversation — no streaming reconnect token needed, we provide the stream URL directly
    await page.route('**/v3/directline/conversations', route => {
        if (route.request().method() !== 'POST') return route.continue();
        return route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({
                conversationId: MOCK_CONV_ID,
                token: MOCK_TOKEN,
                expires_in: 1800,
                streamUrl: MOCK_STREAM_URL,
            }),
        });
    });

    // Activity POSTs from the page (e.g. startConversation event)
    await page.route(`**/v3/directline/conversations/${MOCK_CONV_ID}/activities**`, route =>
        route.fulfill({
            contentType: 'application/json',
            body: JSON.stringify({ id: 'mock-activity-posted' }),
        }),
    );

    // DirectLine stream — the bot sends activities to the client over this WebSocket.
    // Once the connection opens, directline-js transitions to Online (status 2),
    // which triggers chatbot.html to post the startConversation event.
    // We wait briefly, then send the bot's welcome message.
    await page.routeWebSocket(MOCK_STREAM_URL, ws => {
        setTimeout(() => {
            ws.send(
                JSON.stringify({
                    activities: [
                        {
                            type: 'message',
                            id: 'bot-welcome-1',
                            timestamp: new Date().toISOString(),
                            channelId: 'directline',
                            from: { id: 'bot', role: 'bot', name: 'UQ Library Assistant' },
                            conversation: { id: MOCK_CONV_ID },
                            text: BOT_WELCOME_TEXT,
                            inputHint: 'acceptingInput',
                        },
                    ],
                    watermark: '1',
                }),
            );
        }, 500);
    });
}

test.describe('Chatbot', () => {
    const loadPage = async (page: Page) => {
        await expect(async () => {
            await page.goto('chatbot.html', { timeout: 60_000 });
            await expect(page.locator('.webchat').first()).toBeVisible({ timeout: 30_000 });
            await expect(
                page
                    .locator('.webchat')
                    .getByText(BOT_WELCOME_TEXT)
                    .first(),
            ).toBeVisible();
        }).toPass();
        await page.setViewportSize({ width: 1300, height: 1000 });
    };

    test.beforeEach(async ({ page, context }) => {
        await context.clearCookies();
        await setupChatbotMocks(page);
    });

    test.describe('chatbot', () => {
        test('works as expected', async ({ page }) => {
            await loadPage(page);

            const directLineToken = await page.evaluate(() => window.sessionStorage.getItem('directLineToken'));
            expect(directLineToken).not.toBeNull(); // for comparison with another test
        });
    });

    test.describe('chatbot without session storage', () => {
        const testCookieName = 'SESSIONSTORAGE_BLOCKED';
        test.beforeEach(async ({ page, context }) => {
            await context.addCookies([
                {
                    name: testCookieName,
                    value: 'active',
                    url: baseURL,
                },
            ]);
            await loadPage(page);
        });
        test('works without session storage', async ({ page, context }) => {
            const cookies = await context.cookies();
            const cookie = cookies.find(c => c.name === testCookieName);
            expect(cookie).toBeDefined();

            const directLineToken = await page.evaluate(() => window.sessionStorage.getItem('directLineToken'));
            expect(directLineToken).toBeNull();
        });
    });
});
