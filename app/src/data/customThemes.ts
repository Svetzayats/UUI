import { TPropEditorTypeOverride } from '@epam/uui-docs';
import { TTheme } from './themes';

const THEME_MANIFEST_FILE = 'theme-manifest.json';

export interface CustomThemeManifest {
    id: TTheme;
    name: string;
    css: string[];
    settings: null | object;
    propsOverride?: TPropEditorTypeOverride;
}

interface TUuiCustomThemesLsItem {
    customThemes: string[],
}

function getCustomThemesConfigFromLs() {
    const KEY_CUSTOM_THEMES = 'uui-custom-themes';
    const customThemes = localStorage.getItem(KEY_CUSTOM_THEMES);
    if (typeof customThemes === 'string') {
        try {
            return JSON.parse(customThemes) as TUuiCustomThemesLsItem;
        } catch (err) {
            console.error(`Unable to parse item from localStorage (key="${KEY_CUSTOM_THEMES}")`, err);
        }
    }
}

let cache: Promise<CustomThemeManifest[]>;
export async function loadCustomThemes(): Promise<CustomThemeManifest[]> {
    if (!cache) {
        cache = loadCustomThemesInternal();
    }
    return cache;
}
async function loadCustomThemesInternal() {
    const { customThemes = [] } = getCustomThemesConfigFromLs() || {};
    const ctManifestArr: CustomThemeManifest[] = [];
    if (customThemes.length > 0) {
        const ctManifestArrLoaded = await Promise.all(
            customThemes.map(async (themeUrl) => {
                const themeManifestUrl = `${themeUrl}/${THEME_MANIFEST_FILE}`;
                return fetch(themeManifestUrl)
                    .then<CustomThemeManifest>(async (r) => {
                    const tmJson: { css: string[]; settings: null | string, id: string, name: string, propsOverride?: TPropEditorTypeOverride } = await r.json();
                    const { id, name, css, settings, propsOverride } = tmJson;
                    const loadedSettings = settings ? await loadSettings(convertRelUrlToAbs(settings, themeUrl)) : null;
                    await loadCssArr(css.map((cssRel) => convertRelUrlToAbs(cssRel, themeUrl)));
                    return { id, name, css, settings: loadedSettings, propsOverride };
                })
                    .catch<undefined>((err) => {
                    console.error(`Unable to load custom theme from "${themeManifestUrl}"`, err);
                    return undefined;
                });
            }),
        );
        ctManifestArrLoaded.forEach((item: CustomThemeManifest | undefined) => {
            if (item) {
                ctManifestArr.push(item);
            }
        });
    }
    return ctManifestArr;
}

async function loadSettings(url: string) {
    try {
        const result = await fetch(url);
        return (await result.json()) as object;
    } catch (err) {
        console.error(`Unable to load settings from: "${url}"`, err);
    }
}

async function loadCssArr(urlArr: string[]): Promise<void> {
    await Promise.all(
        urlArr.map(async (url) => loadCss(url)),
    );
}
function loadCss(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        link.onload = () => {
            resolve();
        };
        link.onerror = (event) => {
            console.error(`Unable to load CSS from "${url}"`);
            reject(event);
            link.remove();
        };
        document.head.appendChild(link);
    });
}

function convertRelUrlToAbs(relativeUrl: string, themeManifestAbsUrl: string) {
    const DEL = '/';
    let urlRelativeToManifestNorm = relativeUrl;
    if (urlRelativeToManifestNorm.indexOf('./') === 0) {
        urlRelativeToManifestNorm = urlRelativeToManifestNorm.substring(2);
    }
    return `${themeManifestAbsUrl}${DEL}${urlRelativeToManifestNorm}`;
}
