/* eslint-disable */
import { api, sessionApi } from 'config';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import { SESSION_COOKIE_NAME } from 'config';
import * as routes from 'repositories/routes';
import * as mockData from './data';
import { spotlights } from './data/spotlights';
import fetchMock from 'fetch-mock';

import learningResources_FREN1010 from './data/records/learningResources_FREN1010';
import learningResources_HIST1201 from './data/records/learningResources_HIST1201';
import learningResources_PHIL1002 from './data/records/learningResources_PHIL1002';
import libraryGuides_FREN1010 from './data/records/libraryGuides_FREN1010';
import libraryGuides_HIST1201 from './data/records/libraryGuides_HIST1201';
import libraryGuides_PHIL1002 from './data/records/libraryGuides_PHIL1002';
import courseReadingList_6888AB68 from './data/records/courseReadingList_6888AB68-0681-FD77-A7D9-F7B3DEE7B29F';
import courseReadingList_2109F2EC from './data/records/courseReadingList_2109F2EC-AB0B-482F-4D30-1DD3531E46BE';
import learningResourceSearchSuggestions from './data/records/learningResourceSearchSuggestions';
import { libHours, computerAvailability } from './data/account';

const queryString = require('query-string');
const mock = new MockAdapter(api, { delayResponse: 200 });
const mockSessionApi = new MockAdapter(sessionApi, { delayResponse: 200 });
const escapeRegExp = input => input.replace('.\\*', '.*')
    .replace(/[\-\[\]\{\}\(\)\+\?\\\^\$\|]/g, '\\$&');
// set session cookie in mock mode
Cookies.set(SESSION_COOKIE_NAME, 'abc123');

// Get user from query string
let user = queryString.parse(location.search || location.hash.substring(location.hash.indexOf('?'))).user;

mockData.accounts.uqrdav10 = mockData.uqrdav10.account;
mockData.accounts.uqagrinb = mockData.uqagrinb.account;
if (user && !mockData.accounts[user]) {
    console.warn(
        `API MOCK DATA: User name (${user}) is not found, please use one of the usernames from mock data only...`,
    );
}

// default user is researcher if user is not defined
user = user || 'vanilla';

mockSessionApi.onGet(routes.CURRENT_ACCOUNT_API().apiUrl)
    .reply(() => {
        console.log('Account API hit');
        // mock account response
        if (['s2222222', 's3333333'].indexOf(user) > -1) {
            return [200, mockData.accounts[user]];
        } else if (mockData.accounts[user]) {
            return [403, {}];
        }
        return [404, {}];
    });

mock.onGet(routes.CURRENT_ACCOUNT_API().apiUrl)
    .reply(() => {
        console.log('Account API hit');
        // mock account response
        if (user === 'public') {
            return [403, {}];
        } else if (mockData.accounts[user]) {
            return [200, mockData.accounts[user]];
        }
        return [404, {}];
    });

mock.onGet(routes.SPOTLIGHTS_API().apiUrl)
    .reply(() => {
        // mock spotlights
        console.log('Spotlights API hit');
        return [200, [...spotlights]];
    });

mock.onGet(routes.CHAT_API().apiUrl)
    .reply(() => {
        console.log('Chat status API hit');
        // mock chat status
        return [200, { online: true }];
        // return [200, { online: false }];
    });

mock.onGet(routes.TRAINING_API(10).apiUrl)
    .reply(() => {
        console.log('Training events API hit');
        // mock training evemts
        return [200, [{"entityId":2824657,"created":"2020-06-24T15:13:54.487+10:00","updated":"2020-11-23T13:45:08.137+10:00","name":"EndNote: getting started","eventType":"Training and Workshops","eventTypeId":14,"start":"2020-11-24T10:00:00+10:00","end":"2020-11-24T11:30:00+10:00","publish":"2020-06-24T00:00:00+10:00","expire":"2020-11-24T11:30:00+10:00","isActive":true,"isCancelled":false,"summary":"Learn how to use EndNote referencing software to collect and organise references and insert them into Microsoft Word to automatically produce the reference list in your assignments.","details":"<p>The required Zoom link will be sent to you prior to the session.&nbsp;<\/p><p><u>Session description<\/u><\/p><p>This session will show you how to:<\/p><ul>   \r\n<li>set      up an EndNote library<\/li>  \r\n<li>add      new references manually<\/li>  \r\n<li>download      references from the Library catalogue or a database<\/li>  \r\n<li>attach      PDF files of a journal article to an EndNote citation<\/li>  \r\n<li>search,      sort and group within the library<\/li>  \r\n<li>choose      an appropriate referencing style to use with EndNote<\/li>  \r\n<li>use      EndNote with Word to insert citations and create a bibliography<\/li><\/ul><p>View our <a href=\"https:\/\/web.library.uq.edu.au\/research-tools-techniques\/referencing\/referencing-software\/endnote\/using-endnote\">Using EndNote&nbsp;<\/a>guide<\/p><p><strong>Class Essentials<\/strong><\/p><ul><li>Please be on time<\/li><li>This class uses Windows, but will be valuable for Mac users<\/li><\/ul>","offCampusVenue":"Online via Zoom","campus":"Online","building":null,"location":null,"url":null,"onlineInstructions":null,"venue":"Online via Zoom","bookingType":1,"bookingSettings":{"bookings":23,"bookingLimit":40,"placesRemaining":17,"bookingsOpen":"2020-06-24T00:00:00+10:00","bookingsClose":"2020-11-23T16:00:00+10:00"},"workGroupId":117,"attendance":{"total":23,"unspecified":23,"absent":0,"attended":0},"labels":{"1":{"id":377,"name":"LIB.client.ongoing.Software"}},"categories":{"eventType":"Training and Workshops","campus":["Online"]},"sessions":[{"id":17786,"start":"2020-11-24T10:00:00+10:00","end":"2020-11-24T11:30:00+10:00","isCancelled":false,"bookings":23}],"isOnlineClass":true},{"entityId":2870806,"created":"2020-10-26T10:25:36.8+10:00","updated":"2020-10-26T14:13:25.207+10:00","name":"Advanced Adobe Illustrator","eventType":"Software","eventTypeId":45,"start":"2020-11-24T13:00:00+10:00","end":"2020-11-24T15:00:00+10:00","publish":"2020-10-26T14:13:00+10:00","expire":"2020-11-24T15:00:00+10:00","isActive":true,"isCancelled":false,"summary":"A short hands-on course that introduces some intermediate level tools and skills with Adobe Illustrator.","details":"<p>A short hands-on course that introduces some intermediate level tools and skills with Adobe Illustrator. The session covers short exercises.&nbsp;<\/p><p>Prior knowledge of basic visual grammar and Adobe Illustrator are required for this course. <\/p><p>Please book into one of our <em>&quot;Introduction to Adobe Illustrator&quot;<\/em> sessions first if you have no prior experience.<\/p><p><em>This session will use <strong>Adobe Illustrator<\/strong>. <\/em>Please install the software <em>before<\/em>  joining this session, information on how can be found on the <a href=\"https:\/\/my.uq.edu.au\/information-and-services\/information-technology\/software-and-web-apps\/free-student-software-personal-use\">UQ ITS website<\/a>.   If you do not have access to the software, please  feel free to join   and watch as we demonstrate it's use and answer any  questions you may   have.<\/p><p><img style=\"background-color:&#32;initial;&#32;width:&#32;25px;\" src=\"https:\/\/studenthub.uq.edu.au\/Uploads\/Images\/Library\/e-learning-laptop-1.png\"> Attend online: Zoom link to be sent before session<\/p>","offCampusVenue":null,"campus":"Online","building":null,"location":"Zoom","url":null,"onlineInstructions":null,"venue":"Online, Zoom","bookingType":1,"bookingSettings":{"bookings":12,"bookingLimit":30,"placesRemaining":18,"bookingsOpen":"2020-10-26T14:13:00+10:00","bookingsClose":"2020-11-24T13:00:00+10:00"},"workGroupId":117,"attendance":{"total":12,"unspecified":12,"absent":0,"attended":0},"labels":[{"id":377,"name":"LIB.client.ongoing.Software"}],"categories":{"eventType":"Software","campus":["Online"]},"sessions":[{"id":18795,"start":"2020-11-24T13:00:00+10:00","end":"2020-11-24T15:00:00+10:00","isCancelled":false,"bookings":12}],"isOnlineClass":true},{"entityId":2873532,"created":"2020-11-05T15:44:20.193+10:00","updated":"2020-11-13T12:51:15.137+10:00","name":"SciFinder n - learning the new features of this chemistry database","eventType":"Research","eventTypeId":42,"start":"2020-11-24T14:00:00+10:00","end":"2020-11-24T15:00:00+10:00","publish":"2020-11-06T11:42:00+10:00","expire":"2020-11-24T15:00:00+10:00","isActive":true,"isCancelled":false,"summary":"This is a hands on session designed to show students and researchers how to search SciFinder n effectively, and discuss the new features and resources available","details":"<p>A hands on session about the new features of the SciFinder n database. This session is recommended for students and researchers in chemistry, chemical engineering, molecular bioscience, pharmacy and medicine.<\/p>","offCampusVenue":null,"campus":"St Lucia","building":"Biological Sciences Library (94)","location":"Training room 94-215","url":null,"onlineInstructions":null,"venue":"St Lucia, Biological Sciences Library (94), Training room 94-215","bookingType":1,"bookingSettings":{"bookings":1,"bookingLimit":8,"placesRemaining":7,"bookingsOpen":"2020-11-06T11:42:00+10:00","bookingsClose":"2020-11-24T13:00:00+10:00"},"workGroupId":117,"attendance":{"total":1,"unspecified":1,"absent":0,"attended":0},"labels":[{"id":374,"name":"LIB.client.ongoing.Research"}],"categories":{"eventType":"Research","campus":["St Lucia"]},"sessions":[{"id":18875,"start":"2020-11-24T14:00:00+10:00","end":"2020-11-24T15:00:00+10:00","isCancelled":false,"bookings":1}],"isOnlineClass":false},{"entityId":2870807,"created":"2020-10-26T10:25:51.053+10:00","updated":"2020-10-26T14:16:58.85+10:00","name":"Excel: Further Functions","eventType":"Software","eventTypeId":45,"start":"2020-11-25T09:30:00+10:00","end":"2020-11-25T11:30:00+10:00","publish":"2020-10-26T14:16:00+10:00","expire":"2020-11-25T11:30:00+10:00","isActive":true,"isCancelled":false,"summary":"A guide to using Excel tools to analyse and consolidate data to present more meaningful information. These features will assist with report and assignment preparation.","details":"<p>At the end of this session you will be able to:<\/p><ul> <li>Work effectively with a variety of functions<\/li><li>Combine functions into powerful formulas<\/li><\/ul><p><em>This session will use Microsoft Excel. <\/em>Please install the software <em>before <\/em>joining this session: <a href=\"https:\/\/my.uq.edu.au\/information-and-services\/information-technology\/software-and-web-apps\/software-uq\/microsoft-software\/office-365-personal-use\">https:\/\/my.uq.edu.au\/information-and-services\/info...<\/a><\/p><p><img style=\"background-color:&#32;initial;&#32;width:&#32;25px;\" src=\"https:\/\/studenthub.uq.edu.au\/Uploads\/Images\/Library\/e-learning-laptop-1.png\"> Attend online: Zoom link to be sent before session<\/p><p><em><em>As part of <a href=\"https:\/\/ppl.app.uq.edu.au\/content\/10.10.01-sustainability-0\">UQ Sustainability<\/a> this class has no paper handouts. You may download manuals and exercises for this class on the <\/em><a href=\"https:\/\/web.library.uq.edu.au\/library-services\/training\/training-resources\"><em>training resources<\/em><\/a><em> page.<\/em><\/em><\/p>","offCampusVenue":null,"campus":"Online","building":null,"location":"Zoom","url":null,"onlineInstructions":null,"venue":"Online, Zoom","bookingType":1,"bookingSettings":{"bookings":21,"bookingLimit":30,"placesRemaining":9,"bookingsOpen":"2020-10-26T14:16:00+10:00","bookingsClose":"2020-11-25T09:30:00+10:00"},"workGroupId":117,"attendance":{"total":21,"unspecified":21,"absent":0,"attended":0},"labels":[{"id":377,"name":"LIB.client.ongoing.Software"}],"categories":{"eventType":"Software","campus":["Online"]},"sessions":[{"id":18796,"start":"2020-11-25T09:30:00+10:00","end":"2020-11-25T11:30:00+10:00","isCancelled":false,"bookings":21}],"isOnlineClass":true},{"entityId":2868255,"created":"2020-10-14T10:13:02.973+10:00","updated":"2020-10-14T10:21:04.267+10:00","name":"Library resources for graduating students","eventType":"Training and Workshops","eventTypeId":14,"start":"2020-11-25T14:00:00+10:00","end":"2020-11-25T14:30:00+10:00","publish":"2020-10-14T00:00:00+10:00","expire":"2020-11-25T14:30:00+10:00","isActive":true,"isCancelled":false,"summary":"This online class for students who are graduating this semester, will show what library resources may be accessible to you as a member of the alumni or via open access.","details":"<p>Access to full text scholarly literature after graduation is a frequent query from alumni of The University of Queensland. Find out what resources might be available via UQ Library membership or through open access resources accessible on the web.<\/p>","offCampusVenue":"Online via Zoom. Students will be notified of the zoom link on the day before the class is run.","campus":"Online","building":null,"location":null,"url":null,"onlineInstructions":null,"venue":"Online via Zoom. Students will be notified of the zoom link on the day before the class is run.","bookingType":1,"bookingSettings":{"bookings":10,"bookingLimit":30,"placesRemaining":20,"bookingsOpen":"2020-10-14T00:00:00+10:00","bookingsClose":"2020-11-25T14:00:00+10:00"},"workGroupId":117,"attendance":{"total":10,"unspecified":10,"absent":0,"attended":0},"labels":[{"id":374,"name":"LIB.client.ongoing.Research"}],"categories":{"eventType":"Training and Workshops","campus":["Online"]},"sessions":[{"id":10983,"start":"2020-11-25T14:00:00+10:00","end":"2020-11-25T14:30:00+10:00","isCancelled":false,"bookings":10}],"isOnlineClass":false},{"entityId":2824833,"created":"2020-06-24T15:37:55.513+10:00","updated":"2020-11-16T11:19:20.483+10:00","name":"PubMed for literature searching","eventType":"Training and Workshops","eventTypeId":14,"start":"2020-11-26T13:00:00+10:00","end":"2020-11-26T14:00:00+10:00","publish":"2020-06-24T00:00:00+10:00","expire":"2020-11-26T14:00:00+10:00","isActive":true,"isCancelled":false,"summary":"\u200bPubMed is a broad biomedical database, free to access on the internet or via the UQ Library database list. It holds over 30 million citations from publications around the world, in English and non-English languages. But do you know how to find the best literature for your research in this database?","details":"<p>The required Zoom link will be sent to you prior to the session.&nbsp;<\/p><p><u>Session description<\/u><\/p><p>PubMed is a broad biomedical database, free to access on the internet or via the UQ Library database search. It holds over 30 million citations from publications around the world, in English and non-English languages.&nbsp;<\/p><p>But do you know how to find the best literature for your research in this database?<\/p><p>Come to this session and learn:<\/p><ul>\r\n<li>What is PubMed and how to access it<\/li><li>Field Code searching in PubMed<\/li><li>Boolean search operators (AND, OR &amp; NOT)<\/li><li>Truncation searches<\/li><li>Phrase Searches<\/li><li>MeSH (Medical Subject Headings)<\/li><li>Combining your searches<\/li><li>Filtering your search<\/li><li>The Clipboard feature<\/li><li>Exporting your results<\/li><li>Creating a profile and saving your searches<\/li><\/ul><p>Please come to this session with a research topic and list of terms\/synonyms to search with.<\/p>","offCampusVenue":"Online via Zoom","campus":"Online","building":null,"location":null,"url":null,"onlineInstructions":null,"venue":"Online via Zoom","bookingType":1,"bookingSettings":{"bookings":21,"bookingLimit":40,"placesRemaining":19,"bookingsOpen":"2020-06-24T00:00:00+10:00","bookingsClose":"2020-11-26T12:00:00+10:00"},"workGroupId":117,"attendance":{"total":21,"unspecified":21,"absent":0,"attended":0},"labels":[{"id":374,"name":"LIB.client.ongoing.Research"}],"categories":{"eventType":"Training and Workshops","campus":["Online"]},"sessions":[{"id":17794,"start":"2020-11-26T13:00:00+10:00","end":"2020-11-26T14:00:00+10:00","isCancelled":false,"bookings":21}],"isOnlineClass":true},{"entityId":2871012,"created":"2020-10-26T13:59:35.32+10:00","updated":"2020-11-23T07:13:24.5+10:00","name":"R data manipulation with RStudio and dplyr: introduction","eventType":"Software","eventTypeId":45,"start":"2020-11-30T09:30:00+10:00","end":"2020-11-30T11:00:00+10:00","publish":"2020-10-26T14:09:00+10:00","expire":"2020-11-30T11:00:00+10:00","isActive":true,"isCancelled":false,"summary":"Manipulate your data with RStudio and dplyr in this hands-on R session.","details":"<p>In this hands-on session, you will use RStudio and the dplyr package to manipulate your tabular data.<\/p><p>Specifically, you will learn about six dplyr &quot;verbs&quot; that can be used to:<\/p><ul><li>filter data depending on conditions<\/li><li>sort data<\/li><li>remove variables<\/li><li>create new variables<\/li><li>collapse data to a summary<\/li><li>operate on separate groups<\/li><\/ul><p><em>This session will use RStudio. <\/em>Please install the software <em>before <\/em>joining this session: <a href=\"https:\/\/gitlab.com\/stragu\/DSH\/blob\/master\/R\/Installation.md\">https:\/\/gitlab.com\/stragu\/DSH\/blob\/master\/R\/Instal...<\/a><\/p><p>You\n should be familiar with R. It is recommended to attend the &quot;R with \nRStudio: getting started&quot; session prior to this one, but not essential \nif you have used R before.<\/p><p><img style=\"background-color:&#32;initial;&#32;width:&#32;25px;\" src=\"https:\/\/studenthub.uq.edu.au\/Uploads\/Images\/Library\/e-learning-laptop-1.png\"> Attend online: Zoom link to be sent before session<\/p><p><img style=\"width:&#32;25px;\" src=\"https:\/\/studenthub.uq.edu.au\/Uploads\/Images\/Library\/video-player-movie-1.png\">  Recording: Access our <a href=\"https:\/\/www.youtube.com\/watch?v=vqvsyaaqJUk&amp;list=PLmDEaZ20fWqCypV7S-trCPtVefHk4e0bU&amp;index=2\">video recording<\/a> at any time<\/p><p><em>You may download manuals and exercises for this class on the <\/em><a href=\"https:\/\/web.library.uq.edu.au\/library-services\/training\/training-resources\"><em>training resources<\/em><\/a><em> page.<\/em><\/p>","offCampusVenue":null,"campus":"Online","building":null,"location":"Zoom","url":null,"onlineInstructions":null,"venue":"Online, Zoom","bookingType":1,"bookingSettings":{"bookings":12,"bookingLimit":30,"placesRemaining":18,"bookingsOpen":"2020-10-26T14:09:00+10:00","bookingsClose":"2020-11-30T09:30:00+10:00"},"workGroupId":117,"attendance":{"total":12,"unspecified":12,"absent":0,"attended":0},"labels":[{"id":377,"name":"LIB.client.ongoing.Software"}],"categories":{"eventType":"Software","campus":["Online"]},"sessions":[{"id":18801,"start":"2020-11-30T09:30:00+10:00","end":"2020-11-30T11:00:00+10:00","isCancelled":false,"bookings":12}],"isOnlineClass":true},{"entityId":2870808,"created":"2020-10-26T10:26:10.567+10:00","updated":"2020-10-26T14:15:38.597+10:00","name":"Introduction to Adobe Photoshop","eventType":"Software","eventTypeId":45,"start":"2020-11-30T13:00:00+10:00","end":"2020-11-30T15:00:00+10:00","publish":"2020-10-26T14:15:00+10:00","expire":"2020-11-30T15:00:00+10:00","isActive":true,"isCancelled":false,"summary":"This session will introduce participants on how to sketch out concepts and diagrams on paper, and transfer them to digital formats and refine them. We use Adobe Photoshop and Illustrator from sketches and photographs. Basic level knowledge of the software suites would be beneficial.","details":"<p>A short hands-on course that introduces some intermediate level tools\n  and skills with Adobe Photoshop. The session covers short exercises. <\/p><p>Prior knowledge of basic visual grammar and Adobe Photoshop are required for this course. <\/p><p><em>This session will use <strong>Adobe Photoshop<\/strong>. <\/em>Please install the software <em>before<\/em>  joining this session, information on how can be found on the <a href=\"https:\/\/my.uq.edu.au\/information-and-services\/information-technology\/software-and-web-apps\/free-student-software-personal-use\">UQ ITS website<\/a>.\n    If you do not have access to the software, please  feel free to join\n    and watch as we demonstrate it's use and answer any  questions you \nmay    have.<\/p><p><img style=\"background-color:&#32;initial;&#32;width:&#32;25px;\" src=\"https:\/\/studenthub.uq.edu.au\/Uploads\/Images\/Library\/e-learning-laptop-1.png\"> Attend online: Zoom link to be sent before session<\/p>","offCampusVenue":null,"campus":"Online","building":null,"location":"Zoom","url":null,"onlineInstructions":null,"venue":"Online, Zoom","bookingType":1,"bookingSettings":{"bookings":13,"bookingLimit":30,"placesRemaining":17,"bookingsOpen":"2020-10-26T14:15:00+10:00","bookingsClose":"2020-11-30T13:00:00+10:00"},"workGroupId":117,"attendance":{"total":13,"unspecified":13,"absent":0,"attended":0},"labels":[{"id":377,"name":"LIB.client.ongoing.Software"}],"categories":{"eventType":"Software","campus":["Online"]},"sessions":[{"id":18797,"start":"2020-11-30T13:00:00+10:00","end":"2020-11-30T15:00:00+10:00","isCancelled":false,"bookings":13}],"isOnlineClass":true},{"entityId":2874328,"created":"2020-11-08T14:55:07.713+10:00","updated":"2020-11-08T14:59:18.313+10:00","name":"Word: Creating a Structured Thesis (CaST)","eventType":"Software","eventTypeId":45,"start":"2020-11-30T13:00:00+10:00","end":"2020-11-30T16:00:00+10:00","publish":"2020-11-08T14:59:00+10:00","expire":"2020-11-30T16:00:00+10:00","isActive":true,"isCancelled":false,"summary":"This session is designed for researchers at the University of Queensland who need to use the complex features of Word to structure complex documents.  It includes automation to limit repetitive tasks and meet the formatting requirements for a successful thesis submission.","details":"<p>This session is very similar to the Word Advanced session.  It has  been customised to focus on UQ's thesis submission requirements using  formal documentation rather than generic skills based training.<\/p><p>Following this training participants will be able to:<\/p><p>1. Use styles with confidence<\/p><p>2. Apply automatic heading numbering<\/p><p>3. Generate automated tables of contents, figures etc.<\/p><p>4. Insert captions and cross-references<\/p><p>5. Combine documents and merge formatting<\/p><p><em>This session will use Microsoft Word. <\/em>Please install the software <em>before <\/em>joining this session: <a href=\"https:\/\/my.uq.edu.au\/information-and-services\/information-technology\/software-and-web-apps\/software-uq\/microsoft-software\/office-365-personal-use\">https:\/\/my.uq.edu.au\/information-and-services\/info...<\/a><\/p><p><img style=\"background-color:&#32;initial;&#32;width:&#32;25px;\" src=\"https:\/\/studenthub.uq.edu.au\/Uploads\/Images\/Library\/e-learning-laptop-1.png\"> Attend online: Zoom link to be sent before session<\/p><p><em>As part of <a href=\"https:\/\/ppl.app.uq.edu.au\/content\/10.10.01-sustainability-0\">UQ Sustainability<\/a> this class has no paper handouts. You may download manuals and exercises for this class on the <\/em><a href=\"https:\/\/web.library.uq.edu.au\/library-services\/training\/training-resources\"><em>training resources<\/em><\/a><em> page.<\/em><\/p>","offCampusVenue":null,"campus":"Online","building":null,"location":"Zoom","url":null,"onlineInstructions":null,"venue":"Online, Zoom","bookingType":1,"bookingSettings":{"bookings":16,"bookingLimit":30,"placesRemaining":14,"bookingsOpen":"2020-11-08T14:59:00+10:00","bookingsClose":"2020-11-30T13:00:00+10:00"},"workGroupId":117,"attendance":{"total":16,"unspecified":16,"absent":0,"attended":0},"labels":[{"id":377,"name":"LIB.client.ongoing.Software"}],"categories":{"eventType":"Software","campus":["Online"]},"sessions":[{"id":18904,"start":"2020-11-30T13:00:00+10:00","end":"2020-11-30T16:00:00+10:00","isCancelled":false,"bookings":16}],"isOnlineClass":true},{"entityId":2824754,"created":"2020-06-24T15:23:57.893+10:00","updated":"2020-08-26T11:19:26.03+10:00","name":"EndNote for thesis and publications writing","eventType":"Training and Workshops","eventTypeId":14,"start":"2020-12-01T10:00:00+10:00","end":"2020-12-01T12:00:00+10:00","publish":"2020-06-24T00:00:00+10:00","expire":"2020-12-01T12:00:00+10:00","isActive":true,"isCancelled":false,"summary":"PRIOR KNOWLEDGE OF ENDNOTE IS ESSENTIAL. Tips and tricks for using EndNote when writing a thesis or a publication.","details":"<p>The required Zoom link will be sent to you prior to the session.&nbsp;<\/p><p><u>Session description<\/u><\/p><p><strong>PRIOR KNOWLEDGE OF ENDNOTE IS ESSENTIAL.<\/strong> Tips and tricks for using EndNote when writing a thesis or a publication.&nbsp;&nbsp;This class uses pre-prepared materials which will be sent to you before the class.<\/p><p>This session will cover:<\/p><ul> <li>Backing Up<\/li><li>Cleaning up a library<\/li><li>Syncing basics<\/li><li>Basics of editing a style<\/li><li>Journal term lists<\/li><li>Combining libraries and merging chapters<\/li><li>EndNote library recovery<\/li><\/ul>","offCampusVenue":"Online via Zoom","campus":"Online","building":null,"location":null,"url":null,"onlineInstructions":null,"venue":"Online via Zoom","bookingType":1,"bookingSettings":{"bookings":15,"bookingLimit":40,"placesRemaining":25,"bookingsOpen":"2020-06-24T00:00:00+10:00","bookingsClose":"2020-12-01T09:00:00+10:00"},"workGroupId":117,"attendance":{"total":15,"unspecified":15,"absent":0,"attended":0},"labels":{"1":{"id":377,"name":"LIB.client.ongoing.Software"}},"categories":{"eventType":"Training and Workshops","campus":["Online"]},"sessions":[{"id":17789,"start":"2020-12-01T10:00:00+10:00","end":"2020-12-01T12:00:00+10:00","isCancelled":false,"bookings":15}],"isOnlineClass":true}] ];
    });

mock.onGet(routes.LIB_HOURS_API().apiUrl)
    .reply(() => {
        console.log('Library Hours API hit');
        // mock library hours
        return [200, libHours];
    });

mock.onGet(routes.ALERT_API().apiUrl)
    .reply(() => {
        console.log('Alert status API hit');
        // mock alerts status
        return [200,
            [
                {
                'id': 'e895b270-d62b-11e7-954e-57c2cc19d151',
                'start': '2020-10-12 09:58:02',
                'end': '2020-11-22 09:58:02',
                'title': 'Test urgent alert 2',
                'body': '[urgent link description](http:\/\/www.somelink.com) Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                'urgent': 1,
                },
            ],
        ];
    });

mock.onGet(routes.COMP_AVAIL_API.apiUrl)
    .reply(() => {
        console.log('Computer availability API hit');
        // mock computer availability
        return [200, computerAvailability];
    });

fetchMock.mock('begin:https://primo-instant-apac.hosted.exlibrisgroup.com/solr/ac', {
    status: 200,
    response: {
        numFound: 1622,
        start: 0,
        maxScore: 16.476818,
        docs: [
            { text: 'beards', score: 16.476818 },
            {
                text: 'beards folklore',
                score: 16.476564,
            },
            { text: 'beards massage', score: 16.476564 },
            {
                text: 'beards fiction',
                score: 16.476564,
            },
            { text: 'beards poetry', score: 16.476564 },
            {
                text: 'beards history',
                score: 16.476564,
            },
            { text: 'beards europe', score: 16.476564 },
            {
                text: 'beards humor',
                score: 16.476564,
            },
            { text: 'beards harold', score: 16.476564 },
            { text: 'beards peter', score: 16.476564 },
        ],
    },
});

fetchMock.mock('begin:https://api.library.uq.edu.au/v1/search_suggestions?type=exam_paper', [
    {
        name: 'ACCT2111',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations_2019_ACCT2111.pdf',
        type: 'exam_paper',
        course_title: 'Principles of Financial Accounting',
    },
    {
        name: 'ACCT1101',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT1101.pdf',
        type: 'exam_paper',
        course_title: 'Accounting for Decision Making',
    },
    {
        name: 'ACCT7804',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations_2019_ACCT7804.pdf',
        type: 'exam_paper',
        course_title: 'Accounting and Business Analysis',
    },
    {
        name: 'ACCT2112',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_Two_Final_Examinations_2019_ACCT2112.pdf',
        type: 'exam_paper',
        course_title: 'Financial Accounting for Business',
    },
    {
        name: 'ACCT3101',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT3101.pdf',
        type: 'exam_paper',
        course_title: 'Auditing & Public Practice',
    },
    {
        name: 'ACCT3102',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT3102.pdf',
        type: 'exam_paper',
        course_title: 'External Reporting Issues',
    },
    {
        name: 'ACCT3103',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT3103.pdf',
        type: 'exam_paper',
        course_title: 'Advanced Financial Accounting',
    },
    {
        name: 'ACCT3104',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT3104.pdf',
        type: 'exam_paper',
        course_title: 'Management Accounting',
    },
    {
        name: 'ACCT1110',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT1110.pdf',
        type: 'exam_paper',
        course_title: 'Financial Reporting and Analysis',
    },
    {
        name: 'ACCT2101',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT2101.pdf',
        type: 'exam_paper',
        course_title: 'Financial Reporting',
    },
    {
        name: 'ACCT2102',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT2102.pdf',
        type: 'exam_paper',
        course_title: 'Principles of Management Accounting',
    },
    {
        name: 'ACCT2113',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT2113.pdf',
        type: 'exam_paper',
        course_title: 'Management Accounting Principles',
    },
    {
        name: 'ACCT7101',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7101.pdf',
        type: 'exam_paper',
        course_title: 'Accounting',
    },
    {
        name: 'ACCT7102',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7102.pdf',
        type: 'exam_paper',
        course_title: 'Financial Accounting',
    },
    {
        name: 'ACCT7103',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7103.pdf',
        type: 'exam_paper',
        course_title: 'Auditing',
    },
    {
        name: 'ACCT7104',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7104.pdf',
        type: 'exam_paper',
        course_title: 'Corporate Accounting',
    },
    {
        name: 'ACCT7106',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7106.pdf',
        type: 'exam_paper',
        course_title: 'Financial Statement Analysis',
    },
    {
        name: 'ACCT7107',
        url: 'https://files.library.uq.edu.au/exams/2019/Semester_One_Final_Examinations__2019_ACCT7107.pdf',
        type: 'exam_paper',
        course_title: 'Management Accounting and Control',
    },
    {
        name: 'ACCT3105',
        url: 'https://files.library.uq.edu.au/exams/2018/Semester_One_Final_Examinations__2018_ACCT3105.pdf',
        type: 'exam_paper',
        course_title: 'Advanced Management Accounting',
    },
    {
        name: 'ACCT7209',
        url: 'https://files.library.uq.edu.au/exams/2016/Semester_One_Final_Examinations__2016_ACCT7209_Sample.pdf',
        type: 'exam_paper',
        course_title: 'Business Information Systems',
    },
    {
        name: 'ACCT3201',
        url: 'https://files.library.uq.edu.au/exams/2016/Semester_One_Final_Examinations__2016_ACCT3201_Sample.pdf',
        type: 'exam_paper',
        course_title: 'Business Information Systems',
    },
]);

fetchMock.mock(
    'begin:https://api.library.uq.edu.au/v1/search_suggestions?type=learning_resource',
    learningResourceSearchSuggestions
);

fetchMock.mock('https://api.library.uq.edu.au/v1/learning_resources/FREN1010', learningResources_FREN1010);
fetchMock.mock('https://api.library.uq.edu.au/v1/learning_resources/HIST1201', learningResources_HIST1201);
fetchMock.mock('https://api.library.uq.edu.au/v1/learning_resources/PHIL1002', learningResources_PHIL1002);

fetchMock.mock('https://api.library.uq.edu.au/v1/library_guides/FREN1010', libraryGuides_FREN1010);
fetchMock.mock('https://api.library.uq.edu.au/v1/library_guides/HIST1201', libraryGuides_HIST1201);
fetchMock.mock('https://api.library.uq.edu.au/v1/library_guides/PHIL1002', libraryGuides_PHIL1002);

// fetchMock.mock('https://api.library.uq.edu.au/v1/course_reading_list/FE54098F-2CB3-267D-50F8-4B2895FE94B9', courseReadingList_FE54098F);
fetchMock.mock('https://api.library.uq.edu.au/v1/course_reading_list/6888AB68-0681-FD77-A7D9-F7B3DEE7B29F', courseReadingList_6888AB68);
fetchMock.mock('https://api.library.uq.edu.au/v1/course_reading_list/2109F2EC-AB0B-482F-4D30-1DD3531E46BE', courseReadingList_2109F2EC);
