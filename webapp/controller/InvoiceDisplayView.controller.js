sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/MessagePopover",
  "sap/m/MessageItem",
  "sap/ui/core/library",
  "sap/ui/core/UIComponent",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator",
  "sap/ui/core/util/Export",
  "sap/ui/core/util/ExportTypeCSV"
], function (Controller, JSONModel, MessageToast, MessageBox, MessagePopover, MessageItem, coreLibrary, UIComponent, Filter, FilterOperator, Export, ExportTypeCSV) {
  "use strict";

  var MessageType = coreLibrary.MessageType;

  return Controller.extend("converted.invoicedisplayview.controller.InvoiceDisplayView", {
    /**
     * Initializes the view.
     * @public
     */
    onInit: function () {
      // Load mock data for customers
      var oCustomerModel = new JSONModel();
      oCustomerModel.loadData("model/mockData/customers.json");
      this.getView().setModel(oCustomerModel, "customers");

      // Load mock data for products
      var oProductModel = new JSONModel();
      oProductModel.loadData("model/mockData/products.json");
      this.getView().setModel(oProductModel, "products");

      // Load mock data for orders
      var oOrderModel = new JSONModel();
      oOrderModel.loadData("model/mockData/orders.json");
      this.getView().setModel(oOrderModel, "orders");

      // Initialize invoice header data model
      var oInvoiceHeaderModel = new JSONModel({
        InvoiceHeader: {
          SelectedActionKey: "option1",
          InvoiceTypeKey: "type1",
          InvoiceNumber: "90005190",
          Payer: "1002",
          BillingDate: "28.01.1997",
          NetValueTotal: "19 991,00",
          CurrencyUnit: "DEM",
          PayerAddress: "Omega Soft-Hardware Markt / Gustav-Jung-Strasse 425 /..."
        }
      });
      this.getView().setModel(oInvoiceHeaderModel, "invoiceHeader");

      // Initialize invoice items data model
      var oInvoiceItemsModel = new JSONModel();
      oInvoiceItemsModel.loadData("model/mockData/invoiceItems.json"); // Ensure this file exists
      this.getView().setModel(oInvoiceItemsModel, "invoiceItems");

      // Initialize message model for MessageArea/MessagePopover
      var oMessageModel = new JSONModel({
        messages: [
          {
            type: MessageType.Success,
            title: "System Information",
            description: "Application converted successfully, Use AI optimize for better result",
            subtitle: "Conversion complete",
            counter: 1
          }
        ]
      });
      this.getView().setModel(oMessageModel, "messages");
    },

    /**
     * Called before the view is rendered.
     * @public
     */
    onBeforeRendering: function() {
      // Prepare data before rendering
    },

    /**
     * Called after the view is rendered.
     * @public
     */
    onAfterRendering: function() {
      // Adjust UI after rendering
    },

    /**
     * Handles value help request (F4 help).
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    handleValueHelp: function(oEvent) {
      var oSource = oEvent.getSource();

      if (!this._valueHelpDialog) {
        this._valueHelpDialog = new sap.m.SelectDialog({
          title: "Select Value",
          confirm: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
              oSource.setValue(oSelectedItem.getTitle());
            }
          },
          cancel: function() {
            // Handle cancel event
          }
        });

        var oDialogModel = new JSONModel({
          items: [
            { title: "Item 1", description: "Description 1" },
            { title: "Item 2", description: "Description 2" },
            { title: "Item 3", description: "Description 3" }
          ]
        });

        this._valueHelpDialog.setModel(oDialogModel);
        this._valueHelpDialog.bindAggregation("items", {
          path: "/items",
          template: new sap.m.StandardListItem({
            title: "{title}",
            description: "{description}"
          })
        });
      }

      this._valueHelpDialog.open();
    },

    /**
     * Handles file download request.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onFileDownload: function(oEvent) {
      MessageToast.show("File download initiated");
    },

    /**
     * Opens the message popover.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    handleMessagePopoverPress: function(oEvent) {
      if (!this._messagePopover) {
        this._messagePopover = new MessagePopover({
          items: {
            path: "messages>/messages",
            template: new MessageItem({
              type: "{messages>type}",
              title: "{messages>title}",
              description: "{messages>description}",
              subtitle: "{messages>subtitle}",
              counter: "{messages>counter}"
            })
          }
        });

        this.getView().byId("messagePopoverBtn").addDependent(this._messagePopover);
      }

      this._messagePopover.toggle(oEvent.getSource());
    },

    /**
     * Handles navigation link press.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onNavigationLinkPress: function(oEvent) {
      var oSource = oEvent.getSource();
      var sHref = oSource.getHref();

      if (sHref) {
        return;
      }

      var sNavTarget = oSource.data("navTarget");
      if (sNavTarget) {
        MessageToast.show("Navigating to: " + sNavTarget);
      }
    },

    /**
     * Handles office control rendering.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onOfficeControlRendered: function(oEvent) {
      console.log("Office control container rendered");

      var oSource = oEvent.getSource();
      var sDomRef = oSource.getDomRef();
      if (sDomRef) {
        sDomRef.innerHTML = '<div class="sapUiMediumMargin">' +
          '<div class="sapUiMediumMarginBottom">' +
          '<span class="sapUiIcon sapUiIconMirrorInRTL" style="font-family:SAP-icons;color:#0854a0;font-size:2.5rem">&#xe0ef;</span>' +
          '</div>' +
          '<div class="sapMText">' +
          '<p>Office document integration would be configured here.</p>' +
          '<p>In SAPUI5, this typically uses OData services with MS Graph API integration.</p>' +
          '</div>' +
          '</div>';
      }
    },

    /**
     * Opens a dialog.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    openDialog: function(oEvent) {
      var oSource = oEvent.getSource();
      var sDialogId = oSource.data("dialogId") || "confirmDialog";

      var oDialog = this.getView().byId(sDialogId);
      if (oDialog) {
        oDialog.open();
      } else {
        MessageToast.show("Dialog with ID '" + sDialogId + "' not found");
      }
    },

    /**
     * Closes a dialog.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    closeDialog: function(oEvent) {
      var oDialog = oEvent.getSource().getParent();
      oDialog.close();
    },

    /**
     * Handles dialog confirm button press.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onDialogConfirm: function(oEvent) {
      MessageToast.show("Dialog confirmed");
      this.closeDialog(oEvent);
    },

    /**
     * Handles dialog cancel button press.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onDialogCancel: function(oEvent) {
      this.closeDialog(oEvent);
    },

    /**
     * Navigates to the SecondView.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onNextPress: function(oEvent) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo("second");
    },

    /**
     * Navigates back to the main view.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onBackPress: function(oEvent) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo("main");
    },

    /**
     * Navigates to a specific route.
     * @param {string} sRoute The route name.
     * @public
     */
    navTo: function(sRoute) {
      var oRouter = UIComponent.getRouterFor(this);
      oRouter.navTo(sRoute);
    },

    /**
     * Handles action for the Favorites button.
     * @public
     */
    onActionFavorites: function() {
      MessageToast.show("Favorites action triggered");
    },

    /**
     * Handles action for the History button.
     * @public
     */
    onActionHistory: function() {
      MessageToast.show("History action triggered");
    },

    /**
     * Handles action for the Settings button.
     * @public
     */
    onActionSettings: function() {
      MessageToast.show("Settings action triggered");
    },

    /**
     * Handles action for the Print button.
     * @public
     */
    onActionPrint: function() {
      MessageToast.show("Print action triggered");
    },

    /**
     * Handles action for the Exit button.
     * @public
     */
    onActionExit: function() {
      MessageToast.show("Exit Application");
    },

    /**
     * Handles action for the Confirm button.
     * @public
     */
    onActionConfirm: function() {
      MessageToast.show("Confirm action triggered");
    },

    /**
     * Handles action when an action is selected from the dropdown.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onActionSelectAction: function(oEvent) {
      var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
      MessageToast.show("Selected action: " + sSelectedKey);
    },

    /**
     * Handles action for the Attachments button.
     * @public
     */
    onActionAttachments: function() {
      MessageToast.show("Attachments action triggered");
    },

    /**
     * Handles action for the Accounting button.
     * @public
     */
    onActionAccounting: function() {
      MessageToast.show("View Accounting Documents");
    },

    /**
     * Handles action for the Billing Documents button.
     * @public
     */
    onActionBillingDocuments: function() {
      MessageToast.show("View Billing Documents");
    },

    /**
     * Handles action for the Cancel button.
     * @public
     */
    onActionCancel: function() {
      MessageToast.show("Cancel Changes");
    },

    /**
     * Handles action for the Upload button.
     * @public
     */
    onActionUpload: function() {
      MessageToast.show("Upload action triggered");
    },

    /**
     * Handles action for the Download button.
     * @public
     */
    onActionDownload: function() {
      MessageToast.show("Download action triggered");
    },

    /**
     * Handles action for the Refresh button.
     * @public
     */
    onActionRefresh: function() {
      MessageToast.show("Refresh action triggered");
    },

    /**
     * Handles action for displaying payer address details.
     * @public
     */
    onActionPayerAddressDetails: function() {
      MessageToast.show("Display Payer Address Details");
    },

    /**
     * Handles action for deleting selected items.
     * @public
     */
    onActionDeleteItems: function() {
      MessageToast.show("Delete Selected Items");
    },

    /**
     * Handles action for table layout settings.
     * @public
     */
    onActionTableLayout: function() {
      MessageToast.show("Table Layout Settings");
    },

    /**
     * Handles action for printing the table.
     * @public
     */
    onActionTablePrint: function() {
      MessageToast.show("Print Table");
    },

    /**
     * Handles action for selecting all items in the table.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onActionSelectAllItems: function(oEvent) {
      var bSelected = oEvent.getSource().getSelected();
      var oTable = this.getView().byId("invoiceItemsTable");
      var aItems = oTable.getItems();
      aItems.forEach(function(oItem) {
        var oCheckBox = oItem.getCells()[0]; // Assuming the checkbox is the first cell
        if (oCheckBox instanceof sap.m.CheckBox) {
          oCheckBox.setSelected(bSelected);
        }
      });
      MessageToast.show("Select All Items: " + bSelected);
    },

    /**
     * Handles action when a description link is pressed.
     * @public
     */
    onActionDescriptionLink: function() {
      MessageToast.show("Description Link Pressed");
    },

    /**
     * Handles action when an SU link is pressed.
     * @public
     */
    onActionSULink: function() {
      MessageToast.show("SU Link Pressed");
    },

    /**
     * Handles action when a material link is pressed.
     * @public
     */
    onActionMaterialLink: function() {
      MessageToast.show("Material Link Pressed");
    },

        /**
     * Exports the table data to a CSV file.
     * @public
     */
    onExportToCSV: function() {
      var oTable = this.byId("invoiceItemsTable");
      var aData = oTable.getModel("invoiceItems").getData().InvoiceItems; // Access the data correctly
      var sCsvContent = this._convertToCSV(aData);
      var oBlob = new Blob([sCsvContent], { type: 'text/csv' });
      var sUrl = URL.createObjectURL(oBlob);
      var oLink = document.createElement('a');
      oLink.href = sUrl;
      oLink.download = 'invoice_items.csv';
      oLink.click();
      URL.revokeObjectURL(sUrl);
    },
    
        /**
     * Converts the given data to a CSV format.
     * @param {array} aData The data to convert.
     * @private
     * @returns {string} The CSV formatted data.
     */
    _convertToCSV: function(aData) {
      if (!aData || aData.length === 0) return '';
      var aHeaders = Object.keys(aData[0]);
      var sCsv = aHeaders.join(',') + '\n';
      aData.forEach(function(row) {
        var aValues = aHeaders.map(function(header) {
          return '"' + (row[header] || '').toString().replace(/"/g, '""') + '"';
        });
        sCsv += aValues.join(',') + '\n';
      });
      return sCsv;
    },
    
            /**
     * Exports the table data to an Excel file.
     * @public
     */
    onExportToExcel: function() {
      var oTable = this.byId("invoiceItemsTable");
      var oExport = new Export({
        exportType: new ExportTypeCSV({
          fileExtension: 'xlsx',
          mimeType: 'application/vnd.ms-excel'
        }),
        models: oTable.getModel("invoiceItems"), // Access the model correctly
        rows: {
          path: "/InvoiceItems" // Use the correct path
        },
        columns: this._getExportColumns()
      });
      oExport.saveFile("invoice_items").then(function() {
        MessageToast.show("Export completed successfully");
      });
    },
    
    /**
     * Defines the columns for the export.
     * @private
     * @returns {array} An array of column definitions.
     */
    _getExportColumns: function() {
      return [
        {
          name: "ItemNo",
          template: {
            content: "{ItemNo}"
          }
        },
        {
          name: "Description",
          template: {
            content: "{Description}"
          }
        },
        {
          name: "BilledQuantity",
          template: {
            content: "{BilledQuantity}"
          }
        },
        {
          name: "SU",
          template: {
            content: "{SU}"
          }
        },
        {
          name: "NetValueItem",
          template: {
            content: "{NetValueItem}"
          }
        },
        {
          name: "Material",
          template: {
            content: "{Material}"
          }
        },
        {
          name: "TaxAmount",
          template: {
            content: "{TaxAmount}"
          }
        }
      ];
    },

        /**
     * Performs a search on the invoice items table.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onSearch: function(oEvent) {
      var sQuery = oEvent.getParameter("newValue") || oEvent.getParameter("query");
      var oTable = this.byId("invoiceItemsTable");
      var oBinding = oTable.getBinding("items");
      var aFilters = [];
      
      if (sQuery && sQuery.length > 0) {
        var aSearchFilters = [];
        // Search across multiple fields
        aSearchFilters.push(new Filter("Description", FilterOperator.Contains, sQuery));
        aSearchFilters.push(new Filter("Material", FilterOperator.Contains, sQuery));
        
        aFilters.push(new Filter({
          filters: aSearchFilters,
          and: false
        }));
      }
      
      oBinding.filter(aFilters);
      this._updateSearchResultsCount(oBinding.getLength());
    },
    
    /**
     * Updates the search results count.
     * @param {number} iCount The number of search results.
     * @private
     */
    _updateSearchResultsCount: function(iCount) {
      var oTitle = this.byId("tableTitle");
      if (oTitle) {
        oTitle.setText("Invoice Items (" + iCount + ")");
      }
    },

        /**
     * Opens the filter dialog.
     * @public
     */
    onFilterPress: function() {
      if (!this._oFilterDialog) {
        this._oFilterDialog = sap.ui.xmlfragment("converted.invoicedisplayview.view.FilterDialog", this);
        this.getView().addDependent(this._oFilterDialog);
      }
      this._oFilterDialog.open();
    },
    
            /**
     * Confirms the filter settings.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onConfirmFilter: function(oEvent) {
      var aFilterItems = oEvent.getParameter("filterItems");
      var aFilters = [];
      
      aFilterItems.forEach(function(oItem) {
        var sPath = oItem.getKey();
        var sValue = oItem.getText();
        aFilters.push(new Filter(sPath, FilterOperator.EQ, sValue));
      });
      
      var oTable = this.byId("invoiceItemsTable");
      var oBinding = oTable.getBinding("items");
      oBinding.filter(aFilters);
    },

            /**
     * Opens the sort dialog.
     * @public
     */
    onSortPress: function() {
      if (!this._oSortDialog) {
        this._oSortDialog = sap.ui.xmlfragment("converted.invoicedisplayview.view.SortDialog", this);
        this.getView().addDependent(this._oSortDialog);
      }
      this._oSortDialog.open();
    },
    
            /**
     * Confirms the sort settings.
     * @param {sap.ui.base.Event} oEvent The event object.
     * @public
     */
    onConfirmSort: function(oEvent) {
      var sSortPath = oEvent.getParameter("sortItem").getKey();
      var bDescending = oEvent.getParameter("sortDescending");
      var oSorter = new sap.ui.model.Sorter(sSortPath, bDescending);
      
      var oTable = this.byId("invoiceItemsTable");
      var oBinding = oTable.getBinding("items");
      oBinding.sort(oSorter);
    }
  });
});
