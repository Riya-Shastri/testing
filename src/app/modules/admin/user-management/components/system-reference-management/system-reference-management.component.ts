import { Component, OnInit } from "@angular/core";
import { ResponseModel } from "src/app/request/response-model";
import { AlertifyService } from "src/app/_services/alertify.service";
import { systemReferenceService } from "src/app/_services/systemReference/systemreference.service";

@Component({
  selector: "app-system-reference-management",
  templateUrl: "./system-reference-management.component.html",
  styleUrls: ["./system-reference-management.component.scss"],
})
export class SystemReferenceManagementComponent implements OnInit {
  constructor(
    private systemreferenceService: systemReferenceService,
    private alertify: AlertifyService
  ) {}
  systemReferences: any;
  ngOnInit(): void {
    this.getSystemReferences();
  }
  getSystemReferences() {
    this.systemreferenceService.getSystemReferences().subscribe(
      (response: ResponseModel) => {
        this.systemReferences = response.responseBody.content;
      },
      (error) => {
        this.alertify.message(error);
      }
    );
  }
}
