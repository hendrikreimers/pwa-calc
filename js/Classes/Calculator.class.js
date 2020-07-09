'use strict';

/*********************************************************/
/*  Calculator PWA                                       */
/*                                                       */
/*  Author: Hendrik Reimers                              */
/*  GIT: https://www.github.com/hendrikreimers/pwa-calc  */
/*                                                       */
/*********************************************************/

/**
 * Calculator class
 *
 * for fun extended it with keyboard events
 * normally used on ipad as pwa
 *
 */
class Calculator extends CalculatorController {

    /**
     * classConstructor
     *
     */
    constructor(parentIdentifier) {
        super(parentIdentifier);
        this.setKeyEvents();
    }

    /**
     * register Keyboard events
     *
     * @return void
     */
    setKeyEvents() {
        let self = this;

        // Register keypress event
        document.addEventListener('keypress', function(evt) {
            // declarations
            let key  = String.fromCharCode(evt.which),
                expr = { num: /[0-9]/, op: /[\/*\-+,%]/ },
                elId = null;

            // Switch method call
            if ( expr.num.test(key) ) {
                elId = 'val';
            } else if ( expr.op.test(key) ) {
                elId = 'op';
            }

            // fire if possible
            if ( elId !== null ) {
                // Debug
                self.log(key, 'keyEvent');

                // choose correct element list
                let elements = ( elId === 'val' ) ? self.props.viewButtonsNum : self.props.viewButtonsOp;

                // Trigger click event on the given button
                self.triggerClickEvent(elId, key, elements);

                // Stop original functionality
                evt.preventDefault();
            }

            // Fire "=" Button on press Enter
            if ( evt.key === 'Enter' ) {
                self.triggerClickEvent('act', '=', self.props.viewButtonsAct);
            }
        });
    }

    /**
     * Triggers a mouse click event to an element identified by a data attribute and its value
     *
     * @param dataKey
     * @param dataVal
     * @param elements
     */
    triggerClickEvent(dataKey, dataVal, elements) {
        // Filter through elements which has the given elId as data attribute and trigger a click event on them
        Array.from(elements).filter(el => el.dataset[dataKey] == dataVal).map(el => el.click());
        // [...self.props.viewButtonsAct].filter(el => el.dataset.act == '=').map(el => el.click());
    }
}