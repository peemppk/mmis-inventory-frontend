import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  collapsible = true;
  collapse = true;
  fullname: string;
  warehouseName: string;
  warehouseId: string;
  warehouseCode: string;
  public env: any;
  rights: any;
  Purchasing = false;
  Planning = false;
  Inventory = false;
  InventoryWarehouse = false;
  Materials = false;
  Contracts = false;
  Administrator = false;
  Report = false;
  jwtHelper: JwtHelper = new JwtHelper();

  menuPick: boolean;
  menuPeriod: boolean;
  menuRollback: boolean;
  menuReturn: boolean;
  menuAdjust: boolean;
  menuReceive: boolean;
  menuTools = true;
  menuIssue: boolean;
  menuTransfer: boolean;
  menuRequisition: boolean;
  menuAddition: boolean;
  menuIssueHis: boolean;
  menuWarehouse: boolean;
  menuRequisitionType: boolean;
  menuIssueType: boolean;
  menuReceiveType: boolean;
  menuMapGenericHis: boolean;
  menuMapTradeTMT: boolean;
  menuShippingNetwork: boolean;
  menuMinMax: boolean;
  menuTemplateRequisition: boolean;
  menuReceivePlanning: boolean;
  menuDonator: boolean;
  menuSetting = true;
  menuBorrow: boolean;
  menuBorrowProduct: boolean;
  menuAlertExpired: boolean;

  @ViewChild('modalChangePassword') public modalChangePassword;

  token: any;

  constructor(
    private router: Router,
    @Inject('HOME_URL') private homeUrl: string,
    @Inject('API_URL') private apiUrl: string,
    @Inject('API_PORTAL_URL') private apiPortal: string
  ) {
    this.token = sessionStorage.getItem('token');
    // const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    const accessRight = decodedToken.accessRight;
    this.rights = accessRight.split(',');
  }

  logout() {
    sessionStorage.removeItem('token');
    location.href = this.homeUrl;
  }

  goHome() {
    location.href = this.homeUrl;
  }

  ngOnInit() {
    const decoded = this.jwtHelper.decodeToken(this.token);

    this.fullname = decoded.fullname;
    this.warehouseId = decoded.warehouseId;
    this.warehouseCode = decoded.warehouseCode;
    this.warehouseName = decoded.warehouseName;
    this.menuPick = _.indexOf(this.rights, 'WM_PICK') === -1 ? false : true;
    this.menuBorrow = _.indexOf(this.rights, 'WM_BORROW') === -1 ? false : true;
    this.menuReturn = _.indexOf(this.rights, 'WM_RETURN_BUDGET') === -1 ? false : true;
    this.menuRollback = _.indexOf(this.rights, 'WM_ROLLBACK') === -1 ? false : true;
    this.menuAdjust = _.indexOf(this.rights, 'WM_ADJUST') === -1 ? false : true;
    if (!this.menuAdjust && !this.menuReturn && !this.menuRollback) {
      this.menuTools = false;
    }
    this.menuBorrowProduct = _.indexOf(this.rights, 'WM_BORROWPRODUCT') === -1 ? false : true;
    this.menuPeriod = _.indexOf(this.rights, 'WM_PERIOD') === -1 ? false : true;
    this.menuReceive = _.indexOf(this.rights, 'WM_RECEIVE') === -1 ? false : true;
    this.menuIssue = _.indexOf(this.rights, 'WM_ISSUE') === -1 ? false : true;
    this.menuTransfer = _.indexOf(this.rights, 'WM_TRANSFER') === -1 ? false : true;
    this.menuRequisition = _.indexOf(this.rights, 'WM_REQUISITION') === -1 ? false : true;
    this.menuAddition = _.indexOf(this.rights, 'WM_ADDITION') === -1 ? false : true;
    this.menuIssueHis = _.indexOf(this.rights, 'WM_HIS_TRANSACTION') === -1 ? false : true;
    this.menuAlertExpired = _.indexOf(this.rights, 'WM_ALERT_EXPIRED') === -1 ? false : true;

    this.menuWarehouse = _.indexOf(this.rights, 'WM_WAREHOUSE_MANAGEMENT') === -1 ? false : true;
    this.menuRequisitionType = _.indexOf(this.rights, 'WM_REQUISITION_TYPE') === -1 ? false : true;
    this.menuIssueType = _.indexOf(this.rights, 'WM_ISSUE_TYPE') === -1 ? false : true;
    this.menuReceiveType = _.indexOf(this.rights, 'WM_RECEIVE_TYPE') === -1 ? false : true;
    this.menuMapGenericHis = _.indexOf(this.rights, 'WM_HIS_MAPPING') === -1 ? false : true;
    this.menuMapTradeTMT = _.indexOf(this.rights, 'WM_TMT_MAPPING') === -1 ? false : true;
    this.menuShippingNetwork = _.indexOf(this.rights, 'WM_SHIPPING_NETWORKS') === -1 ? false : true;
    this.menuMinMax = _.indexOf(this.rights, 'WM_MINMAX_PLANNING') === -1 ? false : true;
    this.menuTemplateRequisition = _.indexOf(this.rights, 'WM_REQUISITION_TEMPLATE') === -1 ? false : true;
    this.menuReceivePlanning = _.indexOf(this.rights, 'WM_RECEIVE_PLANNING') === -1 ? false : true;
    this.menuDonator = _.indexOf(this.rights, 'WM_DONATOR') === -1 ? false : true;
    if (!this.menuWarehouse && !this.menuRequisitionType && !this.menuIssueType && !this.menuReceiveType && !this.menuMapGenericHis
      && !this.menuMapTradeTMT && !this.menuShippingNetwork && !this.menuMinMax && !this.menuTemplateRequisition
      && !this.menuReceivePlanning && !this.menuDonator) {
      this.menuSetting = false;
    }
    this.env = {
      homeUrl: environment.homeUrl,
      purchasingUrl: environment.purchasingUrl,
      planningUrl: environment.planningUrl,
      inventoryUrl: environment.inventoryUrl,
      materialsUrl: environment.materialsUrl,
      reportUrl: environment.reportUrl,
      umUrl: environment.umUrl,
      contractsUrl: environment.contractsUrl
    };
    this.Purchasing = _.indexOf(this.rights, 'PO_ADMIN') === -1 ? false : true;
    this.Planning = _.indexOf(this.rights, 'BM_ADMIN') === -1 ? false : true;
    this.Inventory = _.indexOf(this.rights, 'WM_ADMIN') === -1 ? false : true;
    this.InventoryWarehouse = _.indexOf(this.rights, 'WM_WAREHOUSE_ADMIN') === -1 ? false : true;
    this.Materials = _.indexOf(this.rights, 'MM_ADMIN') === -1 ? false : true;
    this.Contracts = _.indexOf(this.rights, 'CM_ADMIN') === -1 ? false : true;
    this.Administrator = _.indexOf(this.rights, 'UM_ADMIN') === -1 ? false : true;
    this.Report = _.indexOf(this.rights, 'RP_ADMIN') === -1 ? false : true;
  }

  openChangePasswordModal() {
    this.modalChangePassword.openModal();
  }

  downloadManual() {
    const url = `${this.apiUrl}/pdf/ManualAdmin.pdf`;
    window.open(url, '_blank');
  }
  showManualStaff() {
    const url = `${this.apiPortal}/pdf/ManualStaff.pdf`;
    window.open(url, '_blank');
  }
}
