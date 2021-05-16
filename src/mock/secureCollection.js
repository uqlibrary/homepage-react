// secure collection checks
import * as routes from 'repositories/routes';
import MockAdapter from 'axios-mock-adapter';
import { api } from 'config';
const mock = new MockAdapter(api, { delayResponse: 100 });

// http://localhost:2020/collection?user=s1111111&collection=exams&file=phil1010.pdf
mock.onGet(routes.SECURE_COLLECTION_CHECK_API({ path: 'exams/phil1010.pdf' }).apiUrl).reply(() => {
    return [200, { response: 'Login required' }];
});

// http://localhost:2020/collection?user=s1111111&collection=collection&file=doesntExist
mock.onGet(routes.SECURE_COLLECTION_CHECK_API({ path: 'collection/doesntExist' }).apiUrl).reply(() => {
    return [200, { response: 'No such collection' }];
});

// http://localhost:2020/collection?user=s1111111&collection=exams&file=2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf
// https://files.library.uq.edu.au/exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf
mock.onGet(
    routes.SECURE_COLLECTION_CHECK_API({ path: 'exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf' })
        .apiUrl,
).reply(() => {
    return [
        200,
        {
            url:
                'http://localhost:2020//secure/exams/2018/Semester_Two_Final_Examinations__2018_PHIL2011_281.pdf?Expires=1621059344&Signature=long_string&Key-Pair-Id=APKAJNDQICYW445PEOSA',
            displaypanel: 'redirect',
        },
    ];
});

// https://files.library.uq.edu.au/coursebank/111111111111111.pdf
// http://localhost:2020/collection?user=s1111111&collection=coursebank&file=111111111111111.pdf
mock.onGet(routes.SECURE_COLLECTION_CHECK_API({ path: 'coursebank/file=111111111111111.pdf' }).apiUrl).reply(() => {
    return [
        200,
        {
            url:
                'http://localhost:2020//secure/coursebank/111111111111111.pdf?Expires=1621060025&Signature=longString&Key-Pair-Id=APKAJNDQICYW445PEOSA"',
            displaypanel: 'statutoryCopyright',
            acknowledgementRequired: true,
        },
    ];
});

// http://localhost:2020/collection?user=s1111111&collection=api&file=fails
mock.onGet(routes.SECURE_COLLECTION_CHECK_API({ path: 'api/fails' }).apiUrl).reply(() => {
    return [500, {}];
});
