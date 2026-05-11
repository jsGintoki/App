import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import MigratedUserWelcomeModalGuard from '@libs/Navigation/AppNavigator/MigratedUserWelcomeModalGuard';
import * as Navigation from '@libs/Navigation/Navigation';
import * as ReportUtils from '@libs/ReportUtils';
import ONYXKEYS from '@src/ONYXKEYS';
import ROUTES from '@src/ROUTES';

// Mock the Navigation module
jest.mock('@libs/Navigation/Navigation', () => ({
    navigate: jest.fn(),
}));

// Mock the ReportUtils module
jest.mock('@libs/ReportUtils', () => ({
    getLastVisitedPath: jest.fn(),
}));

// Mock the withOnyx HOC
jest.mock('react-native-onyx', () => ({
    withOnyx: (mapStateToProps: any) => (Component: any) => (props: any) => {
        const tryNewDot = {
            classicRedirect: {dismissed: false, timestamp: '2024-01-07'},
            nudgeMigration: {timestamp: '2024-01-07'},
        };
        return <Component {...props} tryNewDot={tryNewDot} />;
    },
}));

describe('MigratedUserWelcomeModalGuard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should navigate to the welcome modal when conditions are met', () => {
        render(<MigratedUserWelcomeModalGuard isAuthenticated={true} />);

        expect(Navigation.navigate).toHaveBeenCalledWith(ROUTES.WELCOME_MODAL);
    });

    it('should not navigate to the welcome modal when not authenticated', () => {
        render(<MigratedUserWelcomeModalGuard isAuthenticated={false} />);

        expect(Navigation.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to the report page after welcome modal is dismissed', async () => {
        // Mock getLastVisitedPath to return a specific report path
        (ReportUtils.getLastVisitedPath as jest.Mock).mockReturnValue('/report/12345');

        const {rerender} = render(<MigratedUserWelcomeModalGuard isAuthenticated={true} />);

        // Simulate the welcome modal being dismissed by updating the tryNewDot state
        // This would happen when the user taps 'Let's go!'
        const updatedTryNewDot = {
            classicRedirect: {dismissed: true, timestamp: '2024-01-07'},
            nudgeMigration: {timestamp: '2024-01-07'},
        };

        rerender(<MigratedUserWelcomeModalGuard isAuthenticated={true} tryNewDot={updatedTryNewDot} />);

        await waitFor(() => {
            expect(Navigation.navigate).toHaveBeenCalledWith('/report/12345');
        });
    });

    it('should navigate to the default report page if no last visited path', async () => {
        // Mock getLastVisitedPath to return null
        (ReportUtils.getLastVisitedPath as jest.Mock).mockReturnValue(null);

        const {rerender} = render(<MigratedUserWelcomeModalGuard isAuthenticated={true} />);

        // Simulate the welcome modal being dismissed
        const updatedTryNewDot = {
            classicRedirect: {dismissed: true, timestamp: '2024-01-07'},
            nudgeMigration: {timestamp: '2024-01-07'},
        };

        rerender(<MigratedUserWelcomeModalGuard isAuthenticated={true} tryNewDot={updatedTryNewDot} />);

        await waitFor(() => {
            expect(Navigation.navigate).toHaveBeenCalledWith(ROUTES.REPORT);
        });
    });

    it('should not navigate to the welcome modal if already shown', () => {
        const {rerender} = render(<MigratedUserWelcomeModalGuard isAuthenticated={true} />);

        // First render should navigate to welcome modal
        expect(Navigation.navigate).toHaveBeenCalledWith(ROUTES.WELCOME_MODAL);

        // Clear the mock to check if it's called again
        (Navigation.navigate as jest.Mock).mockClear();

        // Rerender with the same props (simulating a re-render)
        rerender(<MigratedUserWelcomeModalGuard isAuthenticated={true} />);

        // Should not navigate again
        expect(Navigation.navigate).not.toHaveBeenCalled();
    });
});