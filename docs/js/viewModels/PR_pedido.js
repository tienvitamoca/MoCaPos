define(['ojs/ojarraydataprovider', 'ojs/ojcore', 'knockout', 'jquery', 'ojs/ojbootstrap', 'ojs/ojpagingcontrol',
  'ojs/ojknockout', 'ojs/ojnavigationlist', 'ojs/ojswitcher', 'ojs/ojlabel', 'ojs/ojmodel',
  'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource',
  'ojs/ojformlayout', 'ojs/ojprogress', 'ojs/ojpopup', 'ojs/ojbutton', 'ojs/ojpagingtabledatasource',
  'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojfilepicker', 'ojs/ojarraytabledatasource',
  'ojs/ojknockout-keyset', 'ojs/ojmessages', 'ojs/ojcheckboxset', 'ojs/ojcollapsible',
  'ojs/ojvalidation-number', 'ojs/ojtable', 'ojs/ojpagingdataproviderview',
  'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojlabelvalue', 'ojs/ojselectcombobox',
  'ojs/ojdialog', 'ojs/ojradioset'],
  function (ArrayDataProvider, oj, ko, $) {

    function PR_pedido(params) {
      const v_This = this;

      v_This.proveedor = params?.proveedor;
      console.log('HIJO recibe:', v_This.proveedor);
      v_This.cerrar = function () {
        if (params?.onCerrar) {
          params.onCerrar();
        }
      };

      v_This.BarraBusqueda = ko.observable('');
      v_This.TblDatos = ko.observable();
      v_This.TblDatosMini = ko.observable();

      v_This.CountNumProductos = ko.observable(4); // numero de productos que van a pagar

      v_This.CobroTotal = ko.observable(510);   // el total del cobro que esta por hacerse
      v_This.PromoCantidad = ko.observable(0); // cantidad de promocion del cobro total
      v_This.PromoPorciento = ko.observable(8); // porcentaje de promocion del cobro total



      /****** Promociones*/
      v_This._actualizandoPromo = false;

      v_This.PromoPorciento.subscribe(function (nuevoPorcentaje) {
        if (v_This._actualizandoPromo) return;

        v_This._actualizandoPromo = true;

        const total = Number(v_This.CobroTotal()) || 0;
        const porcentaje = Number(nuevoPorcentaje) || 0;

        const cantidad = Math.round(total * (porcentaje / 100) * 100) / 100;
        v_This.PromoCantidad(cantidad);

        v_This._actualizandoPromo = false;
      });


      v_This.PromoCantidad.subscribe(function (nuevaCantidad) {
        if (v_This._actualizandoPromo) return;

        v_This._actualizandoPromo = true;

        const total = Number(v_This.CobroTotal()) || 0;
        const cantidad = Number(nuevaCantidad) || 0;

        const porcentaje = total > 0
          ? (cantidad / total) * 100
          : 0;

        v_This.PromoPorciento(porcentaje);

        v_This._actualizandoPromo = false;
      });

      /****** */


      // Datos de ejemplo
      v_This.tableData = ko.observableArray([
        {
          id: 1,
          quantity: "5 piezas",
          product: "Bimbollos",
          inventory: "5",
          price: "$26",
          amount: "$156",
          impuesto: "%8"
        },
        {
          id: 2,
          quantity: "2 piezas",
          product: "Conchas",
          inventory: "10",
          price: "$45",
          amount: "$90",
          impuesto: "%8"
        },
        {
          id: 3,
          quantity: "1 pieza",
          product: "Producto 3",
          inventory: "15",
          price: "$120",
          amount: "$120",
          impuesto: "%8"
        },
        {
          id: 4,
          quantity: "3 piezas",
          product: "Producto 4",
          inventory: "8",
          price: "$67",
          amount: "$201",
          impuesto: "%0"
        }
      ]);
      // Data provider para la tabla
      v_This.TblDatos = new oj.ArrayTableDataSource(
        v_This.tableData(),
        { idAttribute: 'id' }
      );
      v_This.TblDatosMini = new oj.ArrayTableDataSource(
        v_This.tableData(),
        { idAttribute: 'id' }
      );

      v_This.tareasList = ko.observableArray([
        { id: 1, nombre: 'Comprar víveres', estado: 'Pendiente', fecha: '2025-11-19' },
        { id: 2, nombre: 'Llamar a Juan', estado: 'Completada', fecha: '2025-11-18' }
      ]);
      v_This.dataProvider = new ArrayDataProvider(v_This.tareasList, { keyAttributes: 'id' });

      //Tabla de productos//
      v_This.TblCols = ko.observableArray([
        { "headerText": "Cantidad", "field": "quantity", "resizable": "enabled" },
        { "headerText": "Inventario", "field": "inventory", "resizable": "enabled" },
        { "headerText": "Producto", "field": "product", "resizable": "enabled" },
        { "headerText": "Precio unitario", "field": "price", "resizable": "enabled" },
        { "headerText": "Impuestos", "field": "impuesto", "resizable": "enabled" },
        { "headerText": "Importe", "field": "amount", "resizable": "enabled" },
        { "headerText": "", "field": "delete", "template": "actionTemplate", }
      ]);
      v_This.TblColsMini = ko.observableArray([
        { "headerText": "Cantidad", "field": "quantity", "resizable": "enabled" },
        { "headerText": "Producto", "field": "product", "resizable": "enabled" },
        { "headerText": "Precio unitario", "field": "price", "resizable": "enabled" },
        { "headerText": "", "field": "delete", "template": "actionTemplate" }
      ]);
      //faltantes de ejemplo 
      v_This.faltantes = ko.observableArray([
        { id: 1, nombre: 'Bimbollos', agregado: ko.observable(false) },
        { id: 2, nombre: 'Conchas', agregado: ko.observable(true) },
        { id: 3, nombre: 'Cuernitos', agregado: ko.observable(false) },
        { id: 4, nombre: 'Rebanadas', agregado: ko.observable(false) }
      ]);



      v_This.BarraBuscar = function (event) {
        const valor = event.detail.value;
        console.log(valor);
      }

      v_This.Btn_Pagar = function () {
        console.log("Cobrando ando");
      }
      v_This.Btn_Impuestos = function () {
        console.log("escojer. Porcentaje de impuestos o CFDI directo");
      }

      // Aquí recibimos la función que mandó el padre
      v_This.onCerrar = params.onCerrar;
      // Esta es la función que llamará tu botón de "Regresar"
      v_This.redirigirAProveedores = function () {
        if (v_This.onCerrar) {
          v_This.onCerrar(); // Esto ejecuta la limpieza en el padre
        }
      };

    }

    return PR_pedido;
  });
