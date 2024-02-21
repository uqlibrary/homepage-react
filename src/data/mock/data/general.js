export const printBalance = {
    'balance': '12.50',
    'cardNumber': '36122190182095876',
    'email': 'k.lane@uq.edu.au',
    'retrievedAt': '2020-11-25T11:50:15+00:00',
};

export const loans = {
    'recordNumber': 'vanilla',
    'fines': [{
        'title': 'CRITICAL SOCIOLINGUISTIC RESEARCH METHODS',
        'fineAmount': 48.93,
        'fineType': 'Damaged item fine',
        'dateAssessed': '2020-01-22T22:03:20.161Z',
        'dueDate': null,
        'dateReturned': null,
        'description': 'Replacement copy of damaged doc del item purchased by doc del in lieu of $250 invoice. CLient offered to pay costs. CRITICAL SOCIOLINGUISTIC RESEARCH METHODS . PAC-10109249',
    }],
    'holds': [],
    'checkedOut': [{
        'title': 'CRITICAL SOCIOLINGUISTIC RESEARCH METHODS',
        'dueDate': '2019-10-18T07:00:00+00:00',
        'callNumber': null,
        'barcodes': '34067034864222',
        'itemStatus': 'LOST',
    }],
    'total_holds_count': 2,
    'total_loans_count': 1,
    'total_fines_count': 1,
    'total_fines_sum': 48.93,
    'retrievedAt': '2020-11-26T01:48:32+00:00',
};

// 'took' is the number of seconds the response took
export const espaceSearchResponse = {
    'total': 18, 'took': 104, 'per_page': 20, 'current_page': 1, 'from': 1, 'to': 18
};

export const spotlights = [{
    'id': '9eab3aa0-82c1-11eb-8896-eb36601837f5',
    'start': '2021-03-15 00:02:00',
    'end': '2099-03-21 23:59:00',
    'title': 'Can be deleted and edited',
    'url': 'http://localhost:2020/learning-resources?user=uqstaff&coursecode=FREN1010&campus=St%20Lucia&semester=Semester%202%202020',
    'img_url': 'http://localhost:2020/images/spotlights/52d3e090-d096-11ea-916e-092f3af3e8ac.jpg',
    'img_alt':
        'Academic Integrity Modules - Everything you need to know about academic integrity at UQ',
    'weight': 10,
    'active': 1,
    'admin_notes': 'sample admin note',
}, {
    'id': '1e7a5980-d7d6-11eb-a4f2-fd60c7694898',
    'start': '2021-06-29 01:00:00',
    'end': '2031-07-30 06:00:00',
    'title': 'Have you got your mask? COVID-19',
    'url': 'https:\/\/about.uq.edu.au\/coronavirus',
    'img_url': 'http:\/\/localhost:2020\/images\/spotlights\/babcccc0-e0e4-11ea-b159-6dfe174e1a21.jpg',
    'img_alt': 'Have you got your mask? Please continue to maintain physically distancing.',
    'weight': 20,
    'active': 1,
    'admin_notes': '',
}, {
    'id': '38cbf430-8693-11e9-98ab-9d52a58e86ca',
    'start': '2021-07-19 00:01:00',
    'end': '2031-08-01 23:59:00',
    'title': 'Follow us social media 3',
    'url': 'https:\/\/www.facebook.com\/uniofqldlibrary\/',
    'img_url': 'http:\/\/localhost:2020\/images\/spotlights\/f9ff71b0-d77e-11ea-8881-93befcabdbc2.jpg',
    'img_alt': 'Follow us social media 3',
    'weight': 30,
    'active': 1,
    'admin_notes': '',
}];
