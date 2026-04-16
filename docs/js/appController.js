/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['utils/config','knockout', 'ojs/ojcontext', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
  'ojs/ojdrawerpopup', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function (config, ko, Context, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider) {

    function ControllerViewModel() {
      this.config = config;
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;
      ////////////////////////////////////////////////////////////////////////////////////////////////
      // Array de rutas donde se guardara un Json de las rutas que lleguen de la base.
      this.Rutas = ko.observableArray([
        { ruta: 'VT_ventas', icono: 'oj-ux-ico-bar-chart' },
        { ruta: 'PD_productos', icono: 'oj-ux-ico-contact-group' },
        { ruta: 'PR_proveedores', icono: 'oj-ux-ico-money' },
        //{ ruta: 'tareas', icono: 'oj-ux-ico-contact-group' },
        // { ruta: 'PR_pedido', icono: 'oj-ux-ico-contact-group' },
        // { ruta: 'pruebas', icono: 'oj-ux-ico-contact-group' },
      ]);

      this.isMenuOpen = ko.observable(false);

      this.toggleMenu = () => {
        this.isMenuOpen(!this.isMenuOpen());
      };

      this.closeMenu = () => {
        this.isMenuOpen(false);
      };



      //El menu es variable dependiendo de las rutas
      const menuData = this.Rutas().map(item => ({
        path: item.ruta,
        detail: {
          label: item.ruta,
          iconClass: item.icono
        }
      }));

      const Lambda_Menu = [
        { path: '', redirect: 'VT_ventas' },

        ...this.Rutas().map(item => ({
          path: item.ruta,
          detail: {
            label: item.ruta,
            iconClass: item.icono
          }
        })),

        // ruta oculta
        {
          path: 'PR_pedido',
          detail: { label: 'PR_pedido' }
        }
      ];

      //sustituye
      // let navData = [
      //   { path: '', redirect: 'dashboard' },
      //   { path: 'dashboard', detail: { label: 'Dashboard', iconClass: 'oj-ux-ico-bar-chart' } },
      //   { path: 'incidents', detail: { label: 'Incidents', iconClass: 'oj-ux-ico-fire' } },
      //   { path: 'customers', detail: { label: 'Customers', iconClass: 'oj-ux-ico-contact-group' } },
      //   { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } }
      // ];
      let navData = Lambda_Menu;
      /////////////////////////////////////////////////////////////////////////////////////////////////////

      // Handle announcements sent when pages change, for Accessibility.
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
        this.message(event.detail.message);
        this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


      // Media queries for responsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);




      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      // this.moduleAdapter = new ModuleRouterAdapter(router);

      this.moduleAdapter = new ModuleRouterAdapter(router, {
        viewPath: 'views/',
        viewModelPath: 'viewModels/',
        moduleConfig: function (routerState) {
          const mod = routerState.detail.module || routerState.path;
          return {
            name: mod,
            viewPath: 'views/' + mod + '.html',
            viewModelPath: 'viewModels/' + mod + '.js'
          };
        }
      });

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(menuData, { keyAttributes: "path" });
      //this.navDataProvider = new ArrayDataProvider(navData.slice(1), { keyAttributes: "path" });

      // Drawer
      self.sideDrawerOn = ko.observable(false);

      // Close drawer on medium and larger screens
      this.mdScreen.subscribe(() => { self.sideDrawerOn(false) });

      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        self.sideDrawerOn(!self.sideDrawerOn());
      }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("AbarroNext");
      // User Info used in Global Navigation area
      this.userLogin = ko.observable("john.hancock@oracle.com");

      // Footer
      this.footerLinks = [
        { name: 'About Oracle', linkId: 'aboutOracle', linkTarget: 'http://www.oracle.com/us/corporate/index.html#menu-about' },
        { name: "Contact Us", id: "contactUs", linkTarget: "http://www.oracle.com/us/corporate/contact/index.html" },
        { name: "Legal Notices", id: "legalNotices", linkTarget: "http://www.oracle.com/us/legal/index.html" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "http://www.oracle.com/us/legal/terms/index.html" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "http://www.oracle.com/us/legal/privacy/index.html" },
      ];
    }
    // release the application bootstrap busy state
    Context.getPageContext().getBusyContext().applicationBootstrapComplete();

    return new ControllerViewModel();
  }
);
