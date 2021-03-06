import { SelectGenericTypeComponent } from './../../../directives/select-generic-type/select-generic-type.component';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import * as moment from 'moment';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import { BasicService } from '../../../basic.service';

@Component({
  selector: 'wm-product-expired',
  templateUrl: './product-expired.component.html',
  styleUrls: ['./product-expired.component.css']
})
export class ProductExpiredComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  @ViewChild('selectGenericType') public selectGenericType: SelectGenericTypeComponent;
  startDate: any;
  endDate: any;
  warehouses: any = [];
  warehouseId = 0;
  isPreview = false;
  selectedGenericId = 0;
  selectedProductGroups: any = [];
  productGroups: any = []
  token: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  genericTypeId;
  options: any;

  constructor(@Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private basicService: BasicService,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token')
    this.options = {
      pdfOpenParams: { toolbar: '1' },
      height: "450px"
    };
  }

  ngOnInit() {
    const date = new Date();

    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.endDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    this.getProductGroups();
    this.getWarehouseList();
  }

  showReport() {
    let generic_type_id: any = [];
    this.selectedProductGroups.forEach(v => {
      generic_type_id.push("genericTypeId=" + v.generic_type_id);
    });

    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/product/expired/${startDate}/${endDate}/${this.warehouseId}/${this.selectedGenericId}?token=${this.token}&` + generic_type_id.join('&');
    this.htmlPreview.showReport(url, 'landscape');
  }
  getWarehouseList() {
    this.warehouseService.all()
      .then((result: any) => {
        if (result.ok) {
          this.warehouses = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
      });
  }
  setSelectedGeneric(generic) {
    this.selectedGenericId = generic.generic_id;
  }
  changeSearchGeneric(generic) {
    this.selectedGenericId = generic.generic_id;
  }
  refresh() {
    this.selectedGenericId = 0;
    this.warehouseId = 0;
    this.searchGenericCmp.clearSearch();
  }

  setSelectedGenericType(e) {
    this.genericTypeId = e.generic_type_id;
  }

  async getProductGroups() {
    try {
      const rs: any = await this.basicService.getGenericTypes();
      if (rs.ok) {
        this.productGroups = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }
}
