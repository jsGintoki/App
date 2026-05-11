import {renderHook} from '@testing-library/react-hooks';
import useSearchBulkActions from '@hooks/useSearchBulkActions';
import {exportReportToPDF} from '@hooks/useExportActions';

jest.mock('@hooks/useExportActions', () => ({
    exportReportToPDF: jest.fn(),
}));

describe('useSearchBulkActions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should include Download as PDF option when exactly one report is selected', () => {
        const {result} = renderHook(() => useSearchBulkActions({
            selectedReports: [{reportID: '123'}],
            // other required props...
        }));

        const downloadOption = result.current.allOptions.find(
            (option) => option.value === CONST.REPORT.SECONDARY_ACTIONS.DOWNLOAD_PDF
        );
        expect(downloadOption).toBeDefined();
        expect(downloadOption?.shouldShow).toBe(true);
    });

    it('should not include Download as PDF option when multiple reports are selected', () => {
        const {result} = renderHook(() => useSearchBulkActions({
            selectedReports: [{reportID: '123'}, {reportID: '456'}],
            // other required props...
        }));

        const downloadOption = result.current.allOptions.find(
            (option) => option.value === CONST.REPORT.SECONDARY_ACTIONS.DOWNLOAD_PDF
        );
        expect(downloadOption).toBeUndefined();
    });

    it('should call exportReportToPDF when Download as PDF action is triggered', () => {
        const {result} = renderHook(() => useSearchBulkActions({
            selectedReports: [{reportID: '123'}],
            // other required props...
        }));

        result.current.handleBulkAction(CONST.REPORT.SECONDARY_ACTIONS.DOWNLOAD_PDF);
        expect(exportReportToPDF).toHaveBeenCalledWith('123');
    });

    it('should not call exportReportToPDF when multiple reports are selected', () => {
        const {result} = renderHook(() => useSearchBulkActions({
            selectedReports: [{reportID: '123'}, {reportID: '456'}],
            // other required props...
        }));

        result.current.handleBulkAction(CONST.REPORT.SECONDARY_ACTIONS.DOWNLOAD_PDF);
        expect(exportReportToPDF).not.toHaveBeenCalled();
    });
});