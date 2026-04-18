/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */


(function () {
    // The "oj_whenReady" global variable enables a strategy that the busy context whenReady,
    // will implicitly add a busy state, until the application calls applicationBootstrapComplete
    // on the busy state context.
    window["oj_whenReady"] = true;

    requirejs.config(
    {
      baseUrl: './js',

      paths:
      /* DO NOT MODIFY
      ** All paths are dynamicaly generated from the path_mappings.json file.
      ** Add any new library dependencies in path_mappings json file
      */
      // injector:mainReleasePaths
      {
        "knockout":                "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/knockout/knockout-3.5.1",
      "jquery":                   "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/jquery/jquery-3.7.1",
      "jqueryui-amd":             "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/jquery/jqueryui-amd-1.14.1",
      "hammerjs":                 "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/hammer/hammer-2.0.8",
      "ojdnd":                    "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/dnd-polyfill/dnd-polyfill-1.0.2",
      "ojs":                      "https://static.oracle.com/cdn/jet/19.0.0/default/js/min/",
      "ojL10n":                   "https://static.oracle.com/cdn/jet/19.0.0/default/js/debug/ojL10n",
      "ojtranslations":           "https://static.oracle.com/cdn/jet/19.0.0/default/js/resources/",
      "@oracle/oraclejet-preact": "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/oraclejet-preact/amd",
      "oj-c":                     "https://static.oracle.com/cdn/jet/19.0.0/packs/oj-c",
      "persist":                  "https://static.oracle.com/cdn/jet/19.0.0/persist/debug",
      "text":                     "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/require/text",
      "signals":                  "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/js-signals/signals",
      "touchr":                   "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/touchr/touchr",
      "preact":                   "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/preact/dist/preact.umd",
      "preact/hooks":             "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/preact/hooks/dist/hooks.umd",
      "preact/compat":            "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/preact/compat/dist/compat.umd",
      "preact/jsx-runtime":       "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/preact/jsx-runtime/dist/jsxRuntime.umd",
      "preact/debug":             "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/preact/debug/dist/debug.umd",
      "preact/devtools":          "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/preact/devtools/dist/devtools.umd",
      "proj4":                    "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/proj4js/dist/proj4-src",
      "css":                      "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/require-css/css",
      "ojcss":                    "https://static.oracle.com/cdn/jet/19.0.0/default/js/debug/ojcss",
      "ojs/ojcss":                "https://static.oracle.com/cdn/jet/19.0.0/default/js/debug/ojcss",
      "chai":                     "https://static.oracle.com/cdn/jet/19.0.0/chai/chai",
      "css-builder":              "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/require-css/css-builder",
      "normalize":                "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/require-css/normalize",
      "ojs/normalize":            "https://static.oracle.com/cdn/jet/19.0.0/3rdparty/require-css/normalize",
      "jet-composites":           "jet-composites",
      }
      // endinjector
    }
  );
}());

/**
 * Load the application's entry point file
 */
require(['./root']);
