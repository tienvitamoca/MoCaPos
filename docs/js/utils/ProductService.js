define(['ojs/ojarraydataprovider'], function(ArrayDataProvider) {
    /**
     * ProductService: Centraliza la gestión de productos.
     * En el futuro, aquí se realizarán las llamadas a la API (fetch/REST).
     */
    function ProductService() {
        const self = this;

        // Datos fuente (Single Source of Truth)
        //
        const _productosEjemplo = [
            { id: '75010001', value: '75010001', label: 'Coca Cola 600ml', producto: 'Coca Cola 600ml', inventario: 24, costo: 12.50, precio: 18.00 },
            { id: '75010002', value: '75010002', label: 'Sabritas Sal 45g', producto: 'Sabritas Sal 45g', inventario: 15, costo: 11.00, precio: 17.50 },
            { id: '75010003', value: '75010003', label: 'Pan Blanco Bimbo Grande', producto: 'Pan Blanco Bimbo Grande', inventario: 8, costo: 38.00, precio: 45.00 },
            { id: '75010004', value: '75010004', label: 'Leche Alpura Clásica 1L', producto: 'Leche Alpura Clásica 1L', inventario: 12, costo: 21.00, precio: 26.50 },
            { id: '75010005', value: '75010005', label: 'Detergente Ariel 1kg', producto: 'Detergente Ariel 1kg', inventario: 1, costo: 32.00, precio: 42.00 },
            { id: '75010006', value: '75010006', label: 'Huevo Blanco 18 pzas', producto: 'Huevo Blanco 18 pzas', inventario: 20, costo: 45.00, precio: 54.00 },
            { id: '75010007', value: '75010007', label: 'Aceite Nutrioli 850ml', producto: 'Aceite Nutrioli 850ml', inventario: 10, costo: 35.00, precio: 41.50 },
            { id: '75010008', value: '75010008', label: 'Arroz Extra Progreso 1kg', producto: 'Arroz Extra Progreso 1kg', inventario: 18, costo: 19.50, precio: 25.00 },
            { id: '75010009', value: '75010009', label: 'Atún Herdez Agua 130g', producto: 'Atún Herdez Agua 130g', inventario: 30, costo: 16.00, precio: 21.50 },
            { id: '75010010', value: '75010010', label: 'Café Nescafé Clásico 120g', producto: 'Café Nescafé Clásico 120g', inventario: 6, costo: 72.00, precio: 89.00 }
        ];

        /**
         * Retorna el array crudo de productos.
         */
        self.getProductosRaw = function() {
            return _productosEjemplo;
        };

        /**
         * Retorna un ArrayDataProvider listo para oj-select u oj-table.
         * @param {string} keyAttr - Atributo clave (id o value).
         */
        self.getProductosDP = function(keyAttr = 'id') {
            return new ArrayDataProvider(_productosEjemplo, { keyAttributes: keyAttr });
        };

        /**
         * Busca un producto por su código (id/value).
         */
        self.buscarPorCodigo = function(codigo) {
            return _productosEjemplo.find(p => p.id === codigo || p.value === codigo);
        };
    }

    return new ProductService();
});