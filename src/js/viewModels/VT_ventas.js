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
        function VT_ventas() {
            var v_This = this;
            v_This.config = config;
            v_This.ProductService = ProductService;

            v_This.BarraBusqueda = ko.observable('');

            //Fecha actual//
            const fechaActual = new Date();
            const opcionesFormatoFechaHora = {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };
            const fechaHoraFormateada = new Intl.DateTimeFormat(
                'es-MX',
                opcionesFormatoFechaHora
            )
                .format(fechaActual)
                .replace('de el', 'del');
            v_This.fechaActualFormateada = ko.observable(fechaHoraFormateada);// Fecha para mostrar en pantalla
            //
            // el total del cobro que esta por hacerse


            //document.getElementById('ModalSpinner').open();
            //document.getElementById('txtModalSpinner').textContent = "Buscando, Favor de esperar...";

            v_This.MetodoPagoSel = ko.observable('efectivo'); //metodo de pago seleccionado
            v_This.PagoRecibido = ko.observable(0); // cantidad de dinero que el cliente entrega al cajero
            v_This.Cambio = ko.observable('0.00'); // cambio que se le devuelve al cliente, calculado como PagoRecibido - CobroTotal

            v_This.ProductoSeleccionado = ko.observable(); // Observable para almacenar el producto seleccionado en la búsqueda
            v_This.BusCodigo = ko.observable(); // variable para almacenar el código de barras ingresado
            v_This.isServicioDialogOpen = ko.observable(false); // Observable que controla si el modal está abierto
            v_This.isRecargaDialogOpen = ko.observable(false);
            v_This.contadorTickets = ko.observable(1);       // contador de tickets
            v_This.CountNumProductos = ko.observable(4); // numero de productos que van a cobrarse
            v_This.RegTotal = ko.observable();           // Registro total de la venta que se acaba de relaizar
            v_This.RegPago = ko.observable();            // Registro de el pago de la venta realizada
            v_This.RegCambio = ko.observable();            // Registro de el pago de la venta realizada

            v_This.historialVentas = ko.observableArray([]); // Aquí se guardarán todos los tickets cobrados

            v_This.ticketSeleccionadoHistorial = ko.observable(null);

            v_This.TituloConfirmacion = ko.observable('');
            v_This.CuerpoConfirmacion = ko.observable('');
            v_This.accionPendiente = null; // Aquí guardaremos la función temporalmente


            // --- Historial de Auditoría (Movimientos de Devolución/Cancelación) ---
            v_This.historialMovimientos = ko.observableArray([]);
            v_This.movimientosDP = new ArrayDataProvider(v_This.historialMovimientos, { keyAttributes: 'idMovimiento' });

            v_This.productoADevolver = ko.observable(null); // Aquí guardaremos el producto que se desea devolver para usarlo en la función de confirmación

            v_This.historialDP = new ArrayDataProvider(v_This.historialVentas, { keyAttributes: 'folio' });
            // =========================
            // 📢 MENSAJES APP
            // =========================
            v_This.messages = ko.observableArray([]);

            // =========================
            // 🎫 TICKETS
            // =========================
            v_This.listaTickets = ko.observableArray([]);
            v_This.ticketActivo = ko.observable(null);
            v_This.contadorTickets = ko.observable(1);

            // =========================
            // 🧾 FACTORY DE TICKET
            // =========================
            function crearTicket(nombre) {
                return {
                    id: v_This.contadorTickets(),
                    nombre: nombre,
                    activa: ko.observable(false),

                    tableData: ko.observableArray([]),
                    PromoPorciento: ko.observable(0),
                    PromoCantidad: ko.observable(0)
                };
            }

            // =========================
            // 🎟️ TICKET INICIAL
            // =========================
            v_This.dataProvTbl = ko.observable();

            const ticketInicial = crearTicket('Ticket 1');
            ticketInicial.activa(true);

            v_This.listaTickets.push(ticketInicial);
            v_This.ticketActivo(ticketInicial);

            v_This.dataProvTbl(
                new oj.ArrayDataProvider(ticketInicial.tableData, {
                    keyAttributes: 'id'
                })
            );

            // =========================
            // 👉 SELECCIONAR TICKET
            // =========================
            v_This.seleccionarTicket = function (ticket) {
                v_This.listaTickets().forEach(t => t.activa(false));
                ticket.activa(true);
                v_This.ticketActivo(ticket);

                v_This.dataProvTbl(
                    new oj.ArrayDataProvider(ticket.tableData, {
                        keyAttributes: 'id'
                    })
                );
            };


            // =========================
            // ➕ NUEVO TICKET
            // =========================
            v_This.añadirTicket = function () {
                // Incrementamos SIEMPRE el contador global
                const nuevoId = v_This.contadorTickets() + 1;
                v_This.contadorTickets(nuevoId);

                v_This.listaTickets().forEach(t => t.activa(false));

                const nuevo = crearTicket('Ticket ' + nuevoId);
                nuevo.activa(true);

                v_This.listaTickets.push(nuevo);
                v_This.ticketActivo(nuevo);

                v_This.dataProvTbl(new oj.ArrayDataProvider(nuevo.tableData, { keyAttributes: 'id' }));
            };


            v_This.transitionCompleted = function () {
                console.log("cargado exitosamente");

            };

            // 1. Datos de ejemplo para select
            // const productosEjemplo = [
            //     { value: '75010001', label: 'Coca Cola 600ml', inventario: 24, costo: 12.50, precio: 18.00 },
            //     { value: '75010002', label: 'Sabritas Sal 45g', inventario: 15, costo: 11.00, precio: 17.50 },
            //     { value: '75010003', label: 'Pan Blanco Bimbo Grande', inventario: 8, costo: 38.00, precio: 45.00 },
            //     { value: '75010004', label: 'Leche Alpura Clásica 1L', inventario: 12, costo: 21.00, precio: 26.50 },
            //     { value: '75010005', label: 'Detergente Ariel 1kg', inventario: 1, costo: 32.00, precio: 42.00 },
            //     { value: '75010006', label: 'Huevo Blanco 18 pzas', inventario: 20, costo: 45.00, precio: 54.00 },
            //     { value: '75010007', label: 'Aceite Nutrioli 850ml', inventario: 10, costo: 35.00, precio: 41.50 },
            //     { value: '75010008', label: 'Arroz Extra Progreso 1kg', inventario: 18, costo: 19.50, precio: 25.00 },
            //     { value: '75010009', label: 'Atún Herdez Agua 130g', inventario: 30, costo: 16.00, precio: 21.50 },
            //     { value: '75010010', label: 'Café Nescafé Clásico 120g', inventario: 6, costo: 72.00, precio: 89.00 }
            // ];

            // 2. Variable que vinculaste en el HTML
            //v_This.opcionesProductos = new ArrayDataProvider(productosEjemplo, { keyAttributes: 'id' });
            v_This.opcionesProductos = ProductService.getProductosDP('id');
            //Tabla de productos//
            v_This.TblCols = ko.observableArray([
                { "headerText": "Cantidad", "field": "cantidad", "sortable": "disabled" },
                { "headerText": "Producto", "field": "producto", "sortable": "disabled" },
                { "headerText": "Inventario", "field": "inventario", "sortable": "disabled" },
                { "headerText": "Precio unitario", "field": "precio", "sortable": "disabled" },
                { "headerText": "Importe", "field": "importe", "sortable": "disabled" },
                { "headerText": "", "field": "acciones", "template": "actionTemplate", "sortable": "disabled" }
            ]);

            v_This.TblColsMini = [
                {
                    headerText: 'Cant.',
                    field: 'cantidad',
                    sortable: 'disabled',
                    headerClassName: 'mini-header',
                    width: '55px'
                },
                {
                    headerText: 'Prod.',
                    field: 'producto',
                    sortable: 'disabled',
                    headerClassName: 'mini-header'
                },
                {
                    headerText: '$',
                    field: 'precio',
                    sortable: 'disabled',
                    headerClassName: 'mini-header',
                    width: '60px'
                },
                {
                    template: 'actionTemplate',
                    headerClassName: 'mini-header',
                    sortable: 'disabled'
                }
            ];

            //---Termina Tabla de productos---//          

            v_This.BarraBuscar = function (event) {
                const valor = event.detail.value;
                console.log(valor);
            }
            //Botones//
            v_This.Btn_VentasDia = function () {
                //console.log("Ventas del dia");
                document.getElementById('dlgVentasDia').open();
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

            // Abrir modal del servicio
            v_This.Btn_Servicios = function () {
                console.log("Abriendo modal de servicios");
                document.getElementById("servicioDialog").open();
            };

            v_This.Btn_Cobrar = () => {
                v_This.PagoRecibido(0);
                v_This.Cambio('0.00');
                if (v_This.CobroTotal() === '0.00') {
                    config.MuestraMensaje('error', '¡Ticket vacío!', 'No hay productos en el ticket actual.');
                    return;
                }
                document.getElementById('dlgCobro').open();
            };


            // Cerrar modal
            v_This.closeServicioDialog = function () {
                document.getElementById("servicioDialog").close();

            };

            // Abrir modal de la recargas_cell
            v_This.Btn_Recargas_Cell = function () {
                console.log("Abriendo modal de recargas");
                document.getElementById("recargaDialog").open();
            };

            // Cerrar modal
            v_This.closeRecargaDialog = function () {
                document.getElementById("recargaDialog").close();

            };

            v_This.Busqueda_Codigo = function () {
                console.log("Busca codigo de barras");

            };

            // Acción: editar tarea
            v_This.editarProducto = function (item) {
                console.log(item);
                alert('Editar tarea: ' + item.id);
            };

            // Acción: eliminar tarea
            v_This.eliminarProducto = function (producto) {
                const ticket = v_This.ticketActivo();
                if (!ticket) return;
                // Eliminamos del ticket activo
                ticket.tableData.remove(function (item) {
                    return item.id === producto.id;
                });

            };

            //--Termina Botones--//
            // Manejar el clic en la lista
            v_This.cambioSeleccionHistorial = function (event) {
                const folio = event.detail.value[0];
                if (folio) {
                    const ticket = v_This.historialVentas().find(t => t.folio === folio);
                    v_This.ticketSeleccionadoHistorial(ticket);
                }
            };

            v_This.cancelarTodaLaVenta = function () {
                const ticket = v_This.ticketSeleccionadoHistorial();
                if (!ticket) return;

                v_This.TituloConfirmacion("⚠️ Cancelar Venta Completa");
                v_This.CuerpoConfirmacion(`Se cancelará toda la venta del Folio #${ticket.folio}. Esta acción no se puede deshacer.`);

                v_This.accionPendiente = function () {
                    // MOVIDO AQUÍ: Solo se registra si el usuario presiona "Aceptar"
                    v_This.registrarAuditoria(
                        'CANCELACION',
                        `Ticket completo Folio #${ticket.folio}`,
                        { producto: 'TODO EL TICKET', importe: ticket.total }
                    );

                    v_This.historialVentas.remove(ticket);
                    v_This.ticketSeleccionadoHistorial(null);
                    config.CerrarModal('MdlConfCancelaVenta');
                    config.MuestraMensaje('advertencia', 'Venta Cancelada', `El folio #${ticket.folio} ha sido eliminado.`);
                };

                document.getElementById('MdlConfCancelaVenta').open();
            };

            v_This.devolverArticulo = function (producto) {
                if (!producto) return;

                v_This.TituloConfirmacion("Devolver Artículo");
                v_This.CuerpoConfirmacion(`¿Deseas devolver "${producto.producto}"? El total y el cambio se recalcularán.`);

                v_This.accionPendiente = function () {
                    const ticketActual = v_This.ticketSeleccionadoHistorial();

                    // 1. Filtramos para quitar el producto devuelto
                    const nuevosProductos = ticketActual.productos.filter(p => p.id !== producto.id);

                    if (nuevosProductos.length === 0) {
                        config.CerrarModal('MdlConfCancelaVenta');
                        v_This.cancelarTodaLaVenta(); // Esto abrirá el modal de cancelación total
                        return;
                    }

                    // MOVIDO AQUÍ: Solo se registra si el proceso de devolución avanza
                    v_This.registrarAuditoria(
                        'DEVOLUCION',
                        `Folio #${ticketActual.folio}`,
                        producto
                    );

                    // 2. Calculamos el Nuevo Total
                    const nuevoTotal = nuevosProductos.reduce((acc, p) => acc + parseFloat(p.importe), 0);

                    // 3. Recalcunamos el cambio
                    const pagoCliente = parseFloat(ticketActual.pago);
                    const nuevoCambio = (pagoCliente - nuevoTotal).toFixed(2);

                    // 4. Actualizamos el objeto
                    ticketActual.productos = nuevosProductos;
                    ticketActual.total = nuevoTotal.toFixed(2);
                    ticketActual.cambio = nuevoCambio;

                    // 5. Notificamos cambios
                    v_This.historialVentas.valueHasMutated();
                    v_This.ticketSeleccionadoHistorial.valueHasMutated();

                    config.CerrarModal('MdlConfCancelaVenta');
                    config.MuestraMensaje('exito', 'Historial Actualizado', 'El total y el cambio han sido recalculados.');
                };

                document.getElementById('MdlConfCancelaVenta').open();
            };

            v_This.ejecutarAccionConfirmada = function () {
                if (v_This.accionPendiente && typeof v_This.accionPendiente === 'function') {
                    v_This.accionPendiente();
                }
            };



            // // 1. DEVOLVER UN ARTÍCULO
            // v_This.devolverArticulo = function (producto) {
            //     const ticketActual = v_This.ticketSeleccionadoHistorial();
            //     if (!ticketActual) return;

            //     if (confirm(`¿Devolver ${producto.producto}?`)) {
            //         // 1. Filtrar productos (quitar el seleccionado)
            //         const nuevosProductos = ticketActual.productos.filter(p => p.id !== producto.id);

            //         // 2. VALIDACIÓN: ¿Se quedó sin productos?
            //         if (nuevosProductos.length === 0) {
            //             alert("El ticket se ha quedado sin productos. Se procederá a cancelar la venta completa.");
            //             v_This.cancelarTodaLaVenta(); // Reutilizamos la función de cancelar
            //             return;
            //         }

            //         // 3. Si aún quedan productos, actualizar totales
            //         const nuevoTotal = nuevosProductos.reduce((acc, p) => acc + parseFloat(p.importe), 0).toFixed(2);

            //         // Actualizamos el objeto directamente
            //         ticketActual.productos = nuevosProductos;
            //         ticketActual.total = nuevoTotal;

            //         // 4. Notificar a JET de los cambios
            //         v_This.historialVentas.valueHasMutated();
            //         v_This.ticketSeleccionadoHistorial.valueHasMutated();

            //         config.MuestraMensaje('exito', 'Devolución', 'Artículo removido y total actualizado.');
            //     }
            // }.bind(v_This);

            // // 2. CANCELAR TODA LA VENTA
            // v_This.cancelarTodaLaVenta = function () {
            //     const ticket = v_This.ticketSeleccionadoHistorial();
            //     if (!ticket) return;

            //     // Removemos del historial global
            //     v_This.historialVentas.remove(ticket);

            //     // Limpiamos la selección para que el panel derecho del modal se vacíe
            //     v_This.ticketSeleccionadoHistorial(null);

            //     config.MuestraMensaje('advertencia', 'Venta Cancelada', `El folio #${ticket.folio} ha sido eliminado.`);
            // };


            v_This.controlarHeaderCont = function () {
                const header = document.getElementById('headerSeccion');
                if (!header) return;

                const esPantallaPequena = window.innerWidth <= 900;
                header.style.display = esPantallaPequena ? 'none' : 'flex';
            };


            v_This.SeleccionProducto = (event) => {
                const codigo = event.detail.value;
                if (codigo) {
                    v_This.agregarProductoATabla(codigo);
                    // Limpiamos el select para la siguiente búsqueda
                    setTimeout(() => { v_This.ProductoSeleccionado(null); }, 100);
                }
            };

            v_This.BusCodigo = ko.observable(''); // Vinculado a tu oj-input-text


            v_This.agregarProductoATabla = (codigo) => {
                if (!codigo) return;

                const ticket = v_This.ticketActivo();
                if (!ticket) return;

                //const infoProd = productosEjemplo.find(p => p.value === codigo);
                const infoProd = ProductService.buscarPorCodigo(codigo);
                if (!infoProd) {
                    alert("Producto no encontrado");
                    return;
                }

                if (infoProd.inventario <= 3) {
                    alert("Inventario bajo: " + infoProd.label);
                }

                const tabla = ticket.tableData();
                const existente = tabla.find(item => item.id === infoProd.value);

                if (existente) {
                    existente.cantidad += 1;
                    existente.importe = (existente.cantidad * parseFloat(infoProd.precio)).toFixed(2);
                    ticket.tableData.valueHasMutated();
                } else {
                    ticket.tableData.push({
                        id: infoProd.value,
                        producto: infoProd.label,
                        cantidad: 1,
                        inventario: infoProd.inventario.toString(),
                        precio: infoProd.precio.toString(),
                        importe: infoProd.precio.toString()
                    });
                }
            };
            // =========================
            // 💰 TOTAL POR TICKET
            // =========================
            v_This.CobroTotal = ko.pureComputed(() => {
                const ticket = v_This.ticketActivo();
                if (!ticket) return '0.00';

                let total = 0;
                ticket.tableData().forEach(item => {
                    total += parseFloat(item.importe) || 0;
                });

                return total.toFixed(2);
            });
            let bloqueando = false;

            v_This.ticketActivo.subscribe(ticket => {
                if (!ticket) return;

                ticket.PromoPorciento.subscribe(val => {
                    if (bloqueando) return;
                    bloqueando = true;

                    const total = parseFloat(v_This.CobroTotal());
                    ticket.PromoCantidad(((total * val) / 100).toFixed(2));

                    bloqueando = false;
                });

                ticket.PromoCantidad.subscribe(val => {
                    if (bloqueando) return;
                    bloqueando = true;

                    const total = parseFloat(v_This.CobroTotal());
                    ticket.PromoPorciento(total > 0 ? ((val / total) * 100).toFixed(2) : 0);

                    bloqueando = false;
                });
            });

            v_This.eliminarTicket = function (ticket, event) {
                // Evita que también se seleccione
                event.stopPropagation();

                const tieneProductos = ticket.tableData().length > 0;

                if (tieneProductos) {
                    const confirmar = confirm(
                        'Este ticket tiene productos.\n¿Seguro que deseas eliminarlo?'
                    );
                    if (!confirmar) return;
                }

                const esActivo = ticket === v_This.ticketActivo();

                // Eliminar
                v_This.listaTickets.remove(ticket);

                // Si era el activo, seleccionar otro
                if (esActivo) {
                    const restantes = v_This.listaTickets();
                    if (restantes.length > 0) {
                        v_This.seleccionarTicket(restantes[0]);
                    } else {
                        v_This.ticketActivo(null);
                        v_This.dataProvTbl(null);
                    }
                }
            };

            // --- ACCIÓN DEL BOTÓN LUPA ---
            v_This.Busqueda_Codigo = () => {
                const codigoABuscar = v_This.BusCodigo();
                const exito = v_This.agregarProductoATabla(codigoABuscar);
                if (exito) {
                    v_This.BusCodigo(''); // Limpiar el campo después de agregar
                }
                console.log("Buscando...");
                // ... tu lógica de búsqueda ...

                // FORZAR EL FOCO DE VUELTA AL TERMINAR
                setTimeout(() => {
                    document.getElementById('barcodeInput').focus();
                    v_This.BusCodigo(""); // Limpiamos para el siguiente producto
                }, 100);
            };
            v_This.presionarEnter = (event) => {
                // Usamos .key en lugar de .keyCode
                if (event.key === "Enter") {
                    v_This.Busqueda_Codigo();
                    // En JET, para detener la propagación a veces se usa:
                    event.preventDefault();
                    return false;
                }
                return true;
            };

            v_This.MetodoPago = function (metodo) {
                v_This.MetodoSeleccionado(metodo);
                // Limpiamos valores al cambiar
                v_This.PagoRecibido(0);
                v_This.Cambio(0);
            };

            v_This.PagoCambio = (event) => {
                const pago = parseFloat(event.detail.value) || 0;
                const total = parseFloat(v_This.CobroTotal()) || 0;
                const cambio = pago - total;
                v_This.Cambio(cambio >= 0 ? cambio.toFixed(2) : '0.00');
            };

            // Ejecutar al cargar la vista
            v_This.controlarHeaderCont();
            // Ejecutar al redimensionar la pantalla
            window.addEventListener('resize', v_This.controlarHeaderCont);



            v_This.selecPagoCambio = function (event) {
                const input = event.currentTarget.querySelector('input');
                if (input) {
                    setTimeout(() => {
                        input.select();
                    }, 10);
                }
            };
            // 1. Foco automático al abrir
            v_This.enfocarCobro = function () {
                const component = document.getElementById('inputCobro');
                if (component) {
                    component.focus();
                    const innerInput = component.querySelector('input');
                    if (innerInput) {
                        setTimeout(() => {
                            innerInput.select();
                        }, 50);
                    }
                }
            };

            // 2. Manejar Números + Tecla Enter
            v_This.manejarTecladoCobro = function (event) {
                // Si presiona Enter
                if (event.key === 'Enter') {
                    event.preventDefault(); // Evitamos ruidos del navegador
                    v_This.ConfirmarCobro();  // Ejecutamos tu función de cobro
                    return false;
                }
                return config.SoloNumeros(event);
            };

            v_This.ConfirmarCobro = function () {
                const total = parseFloat(v_This.CobroTotal());
                const pago = parseFloat(v_This.PagoRecibido());

                if (pago < total) {
                    config.MuestraMensaje('error', 'Monto Insuficiente', 'El pago debe ser mayor o igual al total.');
                    return;
                }

                const ticketParaVender = v_This.ticketActivo();
                if (!ticketParaVender) return;

                // --- LOG Y REGISTRO ---
                const datosVentaFinal = {
                    folio: ticketParaVender.id, // El número de ticket que tenía
                    nombreTicket: ticketParaVender.nombre,
                    fecha: new Date().toLocaleTimeString(),
                    productos: ko.toJS(ticketParaVender.tableData()),
                    total: total.toFixed(2),
                    pago: pago.toFixed(2),
                    cambio: v_This.Cambio()
                };

                // Guardamos en nuestro historial global
                v_This.historialVentas.push(datosVentaFinal);

                // Log para que veas cuántos tickets llevas en total
                console.log("Ticket Cobrado:", datosVentaFinal);
                console.log("Total de tickets vendidos hoy:", v_This.historialVentas().length);

                // --- ACTUALIZACIÓN DE REGISTROS VISUALES ---
                v_This.RegTotal(total.toFixed(2));
                v_This.RegPago(pago.toFixed(2));
                v_This.RegCambio(v_This.Cambio());

                // --- ELIMINACIÓN Y CONTINUIDAD ---
                v_This.listaTickets.remove(ticketParaVender);

                const restantes = v_This.listaTickets();
                if (restantes.length > 0) {
                    v_This.seleccionarTicket(restantes[restantes.length - 1]);
                } else {
                    // IMPORTANTE: Aquí no reseteamos v_This.contadorTickets
                    // Así, si se cobró el Ticket 1, el siguiente será Ticket 2
                    v_This.añadirTicket();
                }

                // Limpiar y cerrar
                v_This.PagoRecibido(0);
                v_This.Cambio('0.00');
                document.getElementById('dlgCobro').close();
                config.MuestraMensaje('exito', 'Venta Registrada', 'Folio #' + datosVentaFinal.folio);
            };

            // Función para registrar el movimiento (Reutilizable)
            v_This.registrarAuditoria = function (tipo, detalle, producto = null) {
                const ahora = new Date();
                const nuevoMovimiento = {
                    idMovimiento: Date.now(), // ID único basado en tiempo
                    fecha: ahora.toLocaleDateString(),
                    hora: ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    tipo: tipo, // 'DEVOLUCION' o 'CANCELACION'
                    detalle: detalle, // Ej: "Folio #105"
                    producto: producto ? producto.producto : 'N/A',
                    monto: producto ? producto.importe : '0.00',
                    usuario: "Admin" // Aquí después conectarás el perfil del usuario
                };

                // Agregamos al principio para que lo más nuevo salga arriba
                v_This.historialMovimientos.unshift(nuevoMovimiento);
            };

            v_This.prueba = function () {

                document.getElementById('Modal_Auditoria').open();
            }
            v_This.prueba2 = function () {
                if (v_This.accionPendiente && typeof v_This.accionPendiente === 'function') {
                    v_This.accionPendiente(); // Ejecutamos la función guardada
                }
                document.getElementById('MdlConfCancelaVenta').close();

                console.log("simon");

            }
        }


        return new VT_ventas();
    }
);
