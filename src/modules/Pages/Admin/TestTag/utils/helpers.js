export const scrollToTopOfPage = () => {
    const topOfPage = document.getElementById('StandardPage');
    !!topOfPage && topOfPage.scrollIntoView();
};
