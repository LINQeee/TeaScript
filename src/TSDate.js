class TSDate {

    static formatDate = (date, value) => {
        value = formatYear(date, value);
        value = formatHour(date, value);
        value = formatDay(date, value);
        value = formatMinute(date, value);
        value = formatSecond(date, value);
        value = formatMonth(date, value);
        value = formatWeekDay(date, value);
        return value;
    }
}

const formatYear = (date, value) => {
    value = TS.uniqueReplaceAll(value, "yyyy", date.getFullYear(), true);
    value = TS.uniqueReplaceAll(value, "yy", date.toLocaleDateString("default", { year: "2-digit"}), true);
    return value;
}

const formatHour = (date, value) => {
    value = TS.uniqueReplaceAll(value, "hh12", date.toLocaleTimeString("default", {hour: "2-digit", hour12: true}).replace(" ", ""), true);
    value = TS.uniqueReplaceAll(value, "hh", convertTwoDigit(date.getHours()), true);
    value = TS.uniqueReplaceAll(value, "h12", date.toLocaleTimeString("default", {hour: "numeric", hour12: true}).replace(" ", ""), true);
    value = TS.uniqueReplaceAll(value, "h", date.getHours(), true);
    return value;
}

const formatMonth = (date, value) => {
    value = TS.uniqueReplaceAll(value, "MMMM", date.toLocaleDateString("default", {month: "long"}))
    value = TS.uniqueReplaceAll(value, "MMM", date.toLocaleDateString("default", {month: "short"}));
    value = TS.uniqueReplaceAll(value, "MM", convertTwoDigit(date.getMonth() + 1));
    value = TS.uniqueReplaceAll(value, "M", date.toLocaleDateString("default", {month: "numeric"}));
    return value;
}

const formatDay = (date, value) => {
    value = TS.uniqueReplaceAll(value, "dd", convertTwoDigit(date.getDate()), true);
    value = TS.uniqueReplaceAll(value, "d", date.getDate(), true);
    return value;
}

const formatWeekDay = (date, value) => {
    value = TS.uniqueReplaceAll(value, "wwww", date.toLocaleDateString("default", {weekday: "long"}), true);
    value = TS.uniqueReplaceAll(value, "www", date.toLocaleDateString("default", {weekday: "short"}), true);
    value = TS.uniqueReplaceAll(value, "ww", date.toLocaleDateString("default", {weekday: "narrow"}), true);
    value = TS.uniqueReplaceAll(value, "w", date.getDay(), true);
    return value;
}

const formatMinute = (date, value) => {
    value = TS.uniqueReplaceAll(value, "mm", convertTwoDigit(date.getMinutes()));
    value = TS.uniqueReplaceAll(value, "m", date.getMinutes());
    return value;
}

const formatSecond = (date, value) => {
    value = TS.uniqueReplaceAll(value, "ss", convertTwoDigit(date.getSeconds()), true);
    value = TS.uniqueReplaceAll(value, "s", date.getSeconds(), true);
    return value;
}

const convertTwoDigit = (value) => {
    if (+value < 10) value = "0" + value;
    return value;
}