define(['knockout'], function (ko) {

  function PruebasViewModel(params) {
    const v_This = this;

    v_This.proveedor = params?.proveedor;

    console.log('HIJO recibe:', v_This.proveedor);

    v_This.cerrar = function () {
      if (params?.onCerrar) {
        params.onCerrar();
      }
    };
  }

  return PruebasViewModel;
});
