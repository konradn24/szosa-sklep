function nameToUrl(name) {
    if(typeof name !== 'string') {
        return null;
    }

    return name.toLowerCase().trim().replaceAll(' ', '-');
}

function parseDate(sqlDate) {
    if(sqlDate instanceof Date && sqlDate.getTime()) {
        return sqlDate;
    }

    const date = sqlDate ? new Date(sqlDate) : sqlDate;

    if(date instanceof Date && !date.getTime()) {
        return null;
    }

    return date;
}

function countOccurence(arr, val) {
    return arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
}

module.exports = { nameToUrl, parseDate, countOccurence };