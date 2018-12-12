import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import * as moment from 'moment';
import { WarehouseService } from './../../warehouse.service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ProductsService } from 'app/admin/products.service';
import * as _ from 'lodash'
@Component({
  selector: 'wm-monthly-report',
  templateUrl: './monthly-report.component.html',
  styleUrls: ['./monthly-report.component.css']
})
export class MonthlyReportComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  jwtHelper: JwtHelper = new JwtHelper();

  date = new Date();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();
  dataYear = [];
  token: any;
  isPreview = false;
  warehouses: any = [];
  warehouseId = 0;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  genericTypeSelect:any =[]
  genericTypes = [];
  constructor(
    @Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private alertService: AlertService,
    private productService: ProductsService,

  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
  }

  ngOnInit() {
    this.getdate();
    // this.getWarehouseList();
    const date = new Date();
   
  }
  refreshWaiting(state) {
    this.getGenericsType();
  }
  async getGenericsType() {
    try {
      const rs = await this.productService.getGenericType();
      if (rs.ok) {
        this.genericTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }
  monthlyReport() {
    let type = _.map(this.genericTypeSelect,function(v){
      return 'genericTypes='+v.generic_type_id;
    })
    const url = `${this.apiUrl}/report/monthlyReport?month=${this.month}&year=${this.year}&`+type.join('&')+`&token=${this.token}`
    console.log(url);
    this.htmlPreview.showReport(url);
  }

  monthlyReportExcel() {
    let type = _.map(this.genericTypeSelect,function(v){
      return 'genericTypes='+v.generic_type_id;
    })
    const url = `${this.apiUrl}/report/monthlyReport/excel?month=${this.month}&year=${this.year}&`+type.join('&')+`&token=${this.token}`
    window.open(url);
  }

  getdate() {
    for (let i = 0; i < 10; i++) {
      this.dataYear.push(this.date.getFullYear() - i)
    }
  }

  // getWarehouseList() {
  //   this.warehouseService.all()
  //     .then((result: any) => {
  //       if (result.ok) {
  //         this.warehouses = result.rows;
  //       } else {
  //         this.alertService.error(JSON.stringify(result.error));
  //       }
  //     });
  // }

}