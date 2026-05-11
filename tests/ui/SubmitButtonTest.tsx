import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SubmitButton from '@src/components/SubmitButton';
import {OnyxProvider} from 'react-native-onyx';
import ONYXKEYS from '@src/ONYXKEYS';

jest.mock('@src/libs/actions/Report');

describe('SubmitButton', () => {
    const mockOnSubmit = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show loading state when report is loading', () => {
        const {getByText, getByRole} = render(
            <OnyxProvider>
                <SubmitButton
                    reportID="123"
                    isSubmitting={false}
                    onSubmit={mockOnSubmit}
                />
            </OnyxProvider>
        );
        
        // Simulate loading state via Onyx
        Onyx.merge(`${ONYXKEYS.COLLECTION.REPORT}123`, {isLoading: true});
        
        expect(getByText('Submitting...')).toBeTruthy();
        expect(getByRole('button')).toBeDisabled();
    });

    it('should call onSubmit when pressed and not loading', () => {
        const {getByText} = render(
            <OnyxProvider>
                <SubmitButton
                    reportID="123"
                    isSubmitting={false}
                    onSubmit={mockOnSubmit}
                />
            </OnyxProvider>
        );
        
        fireEvent.press(getByText('Submit'));
        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should not call onSubmit when loading', () => {
        const {getByText} = render(
            <OnyxProvider>
                <SubmitButton
                    reportID="123"
                    isSubmitting={false}
                    onSubmit={mockOnSubmit}
                />
            </OnyxProvider>
        );
        
        Onyx.merge(`${ONYXKEYS.COLLECTION.REPORT}123`, {isLoading: true});
        
        fireEvent.press(getByText('Submitting...'));
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });
});