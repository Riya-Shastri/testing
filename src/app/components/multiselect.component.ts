import { Component } from "@angular/core";
import { IDropdownSettings } from "ng-multiselect-dropdown";

@Component({
  selector: "app-multiselect",
  templateUrl: "./multiselect.component.html",
  styleUrls: ["./multiselect.component.css"],
})
export class MultiselectComponent {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};

  constructor() {
    this.dropdownList = [
      { item_id: 1, item_text: "Option 1" },
      { item_id: 2, item_text: "Option 2" },
      { item_id: 3, item_text: "Option 3" },
      { item_id: 4, item_text: "Option 4" },
      { item_id: 5, item_text: "Option 5" },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "Unselect All",
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
  }

  onItemSelect(item: any) {}

  onSelectAll(items: any) {}
}
