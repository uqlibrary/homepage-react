import {
    canSeeLearningResourcesPage,
    canSeeLearningResourcesPanel,
    canSeeReadPublish,
    canSeeTrainingPanel,
    canSeeEndnoteReferencing,
    isLoggedInUser,
    isLibraryStaff,
    isStaff,
    isUQOnlyUser,
    isAlertsAdminUser,
    isDlorAdminUser,
    isDlorOwner,
    isADlorTeamMember,
    isHospitalUser,
    isEspaceAuthor,
    isHdrStudent,
    isInDLOROwningTeam,
    isTestTagUser,
} from './access';
import { accounts } from 'data/mock/data';

describe('access', () => {
    it('should know if an account is for a HDR student', () => {
        expect(isHdrStudent(accounts.s1111111)).toEqual(true);
        expect(isHdrStudent(accounts.uqstaff)).toEqual(false);
    });

    it('only authors can see espace info', () => {
        expect(isEspaceAuthor({ id: 's123456' }, { aut_id: 1086 })).toEqual(true);
        expect(isEspaceAuthor({ id: 's123456' }, {})).toEqual(false);
        expect(isEspaceAuthor({ id: 's123456' })).toEqual(false);
        expect(isEspaceAuthor({})).toEqual(false);
    });

    it('only authorised users can see learning resources', () => {
        expect(canSeeLearningResourcesPage({ id: 's123456', user_group: 'UG' })).toEqual(true);
        expect(canSeeLearningResourcesPage({ id: 's123456', user_group: 'STAFF_AWAITING_AURION' })).toEqual(false);
        expect(canSeeLearningResourcesPage({ id: 's123456', user_group: 'RHD' })).toEqual(true);

        expect(canSeeLearningResourcesPanel({ id: 's123456', user_group: 'UG' })).toEqual(true);
        expect(canSeeLearningResourcesPanel({ id: 's123456', user_group: 'STAFF_AWAITING_AURION' })).toEqual(false);
        expect(canSeeLearningResourcesPanel({ id: 's123456', user_group: 'RHD', current_classes: [] })).toEqual(false);
        expect(
            canSeeLearningResourcesPanel({ id: 's123456', user_group: 'RHD', current_classes: [{ SUBJECT: 'FREN' }] }),
        ).toEqual(true);
        expect(canSeeLearningResourcesPanel({})).toEqual(false);
    });

    it('alerts pages are limited to appropriate users', () => {
        expect(isAlertsAdminUser({})).toEqual(false);
        expect(
            isAlertsAdminUser({
                id: 'uqstaff',
                groups: [
                    'CN=lib_libapi_SpotlightAdmins,OU=lib-libapi-groups,OU=LIB-groups,OU=University of Queensland Library,OU=Deputy Vice-Chancellor (Academic),OU=Vice-Chancellor,DC=uq,DC=edu,DC=au',
                ],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(true);
        expect(
            isAlertsAdminUser({
                id: 'uqstaffnonpriv',
                groups: ['DC=uq', 'DC=edu', 'DC=au'],
                user_group: 'LIBRARYSTAFFB',
            }),
        ).toEqual(false);
    });

    it('should identify TestTag users correctly', () => {
        // Valid TestTag user with tnt data
        expect(
            isTestTagUser({
                id: 'uqstaff',
                tnt: {
                    id: 123,
                    privileges: { read: 1 },
                },
            }),
        ).toEqual(true);

        // No account provided
        expect(isTestTagUser(null)).toEqual(false);
        expect(isTestTagUser(undefined)).toEqual(false);
        expect(isTestTagUser()).toEqual(false);

        // Empty account object
        expect(isTestTagUser({})).toEqual(false);

        // Account without id (not logged in)
        expect(
            isTestTagUser({
                tnt: { id: 123 },
            }),
        ).toEqual(false);

        // Account without tnt property
        expect(
            isTestTagUser({
                id: 'uqstaff',
            }),
        ).toEqual(false);

        // Account with empty tnt object
        expect(
            isTestTagUser({
                id: 'uqstaff',
                tnt: {},
            }),
        ).toEqual(false);

        // Account with tnt as null
        expect(
            isTestTagUser({
                id: 'uqstaff',
                tnt: null,
            }),
        ).toEqual(false);

        // Account with tnt as undefined
        expect(
            isTestTagUser({
                id: 'uqstaff',
                tnt: undefined,
            }),
        ).toEqual(false);
    });

    it('should treat publishing user as in DLOR owning team', () => {
        const account = { id: 'uqauthor1' };
        const dlorItem = {
            object_owning_team_id: 42,
            owner: {
                publishing_user_username: 'uqauthor1',
            },
        };

        expect(isInDLOROwningTeam(account, dlorItem, [])).toEqual(true);
    });

    it('should keep existing team membership logic for non-publishing users', () => {
        const account = { id: 'uqteammember1' };
        const dlorItem = {
            object_owning_team_id: 42,
            owner: {
                publishing_user_username: 'uqauthor1',
            },
        };
        const dlorTeamList = [
            {
                team_id: 42,
                team_members: [{ team_admin_username: 'uqteammember1' }],
            },
        ];

        expect(isInDLOROwningTeam(account, dlorItem, dlorTeamList)).toEqual(true);
    });

    it('covers remaining access helper paths', () => {
        expect(isLoggedInUser({ id: 'uqa1' })).toEqual(true);
        expect(isLoggedInUser({})).toEqual(false);

        expect(canSeeLearningResourcesPage(null)).toEqual(false);

        expect(canSeeLearningResourcesPanel({ id: 's123456', user_group: 'REMRHD' })).toEqual(false);
        expect(
            canSeeLearningResourcesPanel({
                id: 's123456',
                user_group: 'REMRHD',
                current_classes: [{ SUBJECT: 'RSCH' }],
            }),
        ).toEqual(false);

        expect(canSeeReadPublish({ id: 'uqa1', user_group: 'STAFF' })).toEqual(true);
        expect(canSeeReadPublish({ id: 'uqa1', user_group: 'UG' })).toEqual(false);

        expect(canSeeTrainingPanel({ id: 'uqa1', user_group: 'ICTE' })).toEqual(true);
        expect(canSeeTrainingPanel({ id: 'uqa1', user_group: 'ALUMNI' })).toEqual(false);

        expect(canSeeEndnoteReferencing({ id: 'uqa1', user_group: 'CWPG' })).toEqual(true);
        expect(canSeeEndnoteReferencing({ id: 'uqa1', user_group: 'HOSP' })).toEqual(false);

        expect(isLibraryStaff({ id: 'uqa1', user_group: 'LIBRARYSTAFFB' })).toEqual(true);
        expect(isLibraryStaff({ id: 'uqa1', user_group: 'STAFF' })).toEqual(false);

        expect(isStaff({ id: 'uqa1', user_group: 'LIBRARYSTAFFB' })).toEqual(true);
        expect(isStaff({ id: 'uqa1', user_group: 'STAFF' })).toEqual(true);
        expect(isStaff({ id: 'uqa1', user_group: 'UG' })).toEqual(false);

        expect(isUQOnlyUser({ id: 'uqa1', user_group: 'STAFF' })).toEqual(true);
        expect(isUQOnlyUser({ id: 'uqa1', user_group: 'COMMU' })).toEqual(false);

        expect(
            isDlorAdminUser({
                id: 'uqa1',
                groups: ['CN=lib_dlor_admins,OU=lib-libapi-groups,DC=uq,DC=edu,DC=au'],
            }),
        ).toEqual(true);
        expect(
            isDlorAdminUser({
                id: 'uqa1',
                groups: ['CN=lib_dlor_admins,OU=lib-libapi-groups,DC=uq,DC=edu,DC=au'],
                masqueradingId: 'uqm1',
            }),
        ).toEqual(false);
        expect(isDlorAdminUser({ id: 'uqa1', groups: ['CN=othergroup'] })).toEqual(false);

        expect(isDlorOwner({ id: 'uqa1' }, { owner: { publishing_user_username: 'uqa1' } })).toEqual(true);
        expect(isDlorOwner({ id: 'uqa1' }, { owner: { publishing_user_username: 'uqa2' } })).toEqual(false);

        expect(isInDLOROwningTeam(null, { object_owning_team_id: 1 }, [])).toEqual(false);
        expect(isInDLOROwningTeam({ id: 'uqa1' }, null, [])).toEqual(false);
        expect(
            isInDLOROwningTeam(
                { id: 'uqa1' },
                { object_owning_team_id: null, owner: { publishing_user_username: 'uqa2' } },
                [],
            ),
        ).toEqual(false);
        expect(
            isInDLOROwningTeam(
                { id: 'uqa1' },
                { object_owning_team_id: 3, owner: { publishing_user_username: 'uqa2' } },
                [{ team_id: 2, team_members: [{ team_admin_username: 'uqa1' }] }],
            ),
        ).toEqual(undefined);
        expect(
            isInDLOROwningTeam(
                { id: 'uqa1' },
                { object_owning_team_id: 3, owner: { publishing_user_username: 'uqa2' } },
                [{ team_id: 3, team_members: [] }],
            ),
        ).toEqual(false);

        expect(
            isADlorTeamMember({ id: 'uqa1' }, [
                { team_id: 1, team_members: [] },
                { team_id: 2, team_members: [{ team_admin_username: 'uqa1' }] },
            ]),
        ).toEqual(true);
        expect(
            isADlorTeamMember({ id: 'uqa1' }, [
                { team_id: 1, team_members: [] },
                { team_id: 2, team_members: [{ team_admin_username: 'uqa2' }] },
            ]),
        ).toEqual(false);

        expect(isHospitalUser({ id: 'uqa1', user_group: 'HOSP' })).toEqual(true);
        expect(isHospitalUser({ id: 'uqa1', user_group: 'STAFF' })).toEqual(false);
    });
});
