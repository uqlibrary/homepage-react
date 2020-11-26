export function isAString(text) {
    expect(typeof text).toEqual('string');
    expect(text.length).not.toBe(0);
}

export function isAValidLink(link) {
    isAString(link);
    expect(link.startsWith('http:') || link.startsWith('https:') || link.startsWith('tel:')).toBe(true);
}

const isAWholeNumber = value => value - Math.floor(value) === 0;

export function isPositiveInteger(value) {
    expect(typeof value).toEqual('number');
    expect(isAWholeNumber(value)).toBe(true);
    expect(value > 0).toBe(true);
}

export function checkLocaleBlock(item) {
    item.type !== 'text' || isAString(item.text);

    item.type !== 'link' || isAString(item.dataTestid);
    item.type !== 'link' || isAString(item.linkLabel);
    item.type !== 'link' || isAString(item.linkTo);
    item.type !== 'link' || isAValidLink(item.linkTo);
    item.type !== 'link' ||
        !item.target ||
        expect(item.target).toEqual('_blank') ||
        expect(item.target).toEqual('_parent') ||
        expect(item.target).toEqual('_top');

    item.type !== 'abbr' || isAString(item.abbrDisplay);
    item.type !== 'abbr' || isAString(item.abbrMouseoverText);

    item.type !== 'header' || isAString(item.text);
}
