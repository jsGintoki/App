import React from 'react';
import {render, screen} from '@testing-library/react-native';
import Onyx from 'react-native-onyx';
import BaseLoginForm from '@pages/signin/LoginForm/BaseLoginForm';
import ONYXKEYS from '@src/ONYXKEYS';
import CONST from '@src/CONST';

jest.mock('@hooks/useLocalize', () => ({
    __esModule: true,
    default: () => ({
        translate: (key: string) => {
            const translations: Record<string, string> = {
                'loginForm.magicCode': 'Magic code',
                'loginForm.magicCodeCaution': 'This code will expire in 10 minutes. Do not share it with anyone.',
            };
            return translations[key] || key;
        },
    }),
}));

jest.mock('@hooks/useNetwork', () => ({
    __esModule: true,
    default: () => ({isOffline: false}),
}));

jest.mock('@hooks/useResponsiveLayout', () => ({
    __esModule: true,
    default: () => ({shouldUseNarrowLayout: false}),
}));

jest.mock('@hooks/useThemeStyles', () => ({
    __esModule: true,
    default: () => ({
        mt3: {marginTop: 12},
        mt2: {marginTop: 8},
        ml2: {marginLeft: 8},
        flexRow: {flexDirection: 'row'},
        alignItemsCenter: {alignItems: 'center'},
        flexShrink1: {flexShrink: 1},
        textLabelSupporting: {color: '#666'},
        iconWarning: {fill: '#FFB800'},
    }),
}));

jest.mock('@components/Icon', () => 'Icon');
jest.mock('@components/Icon/Expensicons', () => ({Exclamation: 'Exclamation'}));
jest.mock('@components/Text', () => 'Text');
jest.mock('@components/TextInput', () => 'TextInput');
jest.mock('@components/DotIndicatorMessage', () => 'DotIndicatorMessage');
jest.mock('@components/FormAlertWithSubmitButton', () => 'FormAlertWithSubmitButton');
jest.mock('@components/SignInButtons/AppleSignIn', () => 'AppleSignIn');
jest.mock('@components/SignInButtons/GoogleSignIn', () => 'GoogleSignIn');
jest.mock('@components/withToggleVisibilityView', () => (Component: React.ComponentType) => Component);

jest.mock('@pages/signin/SignInLoginContext', () => ({
    useLoginState: () => ({login: ''}),
    useLoginActions: () => ({setLogin: jest.fn()}),
}));

jest.mock('@userActions/Session', () => ({
    beginSignIn: jest.fn(),
    clearAccountMessages: jest.fn(),
    clearSignInData: jest.fn(),
}));

jest.mock('@userActions/CloseAccount', () => ({
    setDefaultData: jest.fn(),
}));

jest.mock('@libs/Browser', () => ({isMobileWebKit: false}));
jest.mock('@libs/canFocusInputOnScreenFocus', () => false);
jest.mock('@libs/ErrorUtils', () => ({getLatestErrorMessage: () => ''}));
jest.mock('@libs/isInputAutoFilled', () => false);
jest.mock('@libs/LoginUtils', () => ({appendCountryCode: (v: string) => v, getPhoneNumberWithoutSpecialChars: (v: string) => v}));
jest.mock('@libs/PhoneNumber', () => ({parsePhoneNumber: () => ({number: {national: ''}})}));
jest.mock('@libs/StringUtils', () => ({isEmptyString: (v: string) => v === ''}));
jest.mock('@libs/ValidationUtils', () => ({isNumericWithSpecialChars: () => false, isValidEmailWithTLD: () => false}));
jest.mock('@libs/Visibility', () => ({isVisible: () => true}));

jest.mock('@src/CONFIG', () => ({EXPENSIFY: {EXPENSIFY_CASH_REFERRER: ''}}));
jest.mock('@src/CONST', () => ({
    DEFAULT_COUNTRY_CODE: 'US',
    KEYBOARD_TYPE: {DEFAULT: 'default'},
}));

jest.mock('@src/types/utils/htmlDivElementRef', () => ({}));
jest.mock('@src/types/utils/viewRef', () => ({}));

describe('BaseLoginForm', () => {
    beforeAll(() => {
        Onyx.init({keys: ONYXKEYS});
    });

    beforeEach(() => {
        Onyx.clear();
    });

    it('should display caution message when requiresTwoFactorAuth is true', async () => {
        await Onyx.merge(ONYXKEYS.ACCOUNT, {
            requiresTwoFactorAuth: true,
            validated: false,
            isLoading: false,
        });

        render(<BaseLoginForm />);

        expect(screen.getByText('This code will expire in 10 minutes. Do not share it with anyone.')).toBeTruthy();
    });

    it('should not display caution message when requiresTwoFactorAuth is false', async () => {
        await Onyx.merge(ONYXKEYS.ACCOUNT, {
            requiresTwoFactorAuth: false,
            validated: false,
            isLoading: false,
        });

        render(<BaseLoginForm />);

        expect(screen.queryByText('This code will expire in 10 minutes. Do not share it with anyone.')).toBeNull();
    });
});