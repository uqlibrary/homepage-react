import { CoverageConfig } from './scripts/code-coverage';

const config: CoverageConfig = {
    reporter: ['html', 'text-summary', 'json', 'cobertura'],
    include: [
        'src/modules/**/*.{js,jsx}',
        'src/modules/HomePage/*.{js,jsx}',
        'src/actions/*.{js,jsx}',
        'src/helpers/*.{js,jsx}',
        'src/middleware/*.{js,jsx}',
        'src/reducers/*.{js,jsx}',
        'src/repositories/routes.js',
    ],
    // Patterns prefixed with '!' are negation overrides — they force-include files
    // that would otherwise be excluded by a regular exclude pattern above.
    exclude: [
        'src/**/{index,locale,config}.js',
        'src/**/containers/*.{js,jsx}',
        'src/**/*.{test,locale}.{js,jsx}',
        'src/modules/testhelpers.{js,jsx}',
        'src/modules/SharedComponents/ScrollTop/components/*.{js,jsx}',
        'src/modules/SharedComponents/Toolbox/Alert/components/*.{js,jsx}',
        'src/modules/SharedComponents/Toolbox/ScrollToTop/components/*.{js,jsx}',
        'src/modules/SharedComponents/Toolbox/helpers/*.{js,jsx}',
        '!src/modules/Pages/Admin/**',
        '!src/modules/App/**',
        '!src/modules/HomePage/**',
        '!src/modules/Pages/BookExamBooth/**',
        '!src/modules/Pages/DigitalLearningObjects/**',
        '!src/modules/Pages/PastExamPaperSearch/**',
        '!src/modules/Pages/PastExamPaperList/**',
        '!src/modules/Pages/LearningResources/**',
        '!src/modules/Pages/NotFound/**',
        '!src/modules/Pages/PaymentReceipt/**',
        '!src/modules/SharedComponents/**',
    ],
};

export default config;
