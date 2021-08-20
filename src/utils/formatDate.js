export const formatDatePart = (datePart) =>
    datePart < 10 ? `0${datePart}` : datePart;

export const formatDate = (dateString) => {
    const date = new Date(dateString);

    return `${date.getFullYear()}-${formatDatePart(
        date.getMonth() + 1
    )}-${formatDatePart(date.getDate())}`;
};

export const formatHour = (dateString) => {
    const date = new Date(dateString);

    return `${formatDatePart(date.getHours())}:${formatDatePart(
        date.getMinutes()
    )}:${formatDatePart(date.getSeconds())}`;
};

export const formatFullDate = (dateString) =>
    `${formatDate(dateString)} ${formatHour(dateString)}`;
