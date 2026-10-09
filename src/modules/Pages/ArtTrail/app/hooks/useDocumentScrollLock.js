import { useEffect } from 'react';

const useDocumentScrollLock = () => {
    useEffect(() => {
        const { documentElement, body } = document;
        const scrollY = window.scrollY;
        const previousHtmlOverflow = documentElement.style.overflow;
        const previousHtmlHeight = documentElement.style.height;
        const previousHtmlOverscrollBehavior = documentElement.style.overscrollBehavior;
        const previousBodyOverflow = body.style.overflow;
        const previousBodyHeight = body.style.height;
        const previousBodyPosition = body.style.position;
        const previousBodyTop = body.style.top;
        const previousBodyWidth = body.style.width;
        const previousBodyOverscrollBehavior = body.style.overscrollBehavior;

        documentElement.style.overflow = 'hidden';
        documentElement.style.height = '100%';
        documentElement.style.overscrollBehavior = 'none';
        body.style.overflow = 'hidden';
        body.style.height = '100%';
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overscrollBehavior = 'none';

        return () => {
            documentElement.style.overflow = previousHtmlOverflow;
            documentElement.style.height = previousHtmlHeight;
            documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior;
            body.style.overflow = previousBodyOverflow;
            body.style.height = previousBodyHeight;
            body.style.position = previousBodyPosition;
            body.style.top = previousBodyTop;
            body.style.width = previousBodyWidth;
            body.style.overscrollBehavior = previousBodyOverscrollBehavior;

            if (!/jsdom/i.test(window.navigator.userAgent)) {
                window.scrollTo(0, scrollY);
            }
        };
    }, []);
};

export default useDocumentScrollLock;
