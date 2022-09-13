// TODO: replace CIQ with custom functions
const CIQ = {
    yyyymmddhhmmssmmmrx: new RegExp('\\d{17}'),
    strToDateTime: function (dt: any): any {
        if (!dt || dt.getFullYear) return dt; //if passing in a JS date, return it.
        var myDateArray = [];
        var y, m, d, h, mn, sc, ms;
        if (dt.length == 12 || dt.length == 14) {
            // yyyymmddhhmm[ss]
            y = parseFloat(dt.substring(0, 4));
            m = parseFloat(dt.substring(4, 6)) - 1;
            d = parseFloat(dt.substring(6, 8));
            h = parseFloat(dt.substring(8, 10));
            mn = parseFloat(dt.substring(10, 12));
            sc = parseFloat(dt.substring(12, 14)) || 0;
            return new Date(y, m, d, h, mn, sc, 0);
        } else if (CIQ.yyyymmddhhmmssmmmrx.test(dt)) {
            y = parseFloat(dt.substring(0, 4));
            m = parseFloat(dt.substring(4, 6)) - 1;
            d = parseFloat(dt.substring(6, 8));
            h = parseFloat(dt.substring(8, 10));
            mn = parseFloat(dt.substring(10, 12));
            sc = parseFloat(dt.substring(12, 14));
            ms = parseFloat(dt.substring(14, 17));
            return new Date(y, m, d, h, mn, sc, ms);
        }
        var lr = [dt];
        var t = dt.indexOf('T');
        if (t != -1) {
            var afterT = dt.substring(t);
            if (afterT.indexOf('Z') != -1 || afterT.indexOf('-') != -1 || afterT.indexOf('+') != -1) {
                return new Date(dt); // utc time if it contains actual timezone information
            }
            lr = dt.split('T');
        } else if (dt.indexOf(' ') != -1) lr = dt.split(' ');

        if (lr[0].indexOf('/') != -1) myDateArray = lr[0].split('/');
        else if (lr[0].indexOf('-') != -1) myDateArray = lr[0].split('-');
        else return CIQ.strToDate(dt); //give up, maybe it's just a date

        var year = parseFloat(myDateArray[2]);
        if (myDateArray[0] && myDateArray[0].length == 4) {
            // YYYY-MM-DD
            year = parseFloat(myDateArray[0]);
            myDateArray[0] = myDateArray[1];
            myDateArray[1] = myDateArray[2];
        }

        if (lr.length > 1) {
            var ampm = lr[2];
            lr = lr[1].split(':');
            if (ampm) {
                if (lr[0] == '12' && ampm.toUpperCase() == 'AM') lr[0] = 0;
                else if (lr[0] != '12' && ampm.toUpperCase() == 'PM') lr[0] = parseInt(lr[0], 10) + 12;
            }
            var sec: any = 0,
                msec = 0;
            if (lr.length == 3) {
                if (lr[2].indexOf('.') == -1) {
                    sec = parseInt(lr[2], 10);
                } else {
                    sec = lr[2].split('.');
                    if (sec[1].length == 3) {
                        msec = sec[1];
                        sec = sec[0];
                    }
                }
            }
            return new Date(year, myDateArray[0] - 1, myDateArray[1], lr[0], lr[1], sec, msec);
        }
        return new Date(year, myDateArray[0] - 1, myDateArray[1], 0, 0, 0, 0);
    },
    strToDate: function (dt: any) {
        var myDateArray;
        if (dt.indexOf('/') != -1) myDateArray = dt.split('/');
        else if (dt.indexOf('-') != -1) myDateArray = dt.split('-');
        else if (dt.length >= 8) {
            return new Date(
                parseFloat(dt.substring(0, 4)),
                parseFloat(dt.substring(4, 6)) - 1,
                parseFloat(dt.substring(6, 8))
            );
        } else {
            return new Date();
        }
        if (myDateArray.length < 3) {
            // didn't find enough data for month, day and year.
            return new Date();
        }
        if (myDateArray[2].indexOf(' ') != -1) {
            myDateArray[2] = myDateArray[2].substring(0, myDateArray[2].indexOf(' '));
        } else if (myDateArray[2].indexOf('T') != -1) {
            myDateArray[2] = myDateArray[2].substring(0, myDateArray[2].indexOf('T'));
        }
        var year = parseFloat(myDateArray[2]);
        if (year < 20) year += 2000;
        if (myDateArray[0].length == 4) {
            // YYYY-MM-DD
            year = parseFloat(myDateArray[0]);
            myDateArray[0] = myDateArray[1];
            myDateArray[1] = myDateArray[2];
        }
        return new Date(year, myDateArray[0] - 1, myDateArray[1]);
    },
};

export { CIQ };
