/* eslint-disable */
/*
  This file is a copy of the component at https://design-system.uq.edu.au/?path=/story/components-footer--footer
  at the last point when we updated the footer
  By comparing this file with the design system one, we can determine if we need to update our component to meet UQ standards
  To determine if our footer needs any change:
  - visit the sbove design system url (or find the new url)
  - copy the markup from the page (you may need to format - phpstorm offers Menu option Code -> Format code)
  - compare to this file (phpstorm offers a Compare To Clipboard function)
  - update MinimalFooter with any differences (ie content - implementation is different, eg we don't do GA via onclick)
  - update this file with the latest (for next time)
 */
<footer className="uq-footer" data-gtm-category="Footer">
    <div className="uq-footer__container">
        <div className="uq-footer__acknowledgement"> UQ acknowledges the Traditional Owners and their custodianship of
            the
            lands on which UQ is situated. — <a href="https://about.uq.edu.au/reconciliation"
                                                className="uq-footer__acknowledgement__link">Reconciliation
                statement</a>
        </div>
        <div className="uq-footer__row">
            <div className="uq-footer__column">
                <div className="uq-footer__copyright">© The University of Queensland</div>
                <div className="uq-footer__contact"> Enquiries: <a href="tel:+61733651111"
                                                                   className="uq-footer__link footer__enquiries-phone"
                                                                   onClick="gtag(&quot;event&quot;,&quot;click&quot;,{event_category:&quot;UQ Footer&quot;,event_label:&quot;Enquiries phone&quot;})"><span
                    itemProp="telephone">+61 7 3365 1111</span></a> &nbsp; | &nbsp; <a
                    href="https://uq.edu.au/contacts" className="uq-footer__link footer__contacts-link"
                    onClick="gtag(&quot;event&quot;,&quot;click&quot;,{event_category:&quot;UQ Footer&quot;,event_label:&quot;Contact directory&quot;})">Contact
                    directory</a></div>
                <div className="uq-footer__meta"><abbr title="Australian Business Number">ABN</abbr>: 63 942 912
                    684 &nbsp;
                    | &nbsp; <abbr
                        title="Commonwealth Register of Institutions and Courses for Overseas Students">CRICOS</abbr>
                    Provider No: <a className="uq-footer__link cricos__link"
                                    href="https://www.uq.edu.au/about/cricos-link"
                                    rel="external"
                                    onClick="gtag(&quot;event&quot;,&quot;click&quot;,{event_category:&quot;UQ Footer&quot;,event_label:&quot;CRICOS&quot;})">00025B</a>
                </div>
            </div>
            <div className="uq-footer__column">
                <div className="uq-footer__emergency-contact uq-footer__aside"><strong
                    className="uq-footer__sub-title">Emergency</strong><br />
                    Phone: <a href="tel:+61733653333" className="uq-footer__link footer__emergency-phone"
                              onClick="gtag(&quot;event&quot;,&quot;click&quot;,{event_category:&quot;UQ Footer&quot;,event_label:&quot;Emergency phone&quot;})">3365
                    3333</a>
                </div>
            </div>
        </div>
        <div className="uq-footer__footer">
            <div className="uq-footer__row">
                <div className="uq-footer__column">
                    <div className="uq-footer__footer-menu">
                        <ul className="uq-footer__footer-menu__list">
                            <li className="uq-footer__footer-menu__item"><a href="https://www.uq.edu.au/terms-of-use/"
                                                                            rel="external"
                                                                            className="uq-footer__footer-menu__link"
                                                                            onClick="gtag(&quot;event&quot;,&quot;click&quot;,{event_category:&quot;UQ Footer&quot;,event_label:&quot;Privacy&quot;})">Privacy
                                &amp; Terms of use</a></li>
                            <li className="uq-footer__footer-menu__item"><a href="https://www.uq.edu.au/rti/"
                                                                            rel="external"
                                                                            className="uq-footer__footer-menu__link"
                                                                            onClick="gtag(&quot;event&quot;,&quot;click&quot;,{event_category:&quot;UQ Footer&quot;,event_label:&quot;Right to Information&quot;})">Right
                                to Information</a></li>
                            <li className="uq-footer__footer-menu__item"><a href="https://uq.edu.au/accessibility/"
                                                                            rel="external"
                                                                            className="uq-footer__footer-menu__link"
                                                                            onClick="gtag(&quot;event&quot;,&quot;click&quot;,{event_category:&quot;UQ Footer&quot;,event_label:&quot;Accessibility&quot;})">Accessibility</a>
                            </li>
                            <li className="uq-footer__footer-menu__item"><a
                                href="https://its.uq.edu.au/feedback?r=https://uq.edu.au" rel="external"
                                className="uq-footer__footer-menu__link"
                                onClick="gtag(&quot;event&quot;,&quot;click&quot;,{event_category:&quot;UQ Footer&quot;,event_label:&quot;Feedback&quot;})">Feedback</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
