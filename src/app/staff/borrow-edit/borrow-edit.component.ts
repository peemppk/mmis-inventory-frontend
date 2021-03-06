import { Router, ActivatedRoute } from '@angular/router';
import { BorrowItemsService } from './../borrow-items.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../alert.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { SearchPeopleAutoCompleteComponent } from '../../directives/search-people-autocomplete/search-people-autocomplete.component';
import { SearchGenericAutocompleteComponent } from '../../directives/search-generic-autocomplete/search-generic-autocomplete.component';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'wm-borrow-edit',
  templateUrl: './borrow-edit.component.html',
  styleUrls: []
})
export class BorrowEditComponent implements OnInit {

  @ViewChild('locationList') locationList;
  @ViewChild('modalLoading') private modalLoading;
  @ViewChild('elSearchPeople') elSearchPeople: SearchPeopleAutoCompleteComponent;
  @ViewChild('elSearchGeneric') elSearchGeneric: SearchGenericAutocompleteComponent;

  lots = [];
  generics = [];
  loading = false;
  isLoading = false;
  locations: any = [];
  locationId: any;

  srcWarehouseId: string;
  dstWarehouseId: string;
  borrowDate: any;

  // selectedProductId: any;
  selectedProduct: any;
  selectedLot: any;
  selectedUnit: any;
  // selectedLotId: any;
  expiredDate: any;
  remainQty = 0;
  conversionQty = 0;
  borrowQty = 0;
  wmProductId: any;
  workingCode: any;
  isSaving = false;
  disableSave = false;
  peopleId: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  // @ViewChild('lotList') public lotList;
  @ViewChild('unitList') public unitList;
  @ViewChild('productSearch') public productSearch;

  primaryUnitName: any;
  primaryUnitId: any;
  productId: any;
  productName: any;
  genericName: any;
  genericId: any;
  unitGenericId: any;
  lotNo: any;
  remark: any;

  borrowId: any;

  constructor(
    private alertService: AlertService,
    private borrowItemsService: BorrowItemsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams
      .subscribe(params => {
        this.borrowId = params.borrowId;
      });
  }

  async ngOnInit() {
    const date = new Date();
    await this.getSummaryInfo();
    await this.getDetailInfo();
  }

  async getSummaryInfo() {
    try {
      this.modalLoading.show();
      const rs: any = await this.borrowItemsService.getSummaryInfo(this.borrowId);

      if (rs.ok) {
        if (rs.info.borrow_date) {
          this.borrowDate = {
            date: {
              year: moment(rs.info.borrow_date).get('year'),
              month: moment(rs.info.borrow_date).get('month') + 1,
              day: moment(rs.info.borrow_date).get('date')
            }
          }
        }

        const fullname = rs.info.fullname;
        this.elSearchPeople.setDefault(fullname);

        this.srcWarehouseId = rs.info.src_warehouse_id;
        this.dstWarehouseId = rs.info.dst_warehouse_id;
        this.remark = rs.info.remark;

        if (rs.info.confirmed === 'Y' || rs.info.approved === 'Y' || rs.info.mark_deleted === 'Y') {
          this.disableSave = true;
        }

      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
      console.error(error);
    }
  }

  setSelectedGeneric(event: any) {
    try {
      if (this.srcWarehouseId) {
        this.productId = event ? event.product_id : null;
        this.productName = event ? event.product_name : null;
        this.genericName = event ? event.generic_name : null;
        this.genericId = event ? event.generic_id : null;
        this.workingCode = event ? event.working_code : null;
        this.remainQty = event ? event.qty - event.reserve_qty : 0;
        this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
        this.primaryUnitId = event ? event.primary_unit_id : null;
        this.primaryUnitName = event ? event.primary_unit_name : null;
        // this.wmProductId = event ? event.wm_product_id : null;
        this.unitList.setGenericId(this.genericId);
        // this.getLots();
      } else {
        this.alertService.error('กรุณาเลือกคลังสินค้าต้นทาง และ ปลายทาง');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  onChangeSearchGeneric(event: any) {
    if (event) {
      this.clearForm();
    }
  }

  changeUnit(event: any) {
    try {
      this.conversionQty = event.qty ? event.qty : 0;
      this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
    } catch (error) {
      //
    }
  }


  setSrcWarehouse(event) {
    if (this.generics.length) {
      this.alertService.confirm('ต้องการยกเลิกรายการที่เลือกไว้แล้ว ใช่หรือไม่?')
        .then(() => {
          this.srcWarehouseId = event.warehouse_id;
          this.generics = [];
        }).catch(() => { });
    } else {
      this.srcWarehouseId = event.warehouse_id;
    }
  }

  changeLocation(event: any) {
    this.locationId = event.location_id;
  }

  editChangeLocation(event: any, idx: any) {
    this.generics[idx].location_id = event.location_id;
  }

  async setDstWarehouse(event: any) {
    this.dstWarehouseId = event.warehouse_id;
    this.locations = [];
    this.locationId = null;
    this.locationList.getLocations(this.dstWarehouseId);
  }

  async getDetailInfo() {
    try {
      this.modalLoading.show();
      const rs: any = await this.borrowItemsService.getDetailInfo(this.borrowId);
      if (rs.ok) {
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
      console.error(error);
    }
  }

  async addGeneric() {
    // if (this.borrowQty) {
    const idx = _.findIndex(this.generics, { generic_id: this.genericId });

    if (idx === -1) {
      if (this.genericId) {
        const obj = {
          working_code: this.workingCode,
          generic_name: this.genericName,
          generic_id: this.genericId,
          borrow_qty: +this.borrowQty,
          remain_qty: +this.remainQty,
          unit_generic_id: this.unitGenericId,
          conversion_qty: this.conversionQty,
          location_id: this.locationId,
          primary_unit_id: this.primaryUnitId,
          primary_unit_name: this.primaryUnitName
        };

        this.generics.push(obj);
        // await this.getProductList(this.genericId, (this.borrowQty * this.conversionQty));
        this.clearForm();
      } else {
        this.alertService.error('ข้อมูลไม่ครบถ้วน')
      }

    } else {
      this.alertService.error('รายการซ้ำกรุณาแก้ไขรายการเดิม');
    }
    // } else {
    //   this.alertService.error('กรุณาระบุจำนวนที่ต้องการโอน')
    // }

  }

  clearForm() {
    this.workingCode = null;
    this.productName = null;
    this.genericName = null;
    this.genericId = null;
    this.unitGenericId = null;
    this.wmProductId = null;
    this.productId = null;
    this.selectedProduct = {};
    this.selectedLot = {};
    this.selectedUnit = {};
    this.remainQty = 0;
    this.borrowQty = 0;
    this.expiredDate = null;
    this.elSearchGeneric.clearSearch();
    this.lotNo = null;
    this.locationId = null;
    this.remark = null;
    this.lots = [];
  }

  onChangeEditQty(qty: any) {
    this.borrowQty = qty;
  }

  editChangeUnit(idx: any, event: any) {
    this.generics[idx].unit_generic_id = event.unit_generic_id;
    this.generics[idx].conversion_qty = event.qty;
    // const genericId = this.generics[idx].generic_id;
    const borrowQty = this.generics[idx].borrow_qty * this.generics[idx].conversion_qty;
    this.generics[idx].borrow_qty = borrowQty;
    // this.getProductList(genericId, borrowQty);
  }

  removeProduct(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.generics.splice(idx, 1);
      }).catch(() => { });
  }

  async saveBorrow() {
    this.isSaving = true;
    if (this.generics.length && this.srcWarehouseId && this.dstWarehouseId && this.borrowDate) {
      const generics = [];
      let isError = false;

      let data = [];
      for (const v of this.generics) {
        if (v.generic_id && v.borrow_qty) {
          const _data = {
            genericId: v.generic_id,
            genericQty: v.borrow_qty
          }

          data.push(_data);

          let allocate = await this.borrowItemsService.allocateBorrow(data, this.srcWarehouseId);
          let wmRows = [];
          wmRows.push(allocate.rows);

          generics.push({
            generic_id: v.generic_id,
            borrow_qty: +v.borrow_qty * v.conversion_qty,
            unit_generic_id: v.unit_generic_id,
            primary_unit_id: v.primary_unit_id,
            products: {
              data: wmRows
            }
          });
        } else {
          isError = false;
        }
      }
      console.log(generics)

      if (isError) {
        this.alertService.error('ข้อมูลไม่ครบถ้วนหรือไม่สมบูรณ์ เช่น จำนวนยืม');
      } else {
        const summary = {
          borrowDate: `${this.borrowDate.date.year}-${this.borrowDate.date.month}-${this.borrowDate.date.day}`,
          srcWarehouseId: this.srcWarehouseId,
          dstWarehouseId: this.dstWarehouseId,
          peopleId: this.peopleId,
          remark: this.remark
        };

        if (generics.length) {
          this.alertService.confirm('ต้องการยืมรายการสินค้า ใช่หรือไม่?')
            .then(async () => {
              this.modalLoading.show();
              try {
                const rs: any = await this.borrowItemsService.updateBorrow(this.borrowId, summary, generics);
                if (rs.ok) {
                  this.alertService.success();
                  this.router.navigate(['/staff/borrow']);
                } else {
                  this.isSaving = false;
                  this.alertService.error(JSON.stringify(rs.error));
                }

                this.modalLoading.hide();

              } catch (error) {
                this.isSaving = false;
                this.modalLoading.hide();
              }
            })
            .catch(() => {
              this.isSaving = false;
              this.modalLoading.hide();
            });
        } else {
          this.isSaving = false;
          this.alertService.error('ไม่พบรายการที่ต้องการยืม');
        }
      }

    }
  }

  onChangePeople(event: any) {
    if (event) {
      this.peopleId = null;
    }
  }
  onSelectedPeople(event: any) {
    this.peopleId = event ? event.people_id : null;
  }
}
