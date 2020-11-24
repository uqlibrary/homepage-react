import global from 'locale/global';

export const leftJoin = (objArr1, objArr2, key1, key2) => {
    if (!objArr2) {
        return objArr1;
    }
    return objArr1.map(anObj1 => ({
        ...objArr2.find(anObj2 => anObj1[key1] === anObj2[key2]),
        ...anObj1,
    }));
};

export const stripHtml = html => {
    const temporalDivElement = document.createElement('div');
    temporalDivElement.innerHTML = html;
    return temporalDivElement.textContent || temporalDivElement.innerText || '';
};

export const getCampusByCode = code => {
    const campuses = global.campuses;
    if (campuses.hasOwnProperty(code)) {
        return campuses[code];
    }

    return null;
};

// there have been cases where someone has put a book on the corner of a keyboard,
// which sends thousands of requests to the server - block this
export const isRepeatingString = searchString => {
    if (searchString.length <= 3) {
        return false;
    }
    const lastChar = searchString.charAt(searchString.length - 1);
    const secondLastChar = searchString.charAt(searchString.length - 2);
    const thirdLastChar = searchString.charAt(searchString.length - 3);

    return lastChar === secondLastChar && lastChar === thirdLastChar;
};
