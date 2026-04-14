/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([],(function(){const n=["off","polite","assertive"];return announce=function(e,t){null!=t&&n.includes(t)||(t="polite");let o={bubbles:!0,detail:{message:e,manner:t}};document.getElementById("globalBody").dispatchEvent(new CustomEvent("announce",o))},{announce:announce}}));