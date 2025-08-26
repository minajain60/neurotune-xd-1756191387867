sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
  "use strict";

  return Controller.extend("converted.invoicedisplayview.controller.App", {
    /**
     * Called when the app controller is initialized.
     * @public
     */
    onInit: function () {
      // Log app initialization for debugging
      console.log("App controller initialized");
      
      // Get the router instance
      var oRouter = UIComponent.getRouterFor(this);
      
      // Check if the router is available
      if (oRouter) {
        // Log router initialization
        console.log("Router found, initializing navigation");
        
        // Attach a bypassed event handler to handle routing errors
        oRouter.attachBypassed(function(oEvent) {
          console.log("Route bypassed:", oEvent.getParameter("hash"));
        });
        
        // Navigate to main view if no hash is set or if the hash is empty
        if (!window.location.hash || window.location.hash === "#") {
          // Log navigation to main route
          console.log("No hash found, navigating to main route");
          
          // Use a timeout to ensure the router is fully initialized before navigation
          setTimeout(function() {
            oRouter.navTo("RouteMain");
          }, 100);
        }
      } else {
        // Log an error if the router is not found
        console.error("Router not found in App controller");
      }
    }
  });
});
