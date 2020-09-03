import React from 'react';
import PublicIcon from '@material-ui/icons/Public';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import DescriptionIcon from '@material-ui/icons/Description';
import MovieIcon from '@material-ui/icons/Movie';
import InboxIcon from '@material-ui/icons/Inbox';
import StorageIcon from '@material-ui/icons/Storage';
import FindInPageIcon from '@material-ui/icons/FindInPage';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SchoolIcon from '@material-ui/icons/School';

export default {
    PrimoSearch: {
        typeSelect: {
            label: 'Search',
            items: [
                {
                    name: 'Library',
                    icon: <PublicIcon size="small" color="secondary" />,
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0&facet=rtype,exclude,newspaper_articles,lk&facet=rtype,exclude,reviews,lk',
                },
                {
                    name: 'Books',
                    icon: <ImportContactsIcon size="small" color="secondary" />,
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0&facet=rtype,include,books,lk',
                },
                {
                    name: 'Journal articles',
                    icon: <SchoolIcon size="small" color="secondary" />,
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&vid=61UQ&offset=0&fctV=articles&facet=rtype,include,articles,lk',
                },
                {
                    name: 'Video & audio',
                    icon: <MovieIcon size="small" color="secondary" />,
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&sortby=rank&vid=61UQ&offset=0&facet=rtype,include,media,lk',
                },
                {
                    name: 'Journals',
                    icon: <DescriptionIcon size="small" color="secondary" />,
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=title,contains,[keyword],AND&tab=61uq_all&vid=61UQ&search_scope=61UQ_All&sortby=rank&mfacet=rtype,include,journals,1,lk&mode=advanced&offset=0',
                },
                {
                    name: 'Physical items',
                    icon: <InboxIcon size="small" color="secondary" />,
                    link:
                        'https://search.library.uq.edu.au/primo-explore/search?query=any,contains,[keyword]&tab=61uq_all&search_scope=61UQ_All&vid=61UQ&offset=0&facet=tlevel,include,physical_items,lk',
                },
                {
                    name: 'Databases',
                    icon: <StorageIcon size="small" color="secondary" />,
                    link:
                        'https://search.library.uq.edu.au/primo-explore/dbsearch?query=any,contains,[keyword]&tab=jsearch_slot&vid=61UQ&offset=0&databases=any,[keyword]',
                },
                {
                    name: 'Past exam papers',
                    icon: <FindInPageIcon size="small" color="secondary" />,
                    link: 'https://www.library.uq.edu.au/exams/papers.php?stub=[keyword]',
                },
                {
                    name: 'Course reading lists',
                    icon: <ListAltIcon size="small" color="secondary" />,
                    link: 'https://uq.rl.talis.com/search.html?q=[keyword]',
                },
            ],
        },
        links: [
            {
                label: 'Search help',
                link: 'https://web.library.uq.edu.au/research-tools-techniques/uq-library-search',
            },
            {
                label: 'Advanced search',
                link: 'https://search.library.uq.edu.au/primo-explore/search?vid=61UQ&sortby=rank&mode=advanced',
            },
            {
                label: 'Database search',
                link: '#',
            },
            {
                label: 'Browse search',
                link: 'https://search.library.uq.edu.au/primo-explore/browse?vid=61UQ&sortby=rank',
            },
        ],
    },
};
