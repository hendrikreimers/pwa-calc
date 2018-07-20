'use strict';

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
		this.props.p              = $(parentIdentifier);                    // Calculator Wrapper
		this.props.viewResult     = $(this.props.p).find('#value');         // Value field
		this.props.viewButtonsNum = $(this.props.p).find('.btn[data-val]'), // Buttons for Numbers
		this.props.viewButtonsOp  = $(this.props.p).find('.btn[data-op]'),  // Buttons for Operators
		this.props.viewButtonsAct = $(this.props.p).find('.btn[data-act]'); // Buttons for Actions
		
		// Register Events to the buttons
		this.setEventsToButtons();
		
		// Init value (not 42)
		this.props.viewResult.text(0);
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
	 * Attach the click events to each button
	 * 
	 * @return void
	 */
	setEventsToButtons() {
		this.log('set event buttons', 'callActionMethod');
		
		let self = this;
		
		$(this.props.viewButtonsNum).on('click', function(el) {
			var numVal = $(this).data('val');
			
			self.log(numVal, 'btnEvtNum');
			self.callActionMethod(el, numVal);
		});
		
		$(this.props.viewButtonsOp).on('click', function(el) {
			var operatorVal = $(this).data('op');
			
			self.log(operatorVal, 'btnEvtOp');
			self.callOperatorMethod(el, operatorVal);
		});
		
		$(this.props.viewButtonsAct).on('click', function(el) {
			var actionName = $(this).data('act');
			
			self.log(actionName, 'btnEvtAct');
			self.callActionMethod(el, actionName);
		});
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
		var view   = $(this.props.viewResult),
			curVal = this.getViewValue(false);
			
		// Writes the current value into buffer, before set new value
		if ( preWriteBuffer )
			this.props.bufferNumber = curVal;
		
		// Transform newVal to human readable string
		/*newVal = newVal.toString();
		if ( (newVal.indexOf('.') >= 0) && (newVal.indexOf(',') < 0) ) {
			newVal = newVal.replace('.', ',');
		}*/
		newVal = newVal.toLocaleString();
		
		// Append if current value not zero and appending is enabled
		if ( append && (curVal != '0') ) {
			view.text(curVal + '' + newVal);
		} else {
			view.text(newVal);
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
		var val = this.props.viewResult.text();
		
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
				this.numberAction(el, actionKey);
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
		if ( typeof val.replace != 'function' ) 
			val = val.toString();
		
		val = val.replace('.', '');
		val = val.replace(',', '.');
		
		val = parseFloat(val);
	
		// Debug
		this.log(val, 'convertToNumber');
		
		// Return
		return val;
	}
}