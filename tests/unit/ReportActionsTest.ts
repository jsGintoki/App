import {submitReport} from '@src/libs/actions/Report';
import * as ReportConnection from '@src/libs/ReportConnection';
import * as API from '@src/libs/API';
import * as ReportUtils from '@src/libs/ReportUtils';

jest.mock('@src/libs/ReportConnection');
jest.mock('@src/libs/API');
jest.mock('@src/libs/ReportUtils');

describe('submitReport', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should set loading state when DEW is enabled', () => {
        const reportID = '123';
        const mockReport = {id: reportID, isDEWEnabled: true};
        
        (ReportUtils.getReport as jest.Mock).mockReturnValue(mockReport);
        (ReportUtils.isDEWEnabled as jest.Mock).mockReturnValue(true);
        (API.write as jest.Mock).mockResolvedValue({success: true});
        
        submitReport(reportID);
        
        expect(ReportConnection.updateReport).toHaveBeenCalledWith(reportID, {
            isLoading: true,
        });
        expect(ReportConnection.updateReport).not.toHaveBeenCalledWith(
            expect.objectContaining({status: 'Submitted'})
        );
    });

    it('should update to Submitted after successful DEW validation', async () => {
        const reportID = '123';
        const mockReport = {id: reportID, isDEWEnabled: true};
        
        (ReportUtils.getReport as jest.Mock).mockReturnValue(mockReport);
        (ReportUtils.isDEWEnabled as jest.Mock).mockReturnValue(true);
        (API.write as jest.Mock).mockResolvedValue({success: true});
        
        await submitReport(reportID);
        
        expect(ReportConnection.updateReport).toHaveBeenLastCalledWith(reportID, {
            status: 'Submitted',
            isLoading: false,
        });
    });

    it('should revert to previous state when DEW validation fails', async () => {
        const reportID = '123';
        const mockReport = {id: reportID, isDEWEnabled: true};
        
        (ReportUtils.getReport as jest.Mock).mockReturnValue(mockReport);
        (ReportUtils.isDEWEnabled as jest.Mock).mockReturnValue(true);
        (API.write as jest.Mock).mockResolvedValue({success: false, message: 'Blocked'});
        
        await submitReport(reportID);
        
        expect(ReportConnection.updateReport).toHaveBeenLastCalledWith(reportID, {
            isLoading: false,
        });
        expect(ReportConnection.updateReport).not.toHaveBeenCalledWith(
            expect.objectContaining({status: 'Submitted'})
        );
    });

    it('should optimistically update to Submitted when DEW is not enabled', () => {
        const reportID = '123';
        const mockReport = {id: reportID, isDEWEnabled: false};
        
        (ReportUtils.getReport as jest.Mock).mockReturnValue(mockReport);
        (ReportUtils.isDEWEnabled as jest.Mock).mockReturnValue(false);
        
        submitReport(reportID);
        
        expect(ReportConnection.updateReport).toHaveBeenCalledWith(reportID, {
            status: 'Submitted',
            isLoading: false,
        });
    });
});