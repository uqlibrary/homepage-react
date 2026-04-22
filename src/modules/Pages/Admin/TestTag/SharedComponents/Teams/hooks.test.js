import { renderHook, act } from 'test-utils';

import { useAccountUser } from '../../helpers/hooks';
import useTeams, { createFilter } from './hooks';

jest.mock('../../helpers/hooks', () => ({
    useAccountUser: jest.fn(),
}));

describe('SwitchIncludeAllTeams hooks', () => {
    const mockUserTeam = 'WSS';

    beforeEach(() => {
        useAccountUser.mockReturnValue({
            user: { user_team: mockUserTeam },
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createFilter', () => {
        it('should return all_teams filter when value is truthy', () => {
            expect(createFilter(true)).toEqual({ all_teams: true });
        });

        it('should return empty object when value is falsy', () => {
            expect(createFilter(false)).toEqual({});
        });

        it('should return empty object when value is undefined', () => {
            expect(createFilter(undefined)).toEqual({});
        });
    });

    describe('useTeams', () => {
        const defaultProps = {
            assetTeamSlug: 'WSS',
            searchTerm: 'test',
            actions: {
                clearAssets: jest.fn(),
                loadAssets: jest.fn(),
            },
        };

        const setup = (testProps = {}) => {
            const props = { ...defaultProps, ...testProps };
            if (props.actions) {
                props.actions = { ...defaultProps.actions, ...props.actions };
            }
            return renderHook(() => useTeams(props));
        };

        it('should return initial state', () => {
            const { result } = setup();

            expect(result.current.allTeams).toBeUndefined();
            expect(result.current.includeAllTeams).toEqual({});
            expect(typeof result.current.setAllTeams).toBe('function');
            expect(typeof result.current.onAllTeamsChange).toBe('function');
        });

        it('should return all_teams filter when allTeams is set to true', () => {
            const { result } = setup();

            act(() => {
                result.current.setAllTeams(true);
            });

            expect(result.current.includeAllTeams).toEqual({ all_teams: true });
            expect(result.current.allTeams).toBe(true);
        });

        it('should return empty filter when allTeams is set to false', () => {
            const { result } = setup();

            act(() => {
                result.current.setAllTeams(false);
            });

            expect(result.current.includeAllTeams).toEqual({});
            expect(result.current.allTeams).toBe(false);
        });

        describe('onAllTeamsChange', () => {
            it('should call loadAssets with filters when searchTerm is defined', () => {
                const { result } = setup();

                act(() => {
                    result.current.onAllTeamsChange(true);
                });

                expect(defaultProps.actions.loadAssets).toHaveBeenCalledWith('test', { all_teams: true });
            });

            it('should merge additionalFilters with base filters', () => {
                const { result } = setup();

                act(() => {
                    result.current.onAllTeamsChange(true, {
                        additionalFilters: { site_id: 1 },
                    });
                });

                expect(defaultProps.actions.loadAssets).toHaveBeenCalledWith('test', { all_teams: true, site_id: 1 });
            });

            it('should call clearAssets when value is false and asset team differs from user team', () => {
                const { result } = setup({ assetTeamSlug: 'Other-Team' });

                act(() => {
                    result.current.onAllTeamsChange(false);
                });

                expect(defaultProps.actions.clearAssets).toHaveBeenCalled();
                expect(defaultProps.actions.loadAssets).not.toHaveBeenCalled();
            });

            it('should not call clearAssets when disableAssetClearing is true', () => {
                const { result } = setup({ assetTeamSlug: 'Other-Team' });

                act(() => {
                    result.current.onAllTeamsChange(false, { disableAssetClearing: true });
                });

                expect(defaultProps.actions.clearAssets).not.toHaveBeenCalled();
            });

            it('should call loadAssets when value is false but asset team matches user team', () => {
                const { result } = setup({ assetTeamSlug: mockUserTeam });

                act(() => {
                    result.current.onAllTeamsChange(false);
                });

                expect(defaultProps.actions.clearAssets).not.toHaveBeenCalled();
                expect(defaultProps.actions.loadAssets).toHaveBeenCalledWith('test', {});
            });

            it('should not call clearAssets or loadAssets when searchTerm is undefined and team matches', () => {
                const { result } = setup({ searchTerm: undefined });

                act(() => {
                    result.current.onAllTeamsChange(true);
                });

                expect(defaultProps.actions.clearAssets).not.toHaveBeenCalled();
                expect(defaultProps.actions.loadAssets).not.toHaveBeenCalled();
            });

            it('should handle missing clearAssets gracefully', () => {
                const { result } = setup({
                    assetTeamSlug: 'Other-Team',
                    actions: { clearAssets: undefined, loadAssets: jest.fn() },
                });

                expect(() => {
                    act(() => {
                        result.current.onAllTeamsChange(false);
                    });
                }).not.toThrow();
            });
        });
    });
});
