export interface HighlightRange {
    from: number;
    to: number;
    isHighlighted: boolean;
}

const mergeHighlightRanges = (ranges: HighlightRange[]) => {
    const mergedRanges: HighlightRange[] = [];
    ranges.forEach((range) => {
        if (!mergedRanges.length) {
            mergedRanges.push({ ...range, isHighlighted: true });
        }

        const lastRange = mergedRanges[mergedRanges.length - 1];
        if (range.from >= lastRange.from && range.from <= lastRange.to + 1 && range.to > lastRange.to) {
            lastRange.to = range.to;
        }

        if (lastRange.to < range.from - 1) {
            mergedRanges.push({ ...range, isHighlighted: true });
        }
    });

    return mergedRanges;
};

const addNotHighlightedRanges = (ranges: HighlightRange[], str: string) => {
    const allRanges: HighlightRange[] = [];
    ranges.forEach((range, index) => {
        if (index === 0 && range.from !== 0) {
            allRanges.push({ from: 0, to: range.from, isHighlighted: false });
        }
        const prevRange = ranges[index - 1];
        if (prevRange && prevRange.to + 1 < range.from) {
            allRanges.push({ from: prevRange.to, to: range.from, isHighlighted: false });
        }

        allRanges.push(range);
        const lastIndex = ranges.length - 1;
        if (index === lastIndex && range.to < str.length) {
            allRanges.push({ from: range.to, to: str.length, isHighlighted: false });
        }
    });
    return allRanges;
};

export const getHighlightRanges = (search: string, str: string) => {
    const words = search
        .split(' ')
        .filter(Boolean)
        .map((word) => new RegExp(word, 'ig'));
    const matches = words.flatMap((word) => [...str.matchAll(word)]);

    const ranges = matches
        .map((match) => ({ from: match.index, to: match[0].length + match.index, isHighlighted: true }))
        .sort((range1, range2) => range1.from - range2.from);

    if (!ranges) {
        return [];
    }

    const mergedRanges = mergeHighlightRanges(ranges);
    return addNotHighlightedRanges(mergedRanges, str);
};
