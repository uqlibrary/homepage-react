import { getFriendlyFloorName, getOrdinalSuffixFor, isInt } from './spacesHelpers';

describe('spaces helpers', () => {
    it('creates ordinal numbers correctly', () => {
        expect(getOrdinalSuffixFor(0)).toEqual('th');
        expect(getOrdinalSuffixFor(1)).toEqual('st');
        expect(getOrdinalSuffixFor(2)).toEqual('nd');
        expect(getOrdinalSuffixFor(3)).toEqual('rd');
        expect(getOrdinalSuffixFor(4)).toEqual('th');
        expect(getOrdinalSuffixFor(5)).toEqual('th');
        expect(getOrdinalSuffixFor(6)).toEqual('th');
        expect(getOrdinalSuffixFor(7)).toEqual('th');
        expect(getOrdinalSuffixFor(8)).toEqual('th');
        expect(getOrdinalSuffixFor(9)).toEqual('th');
        expect(getOrdinalSuffixFor(10)).toEqual('th');
        expect(getOrdinalSuffixFor(11)).toEqual('th');
        expect(getOrdinalSuffixFor(12)).toEqual('th');
        expect(getOrdinalSuffixFor(13)).toEqual('th');
        expect(getOrdinalSuffixFor(14)).toEqual('th');
        expect(getOrdinalSuffixFor(15)).toEqual('th');
        expect(getOrdinalSuffixFor(16)).toEqual('th');
        expect(getOrdinalSuffixFor(17)).toEqual('th');
        expect(getOrdinalSuffixFor(18)).toEqual('th');
        expect(getOrdinalSuffixFor(19)).toEqual('th');
        expect(getOrdinalSuffixFor(20)).toEqual('th');
        expect(getOrdinalSuffixFor(21)).toEqual('st');
        expect(getOrdinalSuffixFor(22)).toEqual('nd');
        expect(getOrdinalSuffixFor(23)).toEqual('rd');
        expect(getOrdinalSuffixFor(24)).toEqual('th');
        expect(getOrdinalSuffixFor(25)).toEqual('th');
        expect(getOrdinalSuffixFor(26)).toEqual('th');
        expect(getOrdinalSuffixFor(27)).toEqual('th');
        expect(getOrdinalSuffixFor(28)).toEqual('th');
        expect(getOrdinalSuffixFor(29)).toEqual('th');
        expect(getOrdinalSuffixFor(30)).toEqual('th');
        expect(getOrdinalSuffixFor(31)).toEqual('st');
        expect(getOrdinalSuffixFor(32)).toEqual('nd');
        expect(getOrdinalSuffixFor(33)).toEqual('rd');
        expect(getOrdinalSuffixFor(34)).toEqual('th');
        expect(getOrdinalSuffixFor(35)).toEqual('th');
        expect(getOrdinalSuffixFor(36)).toEqual('th');
        expect(getOrdinalSuffixFor(37)).toEqual('th');
        expect(getOrdinalSuffixFor(38)).toEqual('th');
        expect(getOrdinalSuffixFor(39)).toEqual('th');
        expect(getOrdinalSuffixFor(40)).toEqual('th');
        expect(getOrdinalSuffixFor(41)).toEqual('st');
        expect(getOrdinalSuffixFor(42)).toEqual('nd');
        expect(getOrdinalSuffixFor(43)).toEqual('rd');
        expect(getOrdinalSuffixFor(44)).toEqual('th');
        expect(getOrdinalSuffixFor(45)).toEqual('th');
        expect(getOrdinalSuffixFor(46)).toEqual('th');
        expect(getOrdinalSuffixFor(47)).toEqual('th');
        expect(getOrdinalSuffixFor(48)).toEqual('th');
        expect(getOrdinalSuffixFor(49)).toEqual('th');
        expect(getOrdinalSuffixFor(50)).toEqual('th');
        expect(getOrdinalSuffixFor(51)).toEqual('st');
        expect(getOrdinalSuffixFor(52)).toEqual('nd');
        expect(getOrdinalSuffixFor(53)).toEqual('rd');
        expect(getOrdinalSuffixFor(54)).toEqual('th');
        expect(getOrdinalSuffixFor(55)).toEqual('th');
        expect(getOrdinalSuffixFor(56)).toEqual('th');
        expect(getOrdinalSuffixFor(57)).toEqual('th');
        expect(getOrdinalSuffixFor(58)).toEqual('th');
        expect(getOrdinalSuffixFor(59)).toEqual('th');
        expect(getOrdinalSuffixFor(60)).toEqual('th');
        expect(getOrdinalSuffixFor(61)).toEqual('st');
        expect(getOrdinalSuffixFor(62)).toEqual('nd');
        expect(getOrdinalSuffixFor(63)).toEqual('rd');
        expect(getOrdinalSuffixFor(64)).toEqual('th');
        expect(getOrdinalSuffixFor(65)).toEqual('th');
        expect(getOrdinalSuffixFor(66)).toEqual('th');
        expect(getOrdinalSuffixFor(67)).toEqual('th');
        expect(getOrdinalSuffixFor(68)).toEqual('th');
        expect(getOrdinalSuffixFor(69)).toEqual('th');
        expect(getOrdinalSuffixFor(70)).toEqual('th');
        expect(getOrdinalSuffixFor(71)).toEqual('st');
        expect(getOrdinalSuffixFor(72)).toEqual('nd');
        expect(getOrdinalSuffixFor(73)).toEqual('rd');
        expect(getOrdinalSuffixFor(74)).toEqual('th');
        expect(getOrdinalSuffixFor(75)).toEqual('th');
        expect(getOrdinalSuffixFor(76)).toEqual('th');
        expect(getOrdinalSuffixFor(77)).toEqual('th');
        expect(getOrdinalSuffixFor(78)).toEqual('th');
        expect(getOrdinalSuffixFor(79)).toEqual('th');
        expect(getOrdinalSuffixFor(80)).toEqual('th');
        expect(getOrdinalSuffixFor(81)).toEqual('st');
        expect(getOrdinalSuffixFor(82)).toEqual('nd');
        expect(getOrdinalSuffixFor(83)).toEqual('rd');
        expect(getOrdinalSuffixFor(84)).toEqual('th');
        expect(getOrdinalSuffixFor(85)).toEqual('th');
        expect(getOrdinalSuffixFor(86)).toEqual('th');
        expect(getOrdinalSuffixFor(87)).toEqual('th');
        expect(getOrdinalSuffixFor(88)).toEqual('th');
        expect(getOrdinalSuffixFor(89)).toEqual('th');
        expect(getOrdinalSuffixFor(90)).toEqual('th');
        expect(getOrdinalSuffixFor(91)).toEqual('st');
        expect(getOrdinalSuffixFor(92)).toEqual('nd');
        expect(getOrdinalSuffixFor(93)).toEqual('rd');
        expect(getOrdinalSuffixFor(94)).toEqual('th');
        expect(getOrdinalSuffixFor(95)).toEqual('th');
        expect(getOrdinalSuffixFor(96)).toEqual('th');
        expect(getOrdinalSuffixFor(97)).toEqual('th');
        expect(getOrdinalSuffixFor(98)).toEqual('th');
        expect(getOrdinalSuffixFor(99)).toEqual('th');
        expect(getOrdinalSuffixFor(100)).toEqual('th');
        expect(getOrdinalSuffixFor(101)).toEqual('st');
        expect(getOrdinalSuffixFor(102)).toEqual('nd');
        expect(getOrdinalSuffixFor(103)).toEqual('rd');
        expect(getOrdinalSuffixFor(104)).toEqual('th');
        expect(getOrdinalSuffixFor(105)).toEqual('th');
        expect(getOrdinalSuffixFor(106)).toEqual('th');
        expect(getOrdinalSuffixFor(107)).toEqual('th');
        expect(getOrdinalSuffixFor(108)).toEqual('th');
        expect(getOrdinalSuffixFor(109)).toEqual('th');
        expect(getOrdinalSuffixFor(110)).toEqual('th');
        expect(getOrdinalSuffixFor(111)).toEqual('th');
        expect(getOrdinalSuffixFor(112)).toEqual('th');
        expect(getOrdinalSuffixFor(113)).toEqual('th');
        expect(getOrdinalSuffixFor(114)).toEqual('th');
        expect(getOrdinalSuffixFor(115)).toEqual('th');
        expect(getOrdinalSuffixFor(115)).toEqual('th');
        expect(getOrdinalSuffixFor(116)).toEqual('th');
        expect(getOrdinalSuffixFor(117)).toEqual('th');
        expect(getOrdinalSuffixFor(118)).toEqual('th');
        expect(getOrdinalSuffixFor(119)).toEqual('th');
        expect(getOrdinalSuffixFor(120)).toEqual('th');
        expect(getOrdinalSuffixFor(121)).toEqual('st');
        expect(getOrdinalSuffixFor(122)).toEqual('nd');
    });

    it('is an integer', () => {
        expect(isInt(0)).toEqual(true);
        expect(isInt(1)).toEqual(true);
        expect(isInt(2)).toEqual(true);
        expect(isInt(3)).toEqual(true);
        expect(isInt(4)).toEqual(true);
        expect(isInt('2a')).toEqual(false);
        expect(isInt('4')).toEqual(true);
    });

    it('has a friendly floor name', () => {
        // missing attributes default to false
        expect(getFriendlyFloorName({ space_precise: 'Westernmost corner', space_floor_name: '3' })).toEqual(
            'Westernmost corner, 3rd Floor',
        );
        expect(
            getFriendlyFloorName({
                space_precise: 'Westernmost corner',
                space_floor_name: '3',
                space_is_ground_floor: false,
            }),
        ).toEqual('Westernmost corner, 3rd Floor');
        expect(getFriendlyFloorName({ space_precise: 'Eastern corner', space_floor_name: '2A' })).toEqual(
            'Eastern corner, 2A',
        );
        expect(getFriendlyFloorName({ space_precise: '', space_floor_name: '1' })).toEqual('1st Floor');
        expect(getFriendlyFloorName({ space_floor_name: '3A' })).toEqual('3A');
        expect(getFriendlyFloorName({ space_precise: '', space_floor_name: '3A' })).toEqual('3A');
        expect(getFriendlyFloorName({ space_is_ground_floor: true })).toEqual('Ground floor');
        expect(getFriendlyFloorName({ space_is_ground_floor: true, space_precise: 'Eastern corner' })).toEqual(
            'Eastern corner, Ground floor',
        );
    });
});
