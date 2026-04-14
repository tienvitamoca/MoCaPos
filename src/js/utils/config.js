define(['knockout', 'ojs/ojcore', 'utils/config', 'ojs/ojarraydataprovider', 'jquery', 'ojs/ojbootstrap', 'ojs/ojpagingcontrol',
    'ojs/ojknockout', 'ojs/ojnavigationlist', 'ojs/ojswitcher', 'ojs/ojlabel', 'ojs/ojmodel',
    'ojs/ojinputtext', 'ojs/ojinputnumber', 'ojs/ojdatagrid', 'ojs/ojcollectiondatagriddatasource',
    'ojs/ojformlayout', 'ojs/ojprogress', 'ojs/ojpopup', 'ojs/ojbutton', 'ojs/ojpagingtabledatasource',
    'ojs/ojdatetimepicker', 'ojs/ojtimezonedata', 'ojs/ojfilepicker', 'ojs/ojarraytabledatasource',
    'ojs/ojknockout-keyset', 'ojs/ojmessages', 'ojs/ojcheckboxset', 'ojs/ojcollapsible',
    'ojs/ojvalidation-number', 'ojs/ojtable', 'ojs/ojpagingdataproviderview',
    'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojlabelvalue', 'ojs/ojselectcombobox',
    'ojs/ojdialog', 'ojs/ojradioset'],
    function (ko, oj) {
        'use strict';

        class Config {
            constructor() {

                this.MensajeTitulo = ko.observable('');
                this.MensajeCuerpo = ko.observable('');
                this.MensajeIcono = ko.observable('');
                this.MensajeColor = ko.observable('');

            }

            // =========================
            // 📢 MENSAJES APP
            // =========================
            MuestraMensaje(tipo, titulo, mensaje) {
                const config = {
                    'exito': { icon: '✨', color: 'Mensaje-bg-exito' },
                    'error': { icon: '🛑', color: 'Mensaje-bg-error' },
                    'warning': { icon: '⚠️', color: 'Mensaje-bg-warning' }
                }[tipo] || { icon: 'ℹ️', color: '' };

                this.MensajeTitulo(titulo);
                this.MensajeCuerpo(mensaje);
                this.MensajeIcono(config.icon);
                this.MensajeColor(config.color);

                // Auto-cerrar: simplemente limpiamos el título para que el 'visible' actúe
                setTimeout(() => { this.CerrarAlerta(); }, 5000);
            }
            CerrarAlerta = () => {
                this.MensajeTitulo('');
            };

            /*INPUT DE SOLO NUMERO*/
            SoloNumeros(event) {
                if (!/[0-9]/.test(event.key) && !['Backspace', 'Tab', '.', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                    event.preventDefault();
                }
            }

            CerrarModal = function (idModal) {
                if (!idModal) return;
                
                const modal = document.getElementById(idModal);
                if (modal && typeof modal.close === 'function') {
                    modal.close();
                } else {
                    console.warn("No se pudo cerrar: El ID '" + idModal + "' no existe o no es un oj-dialog.");
                }
            };

        }
        return new Config();
    });