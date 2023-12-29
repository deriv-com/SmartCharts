const dateRegex = new RegExp('\\d{17}');

export const strToDateTime = (date: any) => {
    if (!date || date.getFullYear) return date;
    var dateArray = [];
    var y, m, d, h, mn, sc, ms;
    if (date.length == 12 || date.length == 14) {
        y = parseFloat(date.substring(0, 4));
        m = parseFloat(date.substring(4, 6)) - 1;
        d = parseFloat(date.substring(6, 8));
        h = parseFloat(date.substring(8, 10));
        mn = parseFloat(date.substring(10, 12));
        sc = parseFloat(date.substring(12, 14)) || 0;
        return new Date(y, m, d, h, mn, sc, 0);
    } else if (dateRegex.test(date)) {
        y = parseFloat(date.substring(0, 4));
        m = parseFloat(date.substring(4, 6)) - 1;
        d = parseFloat(date.substring(6, 8));
        h = parseFloat(date.substring(8, 10));
        mn = parseFloat(date.substring(10, 12));
        sc = parseFloat(date.substring(12, 14));
        ms = parseFloat(date.substring(14, 17));
        return new Date(y, m, d, h, mn, sc, ms);
    }
    var dArray = [date];
    var t = date.indexOf('T');
    if (t != -1) {
        var afterT = date.substring(t);
        if (afterT.indexOf('Z') != -1 || afterT.indexOf('-') != -1 || afterT.indexOf('+') != -1) {
            return new Date(date);
        }
        dArray = date.split('T');
    } else if (date.indexOf(' ') != -1) dArray = date.split(' ');

    if (dArray[0].indexOf('/') != -1) dateArray = dArray[0].split('/');
    else if (dArray[0].indexOf('-') != -1) dateArray = dArray[0].split('-');
    else return strToDate(date);

    var year = parseFloat(dateArray[2]);
    if (dateArray[0] && dateArray[0].length == 4) {
        year = parseFloat(dateArray[0]);
        dateArray[0] = dateArray[1];
        dateArray[1] = dateArray[2];
    }

    if (dArray.length > 1) {
        var meridiem = dArray[2];
        dArray = dArray[1].split(':');
        if (meridiem) {
            if (dArray[0] == '12' && meridiem.toUpperCase() == 'AM') dArray[0] = 0;
            else if (dArray[0] != '12' && meridiem.toUpperCase() == 'PM') dArray[0] = parseInt(dArray[0], 10) + 12;
        }
        var sec: any = 0,
            msec = 0;
        if (dArray.length == 3) {
            if (dArray[2].indexOf('.') == -1) {
                sec = parseInt(dArray[2], 10);
            } else {
                sec = dArray[2].split('.');
                if (sec[1].length == 3) {
                    msec = sec[1];
                    sec = sec[0];
                }
            }
        }
        return new Date(year, dateArray[0] - 1, dateArray[1], dArray[0], dArray[1], sec, msec);
    }
    return new Date(year, dateArray[0] - 1, dateArray[1], 0, 0, 0, 0);
};

export const strToDate = (date: any) => {
    var dateArray;
    if (date.indexOf('/') != -1) dateArray = date.split('/');
    else if (date.indexOf('-') != -1) dateArray = date.split('-');
    else if (date.length >= 8) {
        return new Date(
            parseFloat(date.substring(0, 4)),
            parseFloat(date.substring(4, 6)) - 1,
            parseFloat(date.substring(6, 8))
        );
    } else {
        return new Date();
    }
    if (dateArray.length < 3) {
        return new Date();
    }
    if (dateArray[2].indexOf(' ') != -1) {
        dateArray[2] = dateArray[2].substring(0, dateArray[2].indexOf(' '));
    } else if (dateArray[2].indexOf('T') != -1) {
        dateArray[2] = dateArray[2].substring(0, dateArray[2].indexOf('T'));
    }
    var year = parseFloat(dateArray[2]);
    if (year < 20) year += 2000;
    if (dateArray[0].length == 4) {
        year = parseFloat(dateArray[0]);
        dateArray[0] = dateArray[1];
        dateArray[1] = dateArray[2];
    }
    return new Date(year, dateArray[0] - 1, dateArray[1]);
};
