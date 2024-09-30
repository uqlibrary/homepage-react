export function getMapLabel(location) {
    const definitArticle = `${location.needsDefiniteArticle ? ' the' : ''}`;
    return `View a map showing the location of exams at${definitArticle} ${location.label}`;
}
