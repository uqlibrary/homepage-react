import React from 'react';

// from https://github.com/uq-its-ss/design-system/blob/master/packages/storybook-html/src/components/footer/footer.html
export function MinimalFooter() {
    return (
        <footer className="uq-footer" data-gtm-category="Footer">
            <div className="layout-card uq-footer__container">
                <div className="uq-footer__acknowledgement">
                    UQ acknowledges the Traditional Owners and their custodianship of the lands on which UQ is situated.
                    —{' '}
                    <a href="https://about.uq.edu.au/reconciliation" className="uq-footer__acknowledgement__link">
                        Reconciliation statement
                    </a>
                </div>
                <div className="uq-footer__row">
                    <div className="uq-footer__column">
                        <div className="uq-footer__copyright">© The University of Queensland</div>
                        <div className="uq-footer__contact">
                            Enquiries:{' '}
                            <a href="tel:+61733651111" className="uq-footer__link footer__enquiries-phone">
                                <span itemProp="telephone">+61 7 3365 1111</span>
                            </a>{' '}
                            &nbsp; | &nbsp;{' '}
                            <a href="https://uq.edu.au/contacts" className="uq-footer__link footer__contacts-link">
                                Contact directory
                            </a>
                        </div>
                        <div className="uq-footer__meta">
                            <abbr title="Australian Business Number">ABN</abbr>: 63 942 912 684 &nbsp; | &nbsp;
                            <abbr title="Commonwealth Register of Institutions and Courses for Overseas Students">
                                CRICOS
                            </abbr>{' '}
                            Provider No:{' '}
                            <a
                                className="uq-footer__link cricos__link"
                                href="https://www.uq.edu.au/about/cricos-link"
                                rel="external"
                            >
                                00025B
                            </a>
                        </div>
                    </div>
                    <div className="uq-footer__column">
                        <div className="uq-footer__emergency-contact uq-footer__aside">
                            <strong className="uq-footer__sub-title">Emergency</strong>
                            <br /> Phone:{' '}
                            <a href="tel:+61733653333" className="uq-footer__link footer__emergency-phone">
                                3365 3333
                            </a>
                        </div>
                    </div>
                </div>
                <div className="uq-footer__footer">
                    <div className="uq-footer__row">
                        <div className="uq-footer__column">
                            <div className="uq-footer__footer-menu">
                                <ul className="uq-footer__footer-menu__list">
                                    <li className="uq-footer__footer-menu__item">
                                        <a
                                            href="https://www.uq.edu.au/terms-of-use/"
                                            rel="external"
                                            className="uq-footer__footer-menu__link"
                                        >
                                            Privacy &amp; Terms of use
                                        </a>
                                    </li>
                                    <li className="uq-footer__footer-menu__item">
                                        <a
                                            href="https://www.uq.edu.au/rti/"
                                            rel="external"
                                            className="uq-footer__footer-menu__link"
                                        >
                                            Right to Information
                                        </a>
                                    </li>
                                    <li className="uq-footer__footer-menu__item">
                                        <a
                                            href="https://uq.edu.au/accessibility/"
                                            rel="external"
                                            className="uq-footer__footer-menu__link"
                                        >
                                            Accessibility
                                        </a>
                                    </li>
                                    <li className="uq-footer__footer-menu__item">
                                        <a
                                            href="https://its.uq.edu.au/feedback?r=https://uq.edu.au"
                                            rel="external"
                                            className="uq-footer__footer-menu__link"
                                        >
                                            Feedback
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="uq-footer__column" />
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default MinimalFooter;
