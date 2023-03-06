import { FilterRequestModel } from '../Helper/models/FilterRequestModel';
export class datefilter {
    static GetDateRangeByDropdown(index) {
        const request: FilterRequestModel = Object();
        const currentDate = new Date();
        if (index === 0) {
            request.IsGetAll = false;
            request.ToDate = new Date();
            request.FromDate = new Date();
        }
        else if (index === 1) {
            request.IsGetAll = false;
            request.ToDate = new Date();
            request.FromDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
        }
        else if (index === 2) {
            request.IsGetAll = false;
            request.ToDate = new Date();
            request.FromDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        }
        else if (index === 3) {
            request.IsGetAll = false;
            request.ToDate = new Date();
            request.FromDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
        }
        else if (index === 4) {
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            request.IsGetAll = false;
            request.ToDate = new Date();
            request.FromDate = startDate;
        }
        else if (index === 5) {
            const firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            request.IsGetAll = false;
            request.ToDate = lastDate;
            request.FromDate = firstDate;
        }
        else if (index === 6) {
            request.IsGetAll = true;
            request.ToDate = new Date();
            request.FromDate = new Date();
        }

        return request;
    }
}
