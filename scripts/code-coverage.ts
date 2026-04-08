#!/usr/bin/env tsx

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, relative, resolve } from 'path';
import { CoverageMap, createCoverageMap } from 'istanbul-lib-coverage';
import { createContext } from 'istanbul-lib-report';
import { create as createReporter } from 'istanbul-reports';
import { isMatch } from 'micromatch';
import coverageConfig from '../coverage.config';

/** Shape of the coverage configuration. */
export type CoverageConfig = {
    include?: string[];
    exclude?: string[];
    reporter?: string[];
};

/**
 * Merges Jest and Playwright Istanbul coverage reports into a single combined report.
 *
 * Coverage configuration (include/exclude/reporter) is read from `coverage.config.ts`.
 * Exclude patterns prefixed with `!` act as negation overrides,
 * force-including files that would otherwise be excluded.
 */
class CoverageMerger {
    private readonly coverageDir: string;
    private readonly playwrightDir: string;
    private readonly jestReport: string;
    private readonly coverageConfig: CoverageConfig;

    constructor() {
        this.coverageDir = resolve('coverage');
        this.playwrightDir = join(this.coverageDir, 'playwright');
        this.jestReport = join(this.coverageDir, 'jest', 'coverage-final.json');
        this.coverageConfig = coverageConfig;
    }

    /**
     * Validates inputs, merges coverage data, applies filters, and writes reports.
     * Entry point for the script.
     */
    run(): void {
        this.validateInputs();
        const map = this.mergeReports();
        const filteredMap = this.applyFilters(map);
        this.generateReports(filteredMap);
    }

    /**
     * Ensures the Playwright coverage directory contains at least one JSON report,
     * and that the Jest coverage file exists. Exits with code 1 if either is missing.
     */
    private validateInputs(): void {
        const pwFiles = this.getPlaywrightReportFiles();
        if (pwFiles.length === 0) {
            console.error('Playwright test report not found! Merge aborted.');
            process.exit(1);
        }
        if (!existsSync(this.jestReport)) {
            console.error('Jest test report not found! Merge aborted.');
            process.exit(1);
        }
    }

    /**
     * Returns all JSON coverage files in the Playwright output directory.
     * Supports both a single local report and multiple CI pipeline artifacts.
     *
     * @returns {string[]} Absolute paths to each Playwright coverage JSON file.
     */
    private getPlaywrightReportFiles(): string[] {
        if (!existsSync(this.playwrightDir)) return [];
        return readdirSync(this.playwrightDir)
            .filter(f => f.endsWith('.json'))
            .map(f => join(this.playwrightDir, f));
    }

    /**
     * Reads and merges all Playwright and Jest coverage JSON files into a single map.
     * Playwright may have multiple files when merging artifacts from parallel CI pipelines.
     *
     * @returns {CoverageMap} The merged coverage map.
     */
    private mergeReports(): CoverageMap {
        const map: CoverageMap = createCoverageMap({});
        for (const file of this.getPlaywrightReportFiles()) {
            map.merge(JSON.parse(readFileSync(file, 'utf-8')));
        }
        map.merge(JSON.parse(readFileSync(this.jestReport, 'utf-8')));
        return map;
    }

    /**
     * Filters the merged coverage map using include/exclude patterns from `coverageConfig`.
     *
     * Exclude patterns prefixed with `!` are negation overrides — they force-include files
     * that would otherwise be matched by a regular exclude pattern.
     *
     * @param {CoverageMap} map - The merged coverage map to filter.
     * @returns {CoverageMap} A new coverage map containing only the files that passed the filters.
     */
    private applyFilters(map: CoverageMap): CoverageMap {
        const includePatterns = this.coverageConfig.include || [];
        const excludePatterns = (this.coverageConfig.exclude || []).filter(p => !p.startsWith('!'));
        const negationPatterns = (this.coverageConfig.exclude || [])
            .filter(p => p.startsWith('!'))
            .map(p => p.slice(1));

        const filteredMap: CoverageMap = createCoverageMap({});
        for (const file of map.files()) {
            const fileCoverage = map.fileCoverageFor(file);
            // Compute a cwd-relative path for micromatch filtering.
            // For local runs, fileCoverage.path is absolute and relative() works correctly.
            // For CI artifacts, CODEBUILD_SRC_DIR is stripped by sed leaving paths like
            // /src/modules/foo.js — relative() then produces upward traversals (../../src/...)
            // which don't match include patterns. In that case, strip the leading slash instead.
            const rel = relative(process.cwd(), fileCoverage.path).replace(/\\/g, '/');
            const relativePath = rel.startsWith('../') ? fileCoverage.path.replace(/^\//, '') : rel;

            if (includePatterns.length > 0 && !isMatch(relativePath, includePatterns)) continue;

            if (excludePatterns.length > 0) {
                const isExcluded = isMatch(relativePath, excludePatterns);
                const isNegated = negationPatterns.length > 0 && isMatch(relativePath, negationPatterns);
                if (isExcluded && !isNegated) continue;
            }

            filteredMap.addFileCoverage(fileCoverage);
        }
        return filteredMap;
    }

    /**
     * Generates coverage reports for the filtered map using the reporters defined in
     * `coverageConfig.reporter`. Defaults to `['html', 'text-summary', 'json']`.
     *
     * @param {CoverageMap} map - The filtered coverage map to report on.
     */
    private generateReports(map: CoverageMap): void {
        const reporters = this.coverageConfig.reporter || ['html', 'text-summary', 'json'];
        const context = createContext({
            dir: this.coverageDir,
            coverageMap: map,
        });
        for (const reporter of reporters) {
            createReporter(reporter as Parameters<typeof createReporter>[0]).execute(context);
        }
    }
}

new CoverageMerger().run();
