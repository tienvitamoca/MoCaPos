define(['ojs/ojmodule-element-utils', 'ojs/ojcorerouter', 'ojs/ojcore', 'knockout', 'jquery', 'ojs/ojbootstrap', 'ojs/ojpagingcontrol',
  'ojs/ojknockout', 'ojs/ojnavigationlist', 'ojs/ojswitcher', 'ojs/ojlabel', 'ojs/ojmodel',
  'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource',
  'ojs/ojformlayout', 'ojs/ojprogress', 'ojs/ojpopup', 'ojs/ojbutton', 'ojs/ojpagingtabledatasource',
  'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojfilepicker', 'ojs/ojarraytabledatasource',
  'ojs/ojknockout-keyset', 'ojs/ojmessages', 'ojs/ojcheckboxset', 'ojs/ojcollapsible',
  'ojs/ojarraydataprovider', 'ojs/ojvalidation-number', 'ojs/ojtable', 'ojs/ojpagingdataproviderview',
  'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojlabelvalue', 'ojs/ojselectcombobox',
  'ojs/ojdialog', 'ojs/ojradioset'],
  function (ModuleElementUtils, CoreRouter, oj, ko, $) {

    function PR_proveedores() {
      const v_This = this;

      v_This.modPedidos = ko.observable({ view: [], viewModel: null });
      v_This.vistaInterna = ko.observable('lista'); // lista | pedido
      v_This.proveedorActivo = ko.observable(null);


      // =====================
      // 🧠 ESTADO GENERAL
      // =====================
      v_This.title = ko.observable('Pantalla de proveedores');

      v_This.vistaActual = ko.observable('porDia'); // 'porDia' | 'todos'

      v_This.visitasPorDia = ko.observableArray([]);

      // =====================
      // 🔍 BÚSQUEDA
      // =====================
      v_This.proveedorSeleccionado = ko.observable();

      v_This.proveedoresBusqueda = ko.computed(function () {
        const mapa = {};

        v_This.visitasPorDia().forEach(dia => {
          dia.proveedores.forEach(p => {
            if (!mapa[p.idProveedor]) {
              mapa[p.idProveedor] = {
                value: p.idProveedor,
                label: p.nombre,
                proveedor: p // guardamos el objeto completo
              };
            }
          });
        });

        return Object.values(mapa);
      });

      v_This.onProveedorSeleccionado = function (event) {
        console.log("entra");

        const id = event.detail.value;
        if (!id) return;

        const proveedor = v_This.proveedoresBusqueda()
          .find(p => p.value === id)?.proveedor;

        if (proveedor) {
          v_This.openProveedor(proveedor);
        }

        // opcional: limpiar después de seleccionar
        v_This.proveedorSeleccionado(null);
      };



      // =====================
      // 📅 ORDEN DE LA SEMANA
      // =====================
      v_This.ordenSemana = [
        'DOMINGO',
        'LUNES',
        'MARTES',
        'MIERCOLES',
        'JUEVES',
        'VIERNES',
        'SABADO'
      ];

      v_This.getDiaActualKey = function () {
        return v_This.ordenSemana[new Date().getDay()];
      };

      // =====================
      // 🧾 DATOS DE EJEMPLO (SIMULAN BD)
      // =====================
      const dataBD = [
        { id_proveedor: 1, proveedor: 'Bimbo', dia: 'LUNES', promedioGasto: 450 },
        { id_proveedor: 2, proveedor: 'Coca-Cola', dia: 'LUNES', promedioGasto: 500 },
        { id_proveedor: 3, proveedor: 'Gamesa', dia: 'MARTES', promedioGasto: 300 },
        { id_proveedor: 3, proveedor: 'Gamesa', dia: 'MIERCOLES', promedioGasto: 300 },
        { id_proveedor: 3, proveedor: 'Gamesa', dia: 'JUEVES', promedioGasto: 300 },
        { id_proveedor: 2, proveedor: 'Coca-Cola', dia: 'VIERNES', promedioGasto: 300 }
      ];

      // =====================
      // 🔤 UTILIDADES
      // =====================
      function normalizarNombre(nombre) {
        return nombre
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      }

      // =====================
      // 🔄 PROCESAR DATOS DE BD
      // =====================
      v_This.procesarDatosBD = function (rows) {

        const mapaDias = {};

        rows.forEach(row => {

          if (!mapaDias[row.dia]) {
            mapaDias[row.dia] = {
              diaKey: row.dia,
              proveedores: {}
            };
          }

          if (!mapaDias[row.dia].proveedores[row.id_proveedor]) {
            mapaDias[row.dia].proveedores[row.id_proveedor] = {
              idProveedor: row.id_proveedor,
              nombre: row.proveedor,
              logo: `css/images/Proveedores/${normalizarNombre(row.proveedor)}.png`,
              //logo: "css/images/logo.png",
              montos: []
            };
          }

          mapaDias[row.dia].proveedores[row.id_proveedor].montos.push(row.promedioGasto);
        });

        // Convertir mapas a arrays
        return Object.values(mapaDias).map(dia => ({
          diaKey: dia.diaKey,
          proveedores: Object.values(dia.proveedores),
          total: Object.values(dia.proveedores)
            .flatMap(p => p.montos)
            .reduce((a, b) => a + b, 0)
        }));
      };

      // =====================
      // 📆 VISITAS ORDENADAS DESDE HOY
      // =====================
      v_This.visitasSemanaOrdenada = ko.computed(function () {

        const visitas = v_This.visitasPorDia();
        if (!visitas.length) return [];

        const hoy = new Date();
        const hoyKey = v_This.getDiaActualKey();
        const indexHoy = v_This.ordenSemana.indexOf(hoyKey);
        if (indexHoy === -1) return [];

        const diasTexto = [
          'domingo', 'lunes', 'martes',
          'miércoles', 'jueves', 'viernes', 'sábado'
        ];

        const semanaRotada = [
          ...v_This.ordenSemana.slice(indexHoy),
          ...v_This.ordenSemana.slice(0, indexHoy)
        ];

        return semanaRotada
          .map((diaKey, idx) => {
            const dia = visitas.find(v => v.diaKey === diaKey);
            if (!dia) return null;

            const fecha = new Date();
            fecha.setDate(hoy.getDate() + idx);

            const titulo = idx === 0
              ? `Hoy, ${diasTexto[fecha.getDay()]} ${fecha.getDate()}, me visitan`
              : `${diasTexto[fecha.getDay()].charAt(0).toUpperCase() +
              diasTexto[fecha.getDay()].slice(1)} ${fecha.getDate()}, me visitan`;

            return {
              ...dia,
              titulo
            };
          })
          .filter(Boolean);
      });


      // =====================
      // 📦 TODOS LOS PROVEEDORES
      // =====================
      v_This.todosLosProveedores = ko.computed(function () {

        const mapa = {};

        v_This.visitasPorDia().forEach(dia => {
          dia.proveedores.forEach(p => {

            if (!mapa[p.idProveedor]) {
              mapa[p.idProveedor] = {
                idProveedor: p.idProveedor,
                nombre: p.nombre,
                logo: p.logo,
                montos: []
              };
            }

            mapa[p.idProveedor].montos.push(...p.montos);
          });
        });

        return Object.values(mapa);
      });


      // =====================
      // 🧭 ACCIÓN CLICK
      // =====================
      v_This.openProveedor = function (proveedor) {
        console.log('PADRE envía:', proveedor);

        v_This.modPedidos(
          ModuleElementUtils.createConfig({
            name: 'PR_pedido',
            viewPath: 'views/PR_pedido.html',
            viewModelPath: 'viewModels/PR_pedido',
            params: {
              proveedor: proveedor,
              onCerrar: function () {
                v_This.modPedidos({ view: [], viewModel: null });
                v_This.vistaInterna('lista');
              }
            }
          })
        );

        v_This.vistaInterna('pedido');
      };

      v_This.verTodos = function () {
        v_This.vistaActual('todos');
      };

      v_This.verPorDia = function () {
        v_This.vistaActual('porDia');
      };

      // =====================
      // 🚀 INIT (SIMULADO)
      // =====================
      v_This.visitasPorDia(
        v_This.procesarDatosBD(dataBD)
      );
    }

    return PR_proveedores;
  });
