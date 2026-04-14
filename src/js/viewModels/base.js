define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojbootstrap', 'ojs/ojpagingcontrol',
    'ojs/ojknockout', 'ojs/ojnavigationlist', 'ojs/ojswitcher', 'ojs/ojlabel', 'ojs/ojmodel',
    'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource',
    'ojs/ojformlayout', 'ojs/ojprogress', 'ojs/ojpopup', 'ojs/ojbutton', 'ojs/ojpagingtabledatasource',
    'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojfilepicker', 'ojs/ojarraytabledatasource',
    'ojs/ojknockout-keyset', 'ojs/ojmessages', 'ojs/ojcheckboxset', 'ojs/ojcollapsible',
    'ojs/ojarraydataprovider', 'ojs/ojvalidation-number', 'ojs/ojtable', 'ojs/ojpagingdataproviderview',
    'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojlabelvalue', 'ojs/ojselectcombobox',
    'ojs/ojdialog', 'ojs/ojradioset'],
    function (oj, ko, $) {
        function VT_ventas() {
            var v_This = this;

            //Fecha actual//
            const fechaActual = new Date();
            const opcionesFormatoFecha = {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            };
            const fechaFormateada = new Intl.DateTimeFormat('es-ES', opcionesFormatoFecha)
                .format(fechaActual)
                .replace('de el', 'del');

            v_This.fechaActualFormateada = ko.observable(fechaFormateada);         // Fecha para mostrar en pantalla
            //

            v_This.CountTicket = ko.observable(1);       // contador de tickets
            v_This.CobroTotal = ko.observable(510);   // el total del cobro que esta por hacerse
            v_This.CountNumProductos = ko.observable(4); // numero de productos que van a cobrarse
            v_This.RegTotal = ko.observable(510);           // Registro total de la venta que se acaba de relaizar
            v_This.RegPago = ko.observable(200);            // Registro de el pago de la venta realizada
            v_This.RegCambio = ko.computed(function () {
                let venta = parseFloat(v_This.RegTotal());
                let pago = parseFloat(v_This.RegPago());
                const resultado = pago - venta;
                // Devolver el resultado formateado a 2 decimales.
                return resultado.toFixed(1);


            });

            v_This.dataProvider = ko.observable();

            v_This.transitionCompleted = function () {
                console.log("cargado exitosamente");

            };

            //Tabla de productos//
            v_This.myColumns = ko.observableArray([
                { "headerText": "Cantidad", "field": "quantity", "resizable": "enabled" },
                { "headerText": "Producto", "field": "product", "resizable": "enabled" },
                { "headerText": "Inventario", "field": "inventory", "resizable": "enabled" },
                { "headerText": "Precio unitario", "field": "price", "resizable": "enabled" },
                { "headerText": "Importe", "field": "amount", "resizable": "enabled" },
                { "headerText": "", "field": "delete", "template": "deleteTemplate", }
            ]);
            // Datos de ejemplo
            v_This.tableData = ko.observableArray([
                {
                    id: 1,
                    quantity: "5 piezas",
                    product: "Producto 1",
                    inventory: "5",
                    price: "$26",
                    amount: "$156"
                },
                {
                    id: 2,
                    quantity: "2 piezas",
                    product: "Producto 2",
                    inventory: "10",
                    price: "$45",
                    amount: "$90"
                },
                {
                    id: 3,
                    quantity: "1 pieza",
                    product: "Producto 3",
                    inventory: "15",
                    price: "$120",
                    amount: "$120"
                },
                {
                    id: 4,
                    quantity: "3 piezas",
                    product: "Producto 4",
                    inventory: "8",
                    price: "$67",
                    amount: "$201"
                }
            ]);
            // Data provider para la tabla
            v_This.dataProvider = new oj.ArrayTableDataSource(
                v_This.tableData(),
                { idAttribute: 'id' }
            );
            //---Termina Tabla de productos---//          

            //Botones//
            v_This.Btn_VentasDia = function () {
                console.log("Ventas del dia");
            }

            v_This.Btn_Cobrar = function () {
                console.log("Cobrando ando");
            }
            v_This.Btn_Home = function () {
                console.log("Home");
            }
            v_This.Btn_Proveedores = function () {
                console.log("Proveedores");
            }
            v_This.Btn_Productos = function () {
                console.log("Productos");
            }
            v_This.Btn_Inventario = function () {
                console.log("Inventario");
            }


            v_This.Btn_EntradaDinero = function () {
                console.log("Entrada de dinero");
            }
            v_This.Btn_SalidaDinero = function () {
                console.log("Salida de dinero");
            }
            v_This.Btn_Recargas = function () {
                console.log("Recargas de celular");
            }
            v_This.Btn_Favoritos = function () { 
                console.log("Productos Favoritos");
            }

            v_This.Btn_Salir = function () {
                console.log("Saliendo del sistema y abre modal de corte");
            }



            //--Termina Botones--//

        }
        return new VT_ventas();
    }
);
