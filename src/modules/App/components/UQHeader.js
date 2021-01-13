import React, { useState } from 'react';

export const UQHeader = ({}) => {
    const [searchPanelShown, setSearchPanelShown] = useState(false);
    const toggle = document.querySelector('.search-toggle__button');
    const search = document.querySelector('.nav-search');
    const searchInput = document.querySelector('.search-query__input');
    let meta = document.querySelector('meta.uq-header__mq--desktop');

    if (meta === null) {
        meta = document.createElement('meta');
        meta.classList.add('uq-header__mq--desktop');
        document.head.appendChild(meta);
    }

    const mqLarge = window
        .getComputedStyle(meta)
        .getPropertyValue('font-family')
        .trim()
        .slice(1, -1); // browsers re-quote string style values
    const mqLargeList = window.matchMedia(mqLarge);

    function controlSiteSearchTabInclusion(tabIndexValue) {
        document.getElementById('edit-as_sitesearch-off').tabIndex = tabIndexValue;
        document.getElementById('edit-as_sitesearch-on').tabIndex = tabIndexValue;
        document.getElementById('edit-q').tabIndex = tabIndexValue;
        document.getElementById('uq-search').tabIndex = tabIndexValue;
    }

    const handleToggle = () => {
        toggle.classList.toggle('search-toggle__button--icon-close');
        search.classList.toggle('nav-search--open');
        setSearchPanelShown(!searchPanelShown);

        if (search.classList.contains('nav-search--open')) {
            if (mqLargeList.matches) {
                controlSiteSearchTabInclusion(0);
                searchInput.focus();
            } else {
                controlSiteSearchTabInclusion(-1);
                toggle.blur();
            }
        } else {
            controlSiteSearchTabInclusion(-1);
            toggle.blur();
        }
    };

    const skipNav = () => {
        const afterNavigation = document.getElementById('primo-search-autocomplete');
        !!afterNavigation && afterNavigation.focus();
        return false;
    };

    const skipnavKeyHander = e => {
        if (e && e.keyCode === 13) {
            skipNav();
        }
    };

    return (
        <header className="uq-header" id="uqheader">
            <div className="uq-header__container">
                <div className="nav-global">
                    <a
                        id="skipNavigation"
                        aria-label="skip navigation"
                        title="Skip navigation"
                        onClick={() => skipNav()}
                        onKeyDown={() => skipnavKeyHander()}
                        href="#"
                    >
                        Skip navigation
                    </a>
                    <div className="logo">
                        <a className="logo--large" href="https://www.uq.edu.au/">
                            <img
                                alt="The University of Queensland"
                                src="https://static.uq.net.au/v11/logos/corporate/uq-lockup-landscape--reversed.svg"
                            />
                        </a>
                        <a className="logo--small" href="https://www.uq.edu.au/">
                            <img
                                alt="The University of Queensland"
                                src="https://static.uq.net.au/v11/logos/corporate/uq-logo--reversed.svg"
                            />
                        </a>
                    </div>
                    <nav className="menu-global">
                        <ul>
                            <li>
                                <a href="https://contacts.uq.edu.au/">Contacts</a>
                            </li>
                            <li>
                                <a href="https://future-students.uq.edu.au/">Study</a>
                            </li>
                            <li>
                                <a href="https://maps.uq.edu.au/">Maps</a>
                            </li>
                            <li>
                                <a href="https://www.uq.edu.au/news/">News</a>
                            </li>
                            <li>
                                <a href="https://www.uq.edu.au/events/">Events</a>
                            </li>
                            <li>
                                <a href="https://jobs.uq.edu.au/">Jobs</a>
                            </li>
                            <li>
                                <a href="https://giving.uq.edu.au/">Give now</a>
                            </li>
                            <li>
                                <a href="https://my.uq.edu.au/">my.UQ</a>
                            </li>
                            <li className="menu-global__search-toggle">
                                <button className="search-toggle__button" onClick={handleToggle}>
                                    Search
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="nav-search" aria-hidden={!searchPanelShown}>
                    <form
                        className="nav-search__form"
                        action="https://www.uq.edu.au/search/"
                        method="get"
                        acceptCharset="UTF-8"
                    >
                        <fieldset className="nav-search__wrapper">
                            <legend className="hidden">
                                <span className="nav-search__title">What are you looking for?</span>
                            </legend>
                            <span className="nav-search__title">What are you looking for?</span>
                            <div className="nav-search__scope">
                                <div className="nav-search__scope__radio-wrapper">
                                    <div className="form-item">
                                        <input
                                            type="radio"
                                            id="edit-as_sitesearch-off"
                                            name="as_sitesearch"
                                            value=""
                                            className="form-radio"
                                            tabIndex="-1"
                                        />
                                        <label htmlFor="edit-as_sitesearch-off" className="option">
                                            Search all UQ websites
                                        </label>
                                    </div>
                                    <div className="form-item">
                                        <input
                                            type="radio"
                                            id="edit-as_sitesearch-on"
                                            name="as_sitesearch"
                                            value="https://library.uq.edu.au"
                                            defaultChecked
                                            className="form-radio"
                                            tabIndex="-1"
                                        />
                                        <label htmlFor="edit-as_sitesearch-on" className="option">
                                            Search this website (library.uq.edu.au)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <div className="nav-search__query">
                            <span className="search-query__wrapper">
                                <label htmlFor="edit-q" className="visually-hidden">
                                    Search term
                                </label>
                                <input
                                    type="text"
                                    id="edit-q"
                                    tabIndex="-1"
                                    name="q"
                                    size="60"
                                    maxLength="128"
                                    className="search-query__input"
                                />
                                <span className="search-query__button">
                                    <input
                                        id="uq-search"
                                        tabIndex="-1"
                                        type="submit"
                                        name="op"
                                        value="Search"
                                        className="search-query__submit"
                                    />
                                </span>
                            </span>
                        </div>
                    </form>
                    <nav className="menu-global">
                        <ul>
                            <li>
                                <a href="https://contacts.uq.edu.au/">Contacts</a>
                            </li>
                            <li>
                                <a href="https://www.uq.edu.au/news/">News</a>
                            </li>
                            <li>
                                <a href="https://www.library.uq.edu.au/">Library</a>
                            </li>
                            <li>
                                <a href="https://future-students.uq.edu.au/">Study</a>
                            </li>
                            <li>
                                <a href="https://www.uq.edu.au/events/">Events</a>
                            </li>
                            <li>
                                <a href="https://giving.uq.edu.au/">Give now</a>
                            </li>
                            <li>
                                <a href="https://maps.uq.edu.au/">Maps</a>
                            </li>
                            <li>
                                <a href="https://jobs.uq.edu.au/">Jobs</a>
                            </li>
                            <li>
                                <a href="https://my.uq.edu.au/">my.UQ</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default UQHeader;
