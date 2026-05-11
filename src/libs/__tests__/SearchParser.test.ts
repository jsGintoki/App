import SearchParser from '@libs/SearchParser';

describe('SearchParser', () => {
    it('should default to expense type when no defaultType is provided', () => {
        const parser = new SearchParser();
        const query = parser.parse('test');
        expect(query.type).toBe('expense');
    });

    it('should use expense-report type when defaultType is expense-report', () => {
        const parser = new SearchParser('expense-report');
        const query = parser.parse('test');
        expect(query.type).toBe('expense-report');
    });

    it('should override default type when user specifies type in query', () => {
        const parser = new SearchParser('expense-report');
        const query = parser.parse('type:expense test');
        expect(query.type).toBe('expense');
    });

    it('should preserve other query parameters', () => {
        const parser = new SearchParser('expense-report');
        const query = parser.parse('amount:>100 test');
        expect(query.type).toBe('expense-report');
        expect(query.amount).toBe('>100');
    });
});