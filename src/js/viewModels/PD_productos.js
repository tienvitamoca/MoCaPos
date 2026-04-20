define(['utils/ProductService', 'utils/config', 'ojs/ojarraydataprovider', 'ojs/ojcore', 'knockout', 'jquery', 'ojs/ojbootstrap', 'ojs/ojpagingcontrol',
  'ojs/ojknockout', 'ojs/ojnavigationlist', 'ojs/ojswitcher', 'ojs/ojlabel', 'ojs/ojmodel',
  'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource',
  'ojs/ojformlayout', 'ojs/ojprogress', 'ojs/ojpopup', 'ojs/ojbutton', 'ojs/ojpagingtabledatasource',
  'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojfilepicker', 'ojs/ojarraytabledatasource',
  'ojs/ojknockout-keyset', 'ojs/ojmessages', 'ojs/ojcheckboxset', 'ojs/ojcollapsible',
  'ojs/ojvalidation-number', 'ojs/ojtable', 'ojs/ojpagingdataproviderview',
  'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojlabelvalue', 'ojs/ojselectcombobox',
  'ojs/ojdialog', 'ojs/ojradioset'],
  function (ProductService, config, ArrayDataProvider, oj, ko, $) {
    function PD_productos() {
      this.title = ko.observable("Pantalla de productos");
      var v_This = this;
      v_This.config = config;
      v_This.ProductService = ProductService;

      //---------------------------------------------------Variables----------------------------------------------------------------


      v_This.Flag_ProductoNuevo = ko.observable(true);

      v_This.BarraBusqueda = ko.observable('');
      v_This.descripcionProducto = ko.observable();
      v_This.CodigoProducto = ko.observable();
      v_This.tipoVenta = ko.observable("unidad");
      v_This.PresentacionProducto = ko.observable();
      v_This.departamentoProducto = ko.observable();
      v_This.proveedorProducto = ko.observable();

      v_This.costoProducto = ko.observable();
      v_This.precioProducto = ko.observable();

      v_This.gananciaProducto = ko.observable();

      v_This.InvMinimo = ko.observable(5);
      v_This.InvMaximo = ko.observable(20);
      v_This.alertaInventario = ko.observable(3);
      v_This.usaInventario = ko.observable();
      v_This.InventarioExistente = ko.observable(48);

      v_This.piezasPaquete = ko.observable();
      v_This.productoPaqueteSelec = ko.observable("suelto");

      v_This.esPaqueteYSuelto = ko.pureComputed(function () {
        return v_This.productoPaqueteSelec() === "paquete";
      });

      //-------------------------------------------------Funciones---------------------------------------------------


      v_This.cambioCosto = function (event) {
        if (event.detail.updatedFrom == "internal" && event.detail.previousValue != undefined) {
          const costo = parseFloat(event.detail.value);
          const ganancia = parseFloat(v_This.gananciaProducto());
          if (isNaN(costo) || isNaN(ganancia)) return;
          v_This.costoProducto(costo);
          const precio = costo + (costo * ganancia / 100);
          v_This.precioProducto(parseFloat(precio.toFixed(2)));
        }
      };


      v_This.cambioPorcentajeGanancia = function (event) {
        if (event.detail.updatedFrom == "internal" && event.detail.previousValue != undefined) {
          const ganancia = parseFloat(event.detail.value);
          const costo = parseFloat(v_This.costoProducto());
          if (isNaN(costo) || isNaN(ganancia)) return;
          v_This.gananciaProducto(ganancia);
          const precio = costo + (costo * ganancia / 100);
          v_This.precioProducto(parseFloat(precio.toFixed(2)));
        }
      };


      v_This.cambioPrecio = function (event) {
        if (event.detail.updatedFrom == "internal" && event.detail.previousValue != undefined) {
          const precio = parseFloat(event.detail.value);
          const costo = parseFloat(v_This.costoProducto());
          if (isNaN(costo) || isNaN(precio) || costo <= 0) return;
          v_This.precioProducto(precio);
          const ganancia = ((precio - costo) / costo) * 100;
          v_This.gananciaProducto(parseFloat(ganancia.toFixed(2)));
        }
      };


      // const productosEjemplo = [
      //   { id: '75010001', producto: 'Coca Cola 600ml', inventario: 24, costo: 12.50, precio: 18.00 },
      //   { id: '75010002', producto: 'Sabritas Sal 45g', inventario: 15, costo: 11.00, precio: 17.50 },
      //   { id: '75010003', producto: 'Pan Blanco Bimbo Grande', inventario: 8, costo: 38.00, precio: 45.00 },
      //   { id: '75010004', producto: 'Leche Alpura Clásica 1L', inventario: 12, costo: 21.00, precio: 26.50 },
      //   { id: '75010005', producto: 'Detergente Ariel 1kg', inventario: 1, costo: 32.00, precio: 42.00 },
      //   { id: '75010006', producto: 'Huevo Blanco 18 pzas', inventario: 20, costo: 45.00, precio: 54.00 },
      //   { id: '75010007', producto: 'Aceite Nutrioli 850ml', inventario: 10, costo: 35.00, precio: 41.50 },
      //   { id: '75010008', producto: 'Arroz Extra Progreso 1kg', inventario: 18, costo: 19.50, precio: 25.00 },
      //   { id: '75010009', producto: 'Atún Herdez Agua 130g', inventario: 30, costo: 16.00, precio: 21.50 },
      //   { id: '75010010', producto: 'Café Nescafé Clásico 120g', inventario: 6, costo: 72.00, precio: 89.00 }
      // ];

      // 2. Variable que vinculaste en el HTML
      //v_This.opcionesProductos = new ArrayDataProvider(productosEjemplo, { keyAttributes: 'id' });
      v_This.opcionesProductos = ProductService.getProductosDP('id');
      //Tabla de productos//
      v_This.TblCols = ko.observableArray([
        { "headerText": "Codigo", "field": "id", "sortable": "disabled" },
        { "headerText": "Producto", "field": "producto", "sortable": "disabled" },
        { "headerText": "Inventario", "field": "inventario", "sortable": "disabled" },
        { "headerText": "Costo", "field": "costo", "sortable": "disabled" },
        { "headerText": "Precio", "field": "precio", "sortable": "disabled" },
        { "headerText": "", "field": "acciones", "template": "templateEdit", "sortable": "disabled" }
      ]);
      //columnas para moviles
      v_This.TblColsMini = ko.observableArray([
        { "headerText": "Producto", "field": "producto", "sortable": "disabled" },
        { "headerText": "Inventario", "field": "inventario", "sortable": "disabled" },
        { "headerText": "", "field": "acciones", "template": "templateEdit", "sortable": "disabled" }
      ]);


      v_This.TblColsMini = [
        { headerText: 'Prod.', field: 'producto', sortable: 'disabled', headerClassName: 'mini-header' },
        { headerText: 'Inv.', field: 'inventario', sortable: 'disabled', headerClassName: 'mini-header', width: '60px' },
        { template: 'templateEdit', headerClassName: 'mini-header', sortable: 'disabled' }
      ];

      v_This.tableData = ko.observableArray([
        {
          id: 1,
          codigo: "752681352812",
          producto: "Mole doña Maria",
          existencias: "5",
          precio: "$26",
        },
        {
          id: 2,
          codigo: "75218284",
          producto: "Producto 2",
          existencias: "10",
          precio: "$45",
        },
        {
          id: 3,
          codigo: "74556456",
          producto: "Producto 3",
          existencias: "15",
          precio: "$120",
        },
        {
          id: 4,
          codigo: "3456745546",
          producto: "Producto 4",
          existencias: "8",
          precio: "$67",
        }
      ]);
      // Data provider para la tabla
      v_This.TblDatos = new oj.ArrayTableDataSource(v_This.tableData(), { idAttribute: 'id' });


      v_This.cambioSeleccion = function (event) {
        // // 1. Accedemos a la ruta que encontraste
        // // Usamos el índice [0] porque tu selección es 'single'
        // const idSeleccionado = event.detail.value[0].endKey.row;

        // if (idSeleccionado) {
        //   console.log("ID seleccionado:", idSeleccionado);

        //   // 2. Buscamos el objeto completo en tu array 'productosEjemplo'
        //   // Forzamos a String ambos lados por si uno es número y el otro texto
        //   const datosFila = productosEjemplo.find(p => String(p.id) === String(idSeleccionado));

        //   if (datosFila) {
        //     console.log("Datos completos de la fila:", datosFila);

        //     // Aquí ya puedes hacer lo que quieras con los datos, por ejemplo:
        //     // v_This.nombreProducto(datosFila.producto);
        //   } else {
        //     console.log("No se encontró el objeto con ese ID en productosEjemplo");
        //   }
        // }
      };

      v_This.limpiaModalProducto = function () {
        v_This.descripcionProducto('');
        v_This.CodigoProducto('');
        v_This.tipoVenta("unidad");
        v_This.PresentacionProducto('');
        // v_This.departamentoProducto();
        v_This.proveedorProducto();

        v_This.costoProducto('');
        v_This.precioProducto('');

        v_This.gananciaProducto('');

        v_This.InvMinimo('');
        v_This.InvMaximo('');
        v_This.alertaInventario('');
        v_This.usaInventario('');
        v_This.InventarioExistente('');

      }

      //-----------------------------------------------Botones--------------------------------------------------
      v_This.abrirModal = function () {
        // 1. Obtenemos la selección actual de la tabla directamente del componente
        const tabla = document.getElementById('TablaProducto');
        const seleccion = tabla.selection; // Esto nos da el array de rangos

        if (seleccion && seleccion.length > 0) {
          // 2. Usamos la ruta que descubriste que funciona:
          const idSeleccionado = seleccion[0].endKey.row;
          console.log("ID recuperado desde el botón:", idSeleccionado);

          // 3. Buscamos los datos en tu array
          //const datosFila = productosEjemplo.find(p => String(p.id) === String(idSeleccionado));
          const datosFila = ProductService.buscarPorCodigo(idSeleccionado);
          
          if (datosFila) {
            console.log("Datos listos para el modal:", datosFila);

            // Aquí cargas tus observables
            // v_This.miNombreProducto(datosFila.producto);

            // 4. Abrimos el modal
            document.getElementById('Modal_Descripcion_Producto').open();
          }
        } else {
          console.log("No hay ninguna fila seleccionada.");
        }
      };
      v_This.cerrarModal = function () {
        document.getElementById('Modal_Descripcion_Producto').close();
        //    document.getElementById('Modal_Descripcion_Producto').classList.remove('active');

      }

      v_This.BtnActualizarProducto = function () {
        v_This.Flag_ProductoNuevo(false);
        console.log("Se guarda");
        document.getElementById('Modal_Descripcion_Producto').close();
      }
      v_This.ProductoNuevo = function () {
        v_This.Flag_ProductoNuevo(true);
        //v_This.limpiaModalProducto();
        document.getElementById('Modal_Descripcion_Producto').open();

      }

      v_This.FNInventarioBajo = function () {
        console.log("Se MUESTRA INVENTARIO BAJO");
      }

      v_This.BarraBuscar = function (event) {
        const valor = event.detail.value;
        console.log(valor);
      }

    }

    return PD_productos;
  });
