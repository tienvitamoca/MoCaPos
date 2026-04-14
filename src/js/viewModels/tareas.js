define([
  'knockout',
  'ojs/ojarraydataprovider',
  'ojs/ojtable',
  'ojs/ojbutton',
  'ojs/ojknockout',
  'ojs/ojbootstrap'
], function (ko, ArrayDataProvider, ojbootstrap) {

  function TareasViewModel() {
    const self = this;

    // Datos iniciales
    self.tareasList = ko.observableArray([
      { id: 1, nombre: 'Comprar víveres', estado: 'Pendiente', fecha: '2025-11-19' },
      { id: 2, nombre: 'Llamar a Juan', estado: 'Completada', fecha: '2025-11-18' }
    ]);

    // DataProvider
    self.dataProvider = new ArrayDataProvider(self.tareasList, { keyAttributes: 'id' });

    // Acción: agregar tarea
    self.agregar = function () {
      const nuevoId = self.tareasList().length + 1;
      self.tareasList.push({
        id: nuevoId,
        nombre: 'Nueva tarea',
        estado: 'Pendiente',
        fecha: new Date().toISOString().split('T')[0]
      });
    };

    // Acción: editar tarea
    self.editar = function (tarea) {
      alert('Editar tarea: ' + tarea.nombre);
    };

    // Acción: eliminar tarea
    self.eliminar = function (tarea) {
      self.tareasList.remove(tarea);
    };

    // Menú de acciones por fila
    self.createMenuItems = function (tarea) {
      return [
        { label: 'Editar', key: 'editar', startIcon: { class: 'oj-ux-ico-edit' } },
        { label: 'Eliminar', key: 'eliminar', startIcon: { class: 'oj-ux-ico-delete-circle' } }
      ];
    };

    // Listener de menú
    self.menuListener = function (event, context) {
      const tarea = context.item.data;
      if (event.detail.key === 'editar') {
        self.editar(tarea);
      } else if (event.detail.key === 'eliminar') {
        self.eliminar(tarea);
      }
    };

    // Columnas de la tabla
    self.columns = [
      { headerText: 'ID', field: 'id' },
      { headerText: 'Tarea', field: 'nombre' },
      { headerText: 'Estado', field: 'estado' },
      { headerText: 'Fecha', field: 'fecha' },
      { headerText: 'Acciones', template: 'actionTemplate' } //  conecta con el template del HTML
    ];
  }

  // Inicializar bindings
  document.addEventListener("DOMContentLoaded", function () {
  ko.applyBindings(new TareasViewModel(), document.getElementById('table'));
});


  return new TareasViewModel();
});
