import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolsService } from '../../tools.service';
import { AlertService } from '../../../alert.service';
import { LoadingModalComponent } from '../../../modals/loading-modal/loading-modal.component';

@Component({
  selector: 'wm-stockcard',
  templateUrl: './stockcard.component.html',
  styles: []
})
export class StockcardComponent implements OnInit {

  @ViewChild('modalLoading') modalLoading: LoadingModalComponent;

  receives = [];
  requisitions = [];
  transfers = [];
  history = [];
  issues = [];

  input = false;
  isOpenSearchReceive = false;
  isOpenSearchRequisition = false;
  isOpenSearchTranfer = false;
  isOpenSearchIssue = false;
  modalHistory = false;
  passwordModal = false;
  checkEnterPass = true;
  showBtnCal = false;

  passHis: any;
  isOpenSearchPick: boolean;
  picks: any;
  password: any;

  constructor(
    private toolService: ToolsService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  // /////////////////////////////////////

  gotoReceive(receiveId: any, receiveType: any) {
    if (receiveType === 'PO') {
      this.router.navigateByUrl(`/admin/tools/stockcard/receive?receiveId=${receiveId}`);
    } else {
      this.router.navigateByUrl(`/admin/tools/stockcard/receive-other?receiveOtherId=${receiveId}`);
    }
  }

  gotoRequisition(requisitionId: any, confirmId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/requisition?requisitionId=${requisitionId}&confirmId=${confirmId}`);
  }

  gotoTransfer(transferId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/transfer?transferId=${transferId}`);
  }

  gotoIssue(issueId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/issue?issueId=${issueId}`);
  }

  gotoPick(pickId: any) {
    this.router.navigateByUrl(`/admin/tools/stockcard/pick?pickId=${pickId}`);
  }


  showSearchReceive() {
    this.isOpenSearchReceive = true;
  }

  showSearchRequisition() {
    this.isOpenSearchRequisition = true;
  }

  showSearchTranfer() {
    this.isOpenSearchTranfer = true;
  }

  showSearchIssue() {
    this.isOpenSearchIssue = true;
  }

  showSearchPick() {
    this.isOpenSearchPick = true;
  }

  showModalCal() {
    this.passwordModal = true;
  }
  async doSearchReceives(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        const rs: any = await this.toolService.searchReceives(query);
        if (rs.ok) {
          this.receives = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }

        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error))
      }
    }
  }

  async doSearchRequisitions(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        console.log(query);

        const rs: any = await this.toolService.searchRequisitions(query);
        if (rs.ok) {
          this.requisitions = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }

        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error))
      }
    }
  }

  async doSearchTranfers(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        const rs: any = await this.toolService.searchTranfers(query);
        if (rs.ok) {
          this.transfers = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }

        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error))
      }
    }
  }

  async doSearchIssues(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        const rs: any = await this.toolService.searchIssues(query);
        if (rs.ok) {
          this.issues = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }

        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error))
      }
    }
  }

  async doSearchPick(event: any, query: any) {
    if (event.keyCode === 13) {
      try {
        this.modalLoading.show();
        const rs: any = await this.toolService.searchPick(query);
        if (rs.ok) {
          this.picks = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }

        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error))
      }
    }
  }

  async openInput() {
    this.input = !this.input;
    if (this.passHis) {
      // this.input = false;
      if (this.passHis === 'admin') {
        try {
          const rs: any = await this.toolService.getHistory();
          if (rs.ok) {
            this.history = rs.rows
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.alertService.error(error);
        }
        this.modalHistory = true;
      } else if (this.passHis === 'cal') {
        this.showBtnCal = true;
      }
    }
    this.passHis = null;

  }

  enterCalStockCard(e) {
    if (e.keyCode === 13 && this.password) {
      if (this.checkEnterPass) {
        this.calStockCard();
      }
      this.checkEnterPass = !this.checkEnterPass;
    }
  }

  async calStockCard() {
    try {
      this.modalLoading.show();
      const rs: any = this.toolService.calStockCard();
      this.modalLoading.hide();
      this.passwordModal = false;
      this.alertService.success('ระบบกำลังประมวลผลอยู่พื้นหลัง อาจใช้เวลา 5 - 20 นาที');
      // if (rs.ok) {
      // } else {
      //   this.alertService.error(rs.error);
      // }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error))
    }
  }


}
