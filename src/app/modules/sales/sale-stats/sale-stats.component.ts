import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { SelectItem, ConfirmationService } from "primeng/api";
import { datefilter } from "src/app/Helper/datefilter";
import { vaplongapi } from "src/app/Service/vaplongapi.service";
import { FilterRequestModel } from "src/app/Helper/models/FilterRequestModel";
import { DatePipe } from "@angular/common";

import { untilDestroyed } from "src/app/shared/services/until-destroy";
import { NotificationService } from "../../shell/services/notification.service";
import { NotificationEnum } from "src/app/shared/Enum/notification.enum";
import { StorageService } from "src/app/shared/services/storage.service";

@Component({
  selector: "app-sale-stats",
  templateUrl: "./sale-stats.component.html",
  styleUrls: ["./sale-stats.component.scss"],
  providers: [DatePipe, ConfirmationService],
})
export class SaleStatsComponent implements OnInit, OnDestroy {
  AllSalelist: any[];

  selectedSale;
  SearchByDateDropdown: SelectItem[];
  selectedSearchByDateID = "";
  selectedSearchByDateIdPie = "";
  IsSpinner = false;
  loading: boolean;
  first = 0;
  rows = 25;
  // last = 25;
  totalRecords = 0;

  dateForDD: any;
  isCustomDate = false;
  isPieCustomDate = false;
  fromDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");
  toDate = this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss");

  statsSalesIncTax = 0;
  statsSalesExTax = 0;
  statsSalesTax = 0;
  statsRefunds = 0;
  statsRefundCogs = 0;
  statsRefundTax = 0;
  statsCogs = 0;
  statsGrossProfit = 0;
  lineSaleChartdata: any = {
    datasets: [],
    labels: [],
  };
  pieSaleChartData: any = {
    datasets: [],
    labels: [],
  };
  months: any = [];
  SearchByYearsDropdown: any[] = [];
  lineFromDate: Date;
  lineToDate: Date;
  yearList: any = [];
  currentYear: number;
  filterRequestModelPieChart: FilterRequestModel;
  filterRequestModelLineChart: FilterRequestModel;
  usermodel: any;
  constructor(
    private apiService: vaplongapi,
    private datepipe: DatePipe,
    private notificationService: NotificationService,
    private storageService: StorageService
  ) {
    this.lineFromDate = new Date();
    this.lineToDate = new Date();
    this.usermodel = this.storageService.getItem("UserModel");

    const obj = {
      Action: "View",
      Description: `View Sale Statistics`,
      PerformedAt: new Date().toISOString(),
      UserID: this.usermodel.ID,
    };
    this.apiService
      .SaveActivityLog(obj)
      .toPromise()
      .then((x) => {});
  }

  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.GetSearchByDateDropDownList();
    this.getSaleStats(0);
    this.currentYear = new Date().getFullYear();

    for (let index = this.currentYear + 1; index > 1990; index--) {
      this.yearList.push({ label: index });
    }
    this.filterRequestModelLineChart = new FilterRequestModel(
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      new Date(),
      new Date(),
      1000,
      0,
      true,
      true,
      -1,
      -1,
      -1,
      true,
      true,
      true,
      "",
      "",
      true,
      true,
      -1,
      -1,
      true,
      true,
      "",
      "",
      "",
      0
    );
    this.filterRequestModelPieChart = new FilterRequestModel(
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      new Date(),
      new Date(),
      1000,
      0,
      true,
      true,
      -1,
      -1,
      -1,
      true,
      true,
      true,
      "",
      "",
      true,
      true,
      -1,
      -1,
      true,
      true,
      "",
      "",
      "",
      0
    );
    this.GetAnnualDashboardStatsForSale();
    this.GetTopProductBySaleForDashboard();
  }

  GetSearchByDateDropDownList() {
    this.SearchByDateDropdown = [];

    this.SearchByDateDropdown.push({ value: "0", label: "Today" });
    this.SearchByDateDropdown.push({ value: "1", label: "Yesterday" });
    this.SearchByDateDropdown.push({ value: "2", label: "Last7Days" });
    this.SearchByDateDropdown.push({ value: "3", label: "Last30Days" });
    this.SearchByDateDropdown.push({ value: "4", label: "ThisMonth" });
    this.SearchByDateDropdown.push({ value: "5", label: "LastMonth" });
    // this.SearchByDateDropdown.push({ value: '6', label: 'All' });
    this.SearchByDateDropdown.push({ value: "7", label: "Custom" });
    this.selectedSearchByDateID = "0";
    this.selectedSearchByDateIdPie = "0";
  }
  SearchByDate(event: any) {
    if (event.value === "7") {
      this.isCustomDate = true;
    } else {
      this.getSaleStats(this.selectedSearchByDateID);
    }
  }
  selectValue(newValue: any) {
    this.isCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;
    this.getSaleStats(7);
  }
  onChangeDate(event: any) {
    this.getSaleStats(event.value);
  }
  getSaleStats(dateId) {
    this.IsSpinner = true;
    const filterRequestModel = new FilterRequestModel();

    filterRequestModel.FromDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")
    );
    filterRequestModel.ToDate = new Date(
      this.datepipe.transform(new Date(), "yyyy-MM-ddTHH:mm:ss")
    );
    // filterRequestModel.SubCategoryID = 0;
    filterRequestModel.PageNo = 0;
    filterRequestModel.PageSize = 10000;
    filterRequestModel.IsGetAll = false;

    dateId = Number(dateId);
    if (dateId !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(dateId);
      filterRequestModel.IsGetAll = daterequest.IsGetAll;
      filterRequestModel.ToDate = new Date(
        this.datepipe.transform(daterequest.ToDate, "yyyy-MM-ddTHH:mm:ss")
      );
      filterRequestModel.FromDate = new Date(
        this.datepipe.transform(daterequest.FromDate, "yyyy-MM-ddTHH:mm:ss")
      );
    } else {
      filterRequestModel.IsGetAll = false;
      filterRequestModel.ToDate = new Date(
        this.datepipe.transform(this.toDate, "yyyy-MM-ddTHH:mm:ss")
      );
      filterRequestModel.FromDate = new Date(
        this.datepipe.transform(this.fromDate, "yyyy-MM-ddTHH:mm:ss")
      );
    }
    const singleproductprice = 0;
    this.apiService
      .GetSaleDashboardReportByFilters(filterRequestModel)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          this.statsGrossProfit = response.GrossProfit;
          this.statsSalesIncTax = response.TotalSaleIncludedTax;
          this.statsSalesExTax = response.TotalSaleExcludedTax;
          this.statsSalesTax = response.TotalTax_Sale;
          this.statsCogs = response.COGS;
          this.statsRefundCogs = response.COGS_Refund;
          this.statsRefunds = response.TotalRefunds;
          this.statsRefundTax = response.TotalTax_Refund;
          this.IsSpinner = false;
        } else {
          this.IsSpinner = false;
          this.notificationService.notify(
            NotificationEnum.ERROR,
            "error",
            "Internal Server Error! not getting api data"
          );
          // console.log('internal server error ! not getting api data');
        }
      });
  }
  onChangeDates(event: any) {
    if (event.value === "7") {
      this.isPieCustomDate = true;
    } else {
      this.GetTopProductBySaleForDashboard();
    }
  }
  changeyear(event) {
    if (event) {
      this.currentYear = event.label;
      this.GetAnnualDashboardStatsForSale();
    }
  }

  selectValues(newValue: any) {
    this.isPieCustomDate = false;
    this.fromDate = newValue.fromDate;
    this.toDate = newValue.toDate;

    this.GetTopProductBySaleForDashboard();
  }
  GetTopProductBySaleForDashboard() {
    if (Number(this.selectedSearchByDateIdPie) !== 7) {
      const daterequest = datefilter.GetDateRangeByDropdown(
        Number(this.selectedSearchByDateIdPie)
      );
      this.filterRequestModelPieChart.IsGetAll = daterequest.IsGetAll;
      this.filterRequestModelPieChart.ToDate = new Date(
        this.datepipe.transform(daterequest.ToDate, "yyyy-MM-ddTHH:mm:ss")
      );
      this.filterRequestModelPieChart.FromDate = new Date(
        this.datepipe.transform(daterequest.FromDate, "yyyy-MM-ddTHH:mm:ss")
      );
    } else {
      this.filterRequestModelPieChart.IsGetAll = false;
      this.filterRequestModelPieChart.ToDate = new Date(
        this.datepipe.transform(this.toDate, "yyyy-MM-ddTHH:mm:ss")
      );
      this.filterRequestModelPieChart.FromDate = new Date(
        this.datepipe.transform(this.fromDate, "yyyy-MM-ddTHH:mm:ss")
      );
    }
    // this.filterRequestModel.FromDate = new Date(new Date().setMonth(new Date().getMonth() - 11));
    this.apiService
      .GetTopProductBySaleForDashboard(this.filterRequestModelPieChart)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const topSaleProducts: any = [];
          const topSaleQuantity: any = [];
          response.TopProducts.forEach((element) => {
            topSaleProducts.push(element.Product);
            topSaleQuantity.push(element.Quantity);
          });
          this.pieSaleChartData = {
            labels: topSaleProducts,
            datasets: [
              {
                data: topSaleQuantity,
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#73D6B1",
                  "#7FEBC3",
                  "#06D6A0",
                  "#1B9AAA",
                  "#ff0018",
                  "#F78656",
                  "#AA8C49",
                  "#545454",
                ],
                hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#73D6B1",
                  "#7FEBC3",
                  "#06D6A0",
                  "#1B9AAA",
                  "#ff0018",
                  "#F78656",
                  "#AA8C49",
                  "#545454",
                ],
              },
            ],
          };
        }
      });
  }

  GetAnnualDashboardStatsForSale() {
    // .setFullYear(this.currentYear, 0, 1)
    const FromDate = new Date(Date.UTC(this.currentYear, 0, 1, 0, 0, 0));
    const TODate = new Date(Date.UTC(this.currentYear, 11, 31, 23, 59, 59));
    this.filterRequestModelLineChart.FromDate = FromDate;
    this.filterRequestModelLineChart.ToDate = TODate;

    this.apiService
      .GetAnnualDashboardStatsForSale(this.filterRequestModelLineChart)
      .pipe(untilDestroyed(this))
      .subscribe((response: any) => {
        if (response.ResponseCode === 0) {
          const months: any = [];
          const TotalOnlineOrders: any = [];
          const TotalRefunds: any = [];
          const TotalVaplongOrders: any = [];
          response.Stats.forEach((element, i) => {
            // if (i !== 0) {
            months.push(element.Month);
            TotalOnlineOrders.push(element.TotalOnlineOrders);
            TotalRefunds.push(element.TotalRefunds);
            TotalVaplongOrders.push(element.TotalVaplongOrders);
            // }
          });
          this.lineSaleChartdata = {
            labels: months,
            datasets: [
              {
                label: "Total Online Orders",
                data: TotalOnlineOrders,
                fill: false,
                borderColor: "#4bc0c0",
              },
              {
                label: "Total Refunds",
                data: TotalRefunds,
                fill: false,
                borderColor: "#FFCE56",
              },
              {
                label: "Total System Orders",
                data: TotalVaplongOrders,
                fill: false,
                borderColor: "#ff0018",
              },
            ],
          };
        }
      });
  }
  selectLineSaleChartdata(event) {
    // tslint:disable-next-line: max-line-length
    this.notificationService.notify(
      NotificationEnum.INFO,
      this.lineSaleChartdata.datasets[event.element._datasetIndex].label,
      this.lineSaleChartdata.datasets[event.element._datasetIndex].data[
        event.element._index
      ]
    );
  }
  selectPieSaleChartData(event) {
    // tslint:disable-next-line: max-line-length
    this.notificationService.notify(
      NotificationEnum.INFO,
      this.pieSaleChartData.labels[event.element._index],
      this.pieSaleChartData.datasets[event.element._datasetIndex].data[
        event.element._index
      ]
    );
  }
}
