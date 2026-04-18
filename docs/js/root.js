/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
require(["ojs/ojbootstrap","knockout","./appController","ojs/ojlogger","ojs/ojknockout","ojs/ojmodule","ojs/ojrouter","ojs/ojnavigationlist","ojs/ojbutton","ojs/ojtoolbar"],(function(o,n,t,e){o.whenDocumentReady().then((function(){function o(){n.applyBindings(t,document.getElementById("globalBody"))}document.body.classList.contains("oj-hybrid")?document.addEventListener("deviceready",o):o()}))}));