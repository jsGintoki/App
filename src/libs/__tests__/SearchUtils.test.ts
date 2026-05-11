import {getSearchContextFromRoute} from '@libs/SearchUtils';
import ROUTES from '@src/ROUTES';

describe('getSearchContextFromRoute', () => {
    it('should return expense for expenses route', () => {
        const context = getSearchContextFromRoute(ROUTES.EXPENSES);
        expect(context).toBe('expense');
    });

    it('should return expense-report for reports route', () => {
        const context = getSearchContextFromRoute(ROUTES.REPORTS);
        expect(context).toBe('expense-report');
    });

    it('should return expense for unknown routes', () => {
        const context = getSearchContextFromRoute('/unknown');
        expect(context).toBe('expense');
    });
});