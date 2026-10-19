import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

class LongestTestsReporter implements Reporter {
    private testDurations: { title: string; duration: number }[] = [];

    // Runs after every individual test finishes
    onTestEnd(test: TestCase, result: TestResult) {
        this.testDurations.push({
            // Combines file name, describe blocks, and test title
            title: test.titlePath().join(' ➔ '),
            duration: result.duration, // Duration in milliseconds
        });
    }

    // Runs once the entire test suite completes
    onEnd() {
        const top25 = this.testDurations.sort((a, b) => b.duration - a.duration).slice(0, 25);

        console.log('\n🐢 === TOP 25 LONGEST RUNNING TESTS ===');
        top25.forEach((item, index) => {
            const seconds = (item.duration / 1000).toFixed(2);
            console.log(`${String(index + 1).padStart(2, ' ')}. ${seconds}s | ${item.title}`);
        });
        const totalDuration = top25.reduce((total, item) => total + item.duration, 0);
        console.log('=======================================');
        console.log(`Total time for the ${top25.length} slowest tests: ${(totalDuration / 1000).toFixed(2)}s`);
        console.log('=======================================\n');
    }
}

export default LongestTestsReporter;
