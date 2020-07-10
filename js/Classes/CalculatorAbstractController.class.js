'use strict';

/*********************************************************/
/*  Calculator PWA                                       */
/*                                                       */
/*  Author: Hendrik Reimers                              */
/*  GIT: https://www.github.com/hendrikreimers/pwa-calc  */
/*                                                       */
/*********************************************************/

/**
 * More complex Controller to be an Abstract
 *
 * Implements any kind of helper functions (no actions)
 * which are called by an action hit by an button or something else
 */
class CalculatorAbstractController {
	
	/**
	 * propertyMapper
	 * 
	 */
	properties() {
		this.props = {
			debug: false,
			
			bufferNumber: 0,
			bufferOperator: '',
			resetViewValNextTime: false,
			
			p: null,
			
			viewResult: null,
			viewButtonsNum: null,
			viewButtonsOp: null,
			viewButtonsAct: null
		};
		
		this.operatorCalcFunctions = {
			'*': (a, b) => a * b,
			'/': (a, b) => a / b,
			'+': (a, b) => a + b,
			'-': (a, b) => a - b,
			'%': (a, b) => (a / 100) * b
		}
	}
	
	/**
	 * classConstructor
	 * 
	 */
	constructor(parentIdentifier) {
		// Register properties (variables)
		this.properties();
		
		// Find elements
		this.props.p              = document.querySelector(parentIdentifier);                           // Calculator Wrapper
		this.props.viewResult     = document.getElementById('value');         // Value field
		this.props.viewButtonsNum = this.props.p.querySelectorAll('.btn[data-val]'), // Buttons for Numbers
		this.props.viewButtonsOp  = this.props.p.querySelectorAll('.btn[data-op]'),  // Buttons for Operators
		this.props.viewButtonsAct = this.props.p.querySelectorAll('.btn[data-act]'); // Buttons for Actions

		// Register Events to the buttons
		this.setEventsToButtons();
		
		// Init value (not 42)
		this.props.viewResult.innerText = 0;
	}
	
	/**
	 * Console log helper
	 * 
	 * @param string msg 		Your message to be written to console
	 * @param string funcName 	Optional, the name of the function you're calling this func
	 * @return void
	 */
	log(msg, funcName) {
		if ( !this.props.debug ) return;
		
		if ( funcName ) {
			msg = msg + ' (in "' + funcName + '")';
		}
		
		console.log(msg);
	}

    /**
     * Calculates ;-)
     *
     * @return void
     */
    calculate() {
        // Calc if another operator is active
        if ( this.getOperator() != '' ) {
            let curOp  = this.getOperator(),
                curVal = this.getViewValue(true),
                bufVal = this.getBufferValue();

            this.log('calc: ' + bufVal + ' ' + curOp + ' ' + curVal, 'calculate');

            // Get operation function
            let opFunc = this.getOperatorFunc(curOp);

            // If available calculate
            if ( opFunc !== false ) {
                this.log('opFuncCall', 'calculate');

                // Calculate
                let result = opFunc(bufVal, curVal);

                // Write the calculated val to the view
                this.setViewValue(result, false, false);

                // Reset the buffer so next time its not multiplied
                this.resetBuffer();
            }
        }
    }
	
	/**
	 * Attach the click events to each button
	 * 
	 * @return void
	 */
	setEventsToButtons() {
		this.log('set event buttons', 'setEventsToButtons');
		
		let self = this;

		// Unpack with "[...NodeList]" to an array so we get an array on which we can map each element
		this.props.viewButtonsNum.forEach(el => el.addEventListener('click', function(el) {
			var numVal = this.dataset.val;

			self.log(numVal, 'btnEvtNum');
			self.callNumberMethod(el, numVal);
		}));

		// Unpack with "[...NodeList]" to an array so we get an array on which we can map each element
		this.props.viewButtonsOp.forEach(el => el.addEventListener('click', function(el) {
			var operatorVal = this.dataset.op;
			
			self.log(operatorVal, 'btnEvtOp');
			self.callOperatorMethod(el, operatorVal);
		}));

		// Unpack with "[...NodeList]" to an array so we get an array on which we can map each element
		this.props.viewButtonsAct.forEach(el => el.addEventListener('click', function(el) {
			var actionName = this.dataset.act;
			
			self.log(actionName, 'btnEvtAct');
			self.callActionMethod(el, actionName);
		}));
	}
	
	/**
	 * Sets a new value or append a num to the value in the viewResult element
	 * 
	 * @param string newVal 		the value to write
	 * @param bool append 			Append the val to the current value [Default: false]
	 * @param bool preWriteBuffer 	Write the old val to the buffer (needed for calculation) [Default: false]
	 * @return void
	 */
	setViewValue(newVal, append = true, preWriteBuffer = false) {
		this.log('newVal[' + newVal + '], append[' + append + '], preWriteBuffer[' + preWriteBuffer + ']', 'setViewValue');
		
		if ( this.props.resetViewValNextTime ) {
			this.props.resetViewValNextTime = false;
			
			append         = false;
			preWriteBuffer = true;
		}
		
		// Define variables
		var view   = this.props.viewResult,
			curVal = this.getViewValue(false);
			
		// Writes the current value into buffer, before set new value
		if ( preWriteBuffer )
			this.props.bufferNumber = curVal;
		
		// Transform newVal to human readable string
		newVal = newVal.toLocaleString();
		
		// Append if current value not zero and appending is enabled
		if ( append && (curVal != '0') ) {
			view.innerText = curVal + '' + newVal;
		} else {
			view.innerText = newVal;
		}
	}
	
	/**
	 * Returns the current view value
	 *
	 * @param bool asNumber
	 * @return string
	 */
	getViewValue(asNumber = false) {
		// Get value
		let val = this.props.viewResult.innerText;
		
		// Convert to real number
		if ( asNumber )
			val = this.convertToNumber(val);
		
		// Debug
		this.log(val + '[asNumber: ' + asNumber + ']', 'getViewValue');
		
		// Return
		return val;
	}
	
	/**
	 * Returns the number in bufferNumber
	 *
	 * @return float
	 */
	getBufferValue() {
		return this.convertToNumber(this.props.bufferNumber);
	}
	
	/**
	 * Sets a new operator active
	 *
	 * @param bool resetViewValNextTime
	 * @return void
	 */
	setOperator(op, resetViewValNextTime = false) {
		this.log(op, 'setOperator');
		
		this.props.resetViewValNextTime = resetViewValNextTime;
		this.props.bufferOperator = op;
	}
	
	/**
	 * Returns the current active operator
	 *
	 * @return char
	 */
	getOperator() {
		this.log('getOperator');
		return this.props.bufferOperator;
	}
	
	/**
	 * Returns an operator function
	 * 
	 * @param char operator
	 * @return false|function
	 */
	getOperatorFunc(operator) {
		if ( this.operatorCalcFunctions[operator] ) {
			return this.operatorCalcFunctions[operator];
		} else return false;
	}
	
	/**
	 * Resets the calculator (recently on pressing "C" Button)
	 *
	 * @return void
	 */
	resetCalculator() {
		this.log('resetting', 'resetCalculator');
		
		this.resetBuffer();
		this.setViewValue('0', false, false);
	}
	
	/**
	 * Resets the buffer
	 *
	 * @return void
	 */
	resetBuffer() {
		this.props.bufferNumber = 0;
		this.props.bufferOperator = '';
		this.props.resetViewValNextTime = false;
	}

    /**
     * Calls an action method based on the key string
     *
     * @param mixed el
     * @param string actionKey
     * @return void
     */
    callNumberMethod(el, actionKey) {
        this.log(actionKey, 'callNumberMethod');
        this.numberAction(el, actionKey);
    }
	
	/**
	 * Calls an action method based on the key string
	 *
	 * @param mixed el
	 * @param string actionKey
	 * @return void
	 */
	callActionMethod(el, actionKey) {
		this.log(actionKey, 'callActionMethod');
		
		switch ( actionKey ) {
			case 'C': 
				this.clearAction(el, actionKey); break;
			case '+/-':
				this.plusMinusAction(el, actionKey); break;
			case '=':
				this.resultAction(el, actionKey); break;
			default:
				break;
		}
	}
	
	/**
	 * Calls an operator method based on the key string
	 *
	 * @param mixed el
	 * @param string operatorKey
	 * @return void
	 */
	callOperatorMethod(el, operatorKey) {
		this.log(operatorKey, 'callOperatorMethod');
		
		switch ( operatorKey ) {
			case '%': 
				this.percentOperator(); break;
			case '*':
				this.multiplyOperator(); break;
			case '/':
				this.divisionOperator(); break;
			case '+':
				this.addOperator(); break;
			case '-':
				this.subOperator(); break;
			case ',':
				this.commaOperator(); break;
			default:
				break;
		}
	}
	
	/**
	 * Converts a string to number (Float)
	 *
	 * @param string val
	 * @return float
	 */
	convertToNumber(val) {
		if ( typeof val.replace !== 'function' )
			val = val.toString();
		
		val = val.replace('.', '');
		val = val.replace(',', '.');
		
		val = parseFloat(val);
	
		// Debug
		this.log(val, 'convertToNumber');
		
		// Return
		return val;
	}

	/**
	 * Checks if its a number
	 *
	 * @param n
	 * @returns {boolean|boolean}
	 */
	isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
}