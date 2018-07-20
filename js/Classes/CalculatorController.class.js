'use strict';

class CalculatorController extends CalculatorAbstractController {
	
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
	
	
	
	
	
	/****************************
	 * ACTION METHODS
	 */
	
	/**
	 * numberAction
	 * 
	 * @param mixed el
	 * @param string numVal
	 * @return void
	 */
	numberAction(el, numVal) {
		this.setViewValue(numVal);
	}
	
	/**
	 * clearAction
	 * 
	 * @param mixed el
	 * @param string actionKey
	 * @return void
	 */
	clearAction(el, actionKey) {
		this.resetCalculator();
	}
	
	/**
	 * plusMinusAction
	 * 
	 * @param mixed el
	 * @param string actionKey
	 * @return void
	 */
	plusMinusAction(el, actionKey) {
		var curVal   = this.getViewValue(true);
		var appendix = '';
		
		if ( curVal[curVal.length - 1] == '%' ) 
			appendix = '%';
		
		if ( $.isNumeric(curVal) ) {
			this.setViewValue((curVal * -1) + appendix, false);
		} else {
			this.log('NaN', 'plusMinusAction');
		}
	}
	
	/**
	 * resultAction
	 * 
	 * @param mixed el
	 * @param string actionKey
	 * @return void
	 */
	resultAction(el, actionKey) {
		this.calculate();
		this.resetBuffer();
	}
	
	
	
	
	
	/****************************
	 * OPERATOR METHODS
	 */
	
	/**
	 * percentOperator
	 * 
	 * @return void
	 */
	percentOperator() {
		// Get the current values
		var curVal = this.getViewValue(true),
			bufVal = this.getBufferValue();

		// @todo better error handling
		if ( bufVal < 0 ) return false;

		// calc
		curVal = (bufVal / 100) * curVal;

		// set real val to calc
		if ( $.isNumeric(curVal) ) {
			this.setViewValue(curVal, false, false);
		} else return false;
	}
	
	/**
	 * multiplyOperator
	 * 
	 * @return void
	 */
	multiplyOperator() {
		this.calculate();
		this.setOperator('*', true);
	}
	
	/**
	 * divisionOperator
	 * 
	 * @return void
	 */
	divisionOperator() {
		this.calculate();
		this.setOperator('/', true);
	}
	
	/**
	 * addOperator
	 * 
	 * @return void
	 */
	addOperator() {
		this.calculate();
		this.setOperator('+', true);
	}
	
	/**
	 * subOperator
	 * 
	 * @return void
	 */
	subOperator() {
		this.calculate();
		this.setOperator('-', true);
	}
	
	/**
	 * commaOperator
	 * 
	 * @return void
	 */
	commaOperator() {
		// set it only once
		if ( this.getViewValue().indexOf(',') < 0 ) {
			if ( this.getViewValue(true) == 0 ) {
				this.setViewValue('0,', false);
			} else this.setViewValue(',', true);
		}
	}
}