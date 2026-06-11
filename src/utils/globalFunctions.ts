export function getFormatedDate(date: Date) {
    const d = new Date(date);
    return d.toLocaleDateString();
}

