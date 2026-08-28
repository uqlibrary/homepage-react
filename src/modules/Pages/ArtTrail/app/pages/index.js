import Welcome from './Welcome';
import PenuTjukurpa from './PenuTjukurpa';
import SandHills from './SandHills';
import DevilMountainLizard from './DevilMountainLizard';
import Tingari from './Tingari';
import Kunawarritji from './Kunawarritji';
import Pikkuw from './Pikkuw';
import Whispers from './Whispers';
import Warual from './Warual';
import ContinueJourney from './ContinueJourney';

export const trailPages = [
    { component: Welcome, pageTitle: 'Indigenous art and Library discovery trail' },
    {
        component: PenuTjukurpa,
        pageTitle: 'Hector Tijupuru Burton, Ray Ken, Mick Wikilyiri, Brenton Ken, Punu Tjukurpa 2013',
    },
    { component: SandHills, pageTitle: 'Lily Kelly Napangardi, Sand Hills 2007' },
    {
        component: DevilMountainLizard,
        pageTitle: 'Gloria Tamerre Petyarre, Devil Mountain Lizard Dreaming 1997',
    },
    {
        component: Tingari,
        pageTitle: 'Johnny Yungut Tjupurrula, Tingari ceremonies at Wilkinkarra 2003',
    },
    {
        component: Kunawarritji,
        pageTitle: 'Nora Wompi Nungurrayi, Kunawarritji 1 and Kunawarritji 2 2012',
    },
    { component: Pikkuw, pageTitle: 'Craig Koomeeta, Pikkuw (Saltwater crocodile) 2008' },
    { component: Whispers, pageTitle: 'Megan Cope, Whispers (Poles) 2023' },
    { component: Warual, pageTitle: 'Brian Robinson, Warual III (Green Turtle) 2015' },
    { component: ContinueJourney, pageTitle: 'Exploring Aboriginal and Torres Strait Islander stories' },
];
