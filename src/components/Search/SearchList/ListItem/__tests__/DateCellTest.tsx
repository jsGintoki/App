import React from 'react';
import {render} from '@testing-library/react-native';
import DateCell from '../DateCell';

jest.mock('@hooks/useThemeStyles', () => () => ({
    lineHeightLarge: {lineHeight: 20},
    pre: {fontFamily: 'monospace'},
    justifyContentCenter: {justifyContent: 'center'},
    mutedNormalTextLabel: {color: 'gray'},
    flexShrink1: {flexShrink: 1},
}));

describe('DateCell', () => {
    it('renders formatted date when no displayText is provided', () => {
        const {getByText} = render(
            <DateCell
                date="2024-01-15"
                showTooltip={false}
                isLargeScreenWidth={false}
            />
        );
        expect(getByText('Jan 15')).toBeTruthy();
    });

    it('renders displayText when provided', () => {
        const {getByText} = render(
            <DateCell
                date="2024-01-15"
                showTooltip={false}
                isLargeScreenWidth={false}
                displayText="Scanning"
            />
        );
        expect(getByText('Scanning')).toBeTruthy();
    });

    it('renders displayText with suffix when both provided', () => {
        const {getByText} = render(
            <DateCell
                date="2024-01-15"
                showTooltip={false}
                isLargeScreenWidth={false}
                suffixText="Receipt"
                displayText="Scanning"
            />
        );
        expect(getByText('Scanning')).toBeTruthy();
    });
});