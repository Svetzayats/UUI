import fs from 'node:fs';
import path from 'node:path';
import { Logger } from './logger';
import { PLATFORM } from '../constants';
import { getFailedTestNamesFromLastRun } from './failedTestsUtils';
import { readUuiSpecificEnvVariables } from '../../scripts/envParamUtils';
import * as console from 'console';
import { TEngine } from '../types';
import { screenshotSizeLimitKb } from '../../playwright.config';

const {
    isCi,
    UUI_TEST_PARAM_ONLY_FAILED,
    UUI_TEST_PARAM_CHECK_ISSUES,
    UUI_TEST_PARAM_CHECK_ISSUES_REMOVE_OBSOLETE_SCR,
} = readUuiSpecificEnvVariables();

type TIssues = { msg: string; exit: boolean }[];

export class TestBuilderContext {
    private seenTestNames: Set<string> = new Set();
    private onlyChromiumTests: Set<string> = new Set();
    private failedTestNames: Set<string>;

    constructor(private screenshotsDir: string) {
        this.failedTestNames = getFailedTestNamesFromLastRun();
    }

    shouldSkipTest(testName: string) {
        if (UUI_TEST_PARAM_ONLY_FAILED) {
            return !this.failedTestNames.has(testName);
        }
        return false;
    }

    isDryRun() {
        return !!UUI_TEST_PARAM_CHECK_ISSUES;
    }

    seen(testName: string, onlyChromium?: boolean) {
        if (this.seenTestNames.has(testName)) {
            throw new Error(`Duplicated test found: "${testName}"`);
        }
        this.seenTestNames.add(testName);
        if (onlyChromium) {
            this.onlyChromiumTests.add(testName);
        }
    }

    reportIssues() {
        const rootDir = path.resolve(this.screenshotsDir, PLATFORM);
        if (!UUI_TEST_PARAM_CHECK_ISSUES || !fs.existsSync(rootDir)) {
            return;
        }
        const engines = fs.readdirSync(rootDir);
        const obsoleteScr: string[] = [];
        const issuesArr: TIssues = [];
        engines.forEach((engineName) => {
            const enginePath = path.resolve(rootDir, engineName);
            fs.readdirSync(enginePath).forEach((fileName) => {
                const testName = path.basename(fileName, '.png');
                const scrFileFullPath = path.resolve(enginePath, fileName);
                const scrSize = fs.statSync(scrFileFullPath).size;
                const scrSizeKb = Math.floor(scrSize / 1024);

                if (scrSizeKb > screenshotSizeLimitKb) {
                    issuesArr.push({ exit: false, msg: `The size of "${fileName}" screenshot exceeds the limit: ${scrSizeKb}Kb > ${screenshotSizeLimitKb}Kb` });
                }

                const isObsoleteScr = !this.seenTestNames.has(testName) || (this.onlyChromiumTests.has(testName) && engineName !== TEngine.chromium);
                if (isObsoleteScr) {
                    if (UUI_TEST_PARAM_CHECK_ISSUES_REMOVE_OBSOLETE_SCR) {
                        fs.rmSync(scrFileFullPath);
                    }
                    obsoleteScr.push(scrFileFullPath);
                }
            });
        });
        const numOfEngines = 2;
        const numOfChromiumOnlyTests = this.onlyChromiumTests.size;
        const numOfAllEnginesTests = (this.seenTestNames.size - numOfChromiumOnlyTests);

        console.log(`Total number of tests: ${numOfAllEnginesTests * 2 + numOfChromiumOnlyTests} = ${numOfAllEnginesTests} * ${numOfEngines}(engines) + ${numOfChromiumOnlyTests}(only chromium)`);

        reportObsoleteScr(obsoleteScr, issuesArr, !!UUI_TEST_PARAM_CHECK_ISSUES_REMOVE_OBSOLETE_SCR);

        if (issuesArr.length) {
            let shouldExit = false;
            issuesArr.forEach(({ msg, exit }) => {
                Logger.warn(msg);
                shouldExit = shouldExit || exit;
            });
            if (shouldExit && isCi) {
                process.exit(1);
            }
        } else {
            Logger.info('No issues found');
        }
    }
}

function reportObsoleteScr(obsoleteScreenshots: string[], issuesArr: TIssues, isRemoved: boolean) {
    if (obsoleteScreenshots.length > 0) {
        const prefix = isRemoved ? 'Obsolete screenshots were deleted' : 'Obsolete screenshots found';
        const msg = `${prefix} (${obsoleteScreenshots.length}):\n\t${obsoleteScreenshots.join('\n\t')}`;
        issuesArr.push({ msg, exit: false });
    }
}
