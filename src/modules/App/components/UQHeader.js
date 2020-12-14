import React from 'react';

export const UQHeader = ({}) => {
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

    const handleToggle = () => {
        toggle.classList.toggle('search-toggle__button--icon-close');
        search.classList.toggle('nav-search--open');

        if (search.classList.contains('nav-search--open')) {
            if (mqLargeList.matches) {
                searchInput.focus();
            } else {
                toggle.blur();
            }
        } else {
            toggle.blur();
        }
    };

    return (
        <header className="uq-header">
            <div className="uq-header__container">
                <div className="nav-global">
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
                                <a href="https://www.uq.edu.au/contacts/">Contacts</a>
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
                                <a href="https://www.library.uq.edu.au/">Library</a>
                            </li>
                            <li>
                                <a href="https://giving.uq.edu.au/">Give now</a>
                            </li>
                            <li>
                                <a href="https://my.uq.edu.au/">my.UQ</a>
                            </li>
                            <li className="menu-global__search-toggle">
                                <button className="search-toggle__button" onClick={handleToggle}>
                                    Toggle search
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="nav-search">
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
                                            defaultChecked
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
                                            className="form-radio"
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
                                    name="q"
                                    size="60"
                                    maxLength="128"
                                    className="search-query__input"
                                />
                                <span className="search-query__button">
                                    <input
                                        type="submit"
                                        name="Search"
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
                                <a href="https://www.uq.edu.au/contacts/">Contacts</a>
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
