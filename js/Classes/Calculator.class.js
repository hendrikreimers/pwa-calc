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
        $(document).on('keypress', function(evt) {
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

                // find the target element
                $(elements)
                    .filter('[data-' + elId + '="' + key + '"]')
                    .trigger('click');

                evt.preventDefault();
            }

            // Fire "=" Button on press Enter
            if ( evt.which === 13 ) {
                $(self.props.viewButtonsAct)
                    .filter('[data-act="="]')
                    .trigger('click');
            }
        });
    }
}