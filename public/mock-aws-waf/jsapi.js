// Local stand-in for the AWS WAF CAPTCHA integration script (jsapi.js), served only in the mock build (USE_MOCK).
// It draws a single "solve" button in place of the real puzzle and hands back a fixed token, so the membership
// application form's CAPTCHA gate can be driven locally and in the end-to-end tests without reaching AWS. In the
// deployed environments the real jsapi.js is loaded from the AWS integration URL instead of this file.
(function () {
    const MOCK_TOKEN = 'mock-waf-token';

    window.AwsWafCaptcha = {
        renderCaptcha: function (container, config) {
            container.innerHTML = '';
            const solve = document.createElement('button');
            solve.type = 'button';
            solve.textContent = 'Verify you are not a robot (mock)';
            solve.setAttribute('data-testid', 'mock-captcha-solve');
            solve.addEventListener('click', function () {
                config.onSuccess(MOCK_TOKEN);
            });
            container.appendChild(solve);
        },
    };

    // The real jsapi.js also loads the intelligent threat integration, which provides the token. Mirror the one
    // call the form makes: reading the current token to send with the application.
    window.AwsWafIntegration = {
        getToken: function () {
            return Promise.resolve(MOCK_TOKEN);
        },
    };
})();
