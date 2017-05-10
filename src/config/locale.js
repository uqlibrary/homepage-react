import React from 'react';

export default {
    global: {
        title: 'UQ eSpace',
        logo: 'https://static.uq.net.au/v1/logos/corporate/uq-logo-white.svg',
        labels: {
            buttons: {
                saveForLater: 'Save for later',
                cancel: 'Cancel',
                submitForApproval: 'Submit for approval'
            }
        }
    },
    authentication: {
        signInText: 'Log in',
        signOutText: 'Log out'
    },
    menu: {
        myDashboard: {
            primaryText: 'My dashboard'
        },
        myResearch: {
            primaryText: 'My research'
        },
        addMissingRecord: {
            primaryText: 'Add missing record'
        },
        claimPublication: {
            primaryText: 'Clalim publications'
        },
        manageUsers: {
            primaryText: 'Manage users'
        },
        manageGroups: {
            primaryText: 'Manage groups'
        },
        manageAuthors: {
            primaryText: 'Manage authors'
        },
        browse: {
            primaryText: 'Browse',
            secondaryText: 'UQ\'s digital repository'
        },
        search: {
            primaryText: 'Search'
        },
        faqs: {
            primaryText: 'FAQs'
        },
        about: {
            primaryText: 'About',
        },
    },
    pages: {
        about: {
            title: 'About UQ eSpace',
            text: (
                <div>
                    <h3>Information</h3>
                    <p>UQ eSpace is the single authoritative source for the research outputs and research data of the staff and students of the University of Queensland and is the archival home of UQ Research Higher Degree digital theses. UQ eSpace raises the visibility and accessibility of UQ publications to the wider world and provides data for mandatory Government reporting requirements such as Excellence in Research for Australia (ERA), as well as for internal UQ systems, including Academic Portal and the DataHub. It operates as an institutional repository for open access publications, research datasets and other digitised materials created by staff of the University such as print materials, photographs, audio materials, videos, manuscripts and other original works. UQ eSpace provides metadata to UQ Researchers in order to raise the publication profile of researchers at UQ.</p>
                    <p>The University of Queensland has implemented an Open Access for UQ Research Outputs policy that requires UQ researchers to make publications arising from their research openly available via UQ eSpace. It has also implemented a Research Data Management policy that sets out the requirements for University of Queensland researchers to ensure that their research data are managed according to legal, statutory, ethical and funding body requirements.</p>
                    <h3>General Enquiries</h3>
                    <p>
                        Tel: 07 334 69775 <br/>
                        Email: espace@library.uq.edu.au <br/>
                    </p>
                    <h3>Staff contact</h3>
                    <p>
                        Andrew Heath <br/>
                        Manager, UQ eSpace<br/>
                        Tel: 07 334 69981<br/>
                        Email: a.heath@library.uq.edu.au<br/>
                    </p>
                    <p>
                        Mary-Anne Marrington<br/>
                        Senior Librarian, UQ eSpace<br/>
                        Tel: 07 334 69775<br/>
                        Email: m.marrington@library.uq.edu.au<br/>
                    </p>
                </div>
            ),
            help: {
                title: 'Search help',
                text: (
                    <div>
                        <h3>Simple search</h3>
                        <p>
                            Searching all fields is the default when using the front page or upper right search field.
                        </p>
                        <h3>Advanced search</h3>
                        <p>
                            Select SEARCH in the navigation bar above for advanced search options. (Link)
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        },
        browse: {
            title: 'Browse eSpace',
            text: ( <div>
                        <p>
                            <a href="https://auth.library.uq.edu.au/login">Temporary login link...</a>
                        </p>
                    </div>
                    ),
            help: {
                title: 'Search help',
                text: (
                    <div>
                        <h3>Simple search</h3>
                        <p>
                            Searching all fields is the default when using the front page or upper right search field.
                        </p>
                        <h3>Advanced search</h3>
                        <p>
                            Select SEARCH in the navigation bar above for advanced search options. (Link)
                        </p>
                    </div>
                ),
                button: 'OK'
            }
        },
        addRecord: {
            title: 'Add missing record',
            stepper: {
                step1Label: 'Search for your publication',
                step2Label: 'Search results',
                step3Label: 'Add your publication',
                defaultErrorMessage: 'Error'
            },
            searchForPublication: {
                title: 'Search for your publication',
                explanationText: 'Enter either the publication Doi (e.g. 10.1163/9789004326828), Pubmed Id (e.g. 28131963) or the title of the publication. This will allow us to check whether the record is already in eSpace or is available from another source.',
                defaultSearchFieldLabel: 'Enter Doi, Pubmed Id or Title',
                defaultButtonLabel: 'Enter Doi, Pubmed Id or Title',
                help: {
                    title: 'Search for your publication',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                defaultProps: {
                    defaultSearchFieldLabel: 'Search for publication',
                    defaultButtonLabel: 'Search'
                },
                buttonLabelVariants: {
                    doi: 'Doi Search',
                    pubmed: 'Pubmed Id Search',
                    title: 'Title Search',
                    default: 'Search'
                }
            },
            inlineLoader: {
                message: 'Loading ...'
            },
            searchResults: {
                title: 'Possible matches found',
                explanationText: 'Top [noOfResults] matches displayed below. To refine your search and narrow down results, please click the "search again" button below - or create a new record.',
                claimRecordBtnLabel: 'Claim This Record',
                help: {
                    title: 'Possible matches found',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                }
            },
            noMatchingRecords: {
                title: 'No matching records?',
                explanationText: 'Refine your search and narrow down results, or create a new eSpace record for your publication.',
                searchAgainBtnLabel: 'Search again',
                addPublicationBtnLabel: 'Add a new publication',
                help: {
                    title: 'No matchings records?',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                defaultProps: {
                    searchAgainBtnLabel: 'Search again?',
                    addPublicationBtnLabel: 'Add new publication'
                }
            },
            publicationTypeForm: {
                popularTypesList: ['Book', 'Book Chapter', 'Conference Paper', 'Journal Article'],
                title: 'Add your publication',
                maxSearchResults: 10,
                publicationTypeLabel: 'Select a publication type',
                help: {
                    title: 'Add your publication',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                },
                documentTypes: {
                    JOURNAL_ARTICLE: 'journal article'
                }
            },
            addJournalArticle: {
                journalArticleInformation: {
                    title: 'Journal article information',
                    help: {
                        title: 'Journal article information',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                    },
                    fields: {
                        titleLabel: 'Journal title',
                        nameLabel: 'Journal name',
                        publishDateLabel: 'Journal publish date',
                        publicationTypeLabel: 'Select a publication type'
                    }
                },
                authors: {
                    title: 'Authors',
                    help: {
                        title: 'Authors',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                    },
                    fields: {
                        dropdownLabel: 'Add an author (Name as published)'
                    }
                },
                optionalDetails: {
                    title: 'Optional publication detail',
                    help: {
                        title: 'Optional publication detail',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                    },
                    fields: {
                        volumeLabel: 'Volume',
                        issueLabel: 'Issue',
                        startPageLabel: 'Start page',
                        endPageLabel: 'End page',
                        notesLabel: 'Not (not publically viewable)'
                    }
                },
                files: {
                    title: 'Files',
                    help: {
                        title: 'Files',
                        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean aliquet ac risus et blandit. Vivamus varius ornare metus vitae sagittis. Donec erat urna, interdum vitae faucibus a, tempus eu orci. Aenean venenatis lacus eu sapien dignissim, non rhoncus dolor facilisis. Donec finibus tristique nunc nec facilisis. Pellentesque luctus libero faucibus ex mattis, vitae commodo nunc vehicula. Nam nec porttitor sapien. Sed rutrum, mauris id luctus eleifend, eros lectus auctor nibh, a eleifend est est eu nunc.'
                    },
                    fields: {
                        filenameLabel: 'Filename selected',
                        filenameRestrictions: (
                            <div className="fileInstructions">
                                <h3>File name restrictions</h3>
                                <div style={{width: '100%'}}>
                                    <ul>
                                        <li>Only upper or lowercase alphanumeric characters or underscores (a0z, A-Z, _ and 0-9 only)</li>
                                        <li>Only numbers and lowercase characters in the file extension</li>
                                        <li>Under 45 characters</li>
                                        <li>Only one file extension (on period (.) character) and</li>
                                        <li>Starting with a letter. Eg "s12345678_phd_thesis.pdf"</li>
                                    </ul>
                                </div>
                            </div>
                        ),
                        accessConditionsLabel: 'Access conditions',
                        embargoDateLabel: 'Embargo date',
                        descriptionLabel: 'Description'
                    },
                    buttons: {
                        browseLabel: 'Browse files'
                    }
                }
            }
        },
        claimPublications: {
            title: 'Claim a publication',
            publicationDetails: {
                title: 'You are claiming to be an author for the following item',
                text: ( <div>
                        <p>
                            possibly your publications....
                        </p>
                    </div>
                ),
                help: {
                    title: 'Help',
                    text: (
                        <div>
                            <p>
                                Help on possibly your publications...
                            </p>
                        </div>
                    ),
                    button: 'OK'
                },
            },
            comments: {
                title: 'If necessary, please suggest changes or upload additional files below',
                fields: {
                    descriptionLabel: 'Type edits/changes/comments here'
                }
            },
            files: {
                title: 'Upload new files',
                fields: {
                    filenameLabel: 'Filename selected',
                    filenameRestrictions: (
                        <div className="fileInstructions">
                            <h3>File name restrictions</h3>
                            <div style={{width: '100%'}}>
                                <ul>
                                    <li>Only upper or lowercase alphanumeric characters or underscores (a0z, A-Z, _ and 0-9 only)</li>
                                    <li>Only numbers and lowercase characters in the file extension</li>
                                    <li>Under 45 characters</li>
                                    <li>Only one file extension (on period (.) character) and</li>
                                    <li>Starting with a letter. Eg "s12345678_phd_thesis.pdf"</li>
                                </ul>
                            </div>
                        </div>
                    ),
                    accessConditionsLabel: 'Access conditions',
                    embargoDateLabel: 'Embargo date',
                    descriptionLabel: 'Description'
                },
                buttons: {
                    browseLabel: 'Browse files'
                }
            },
            formButtons: {
                cancelLabel: 'Cancel',
                claimLabel: 'Claim this publication'
            }
        },
    }
};


