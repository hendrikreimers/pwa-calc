'use strict';

/*********************************************************/
/*  Calculator PWA                                       */
/*                                                       */
/*  Author: Hendrik Reimers                              */
/*  GIT: https://www.github.com/hendrikreimers/pwa-calc  */
/*                                                       */
/*********************************************************/

class CalculatorController extends CalculatorAbstractController {

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
			bufVal = this.getBufferValue(),
			opFunc = this.getOperatorFunc('%');

		// @todo better error handling
		if ( (bufVal < 0) || (typeof opFunc !== 'function') ) return false;

        // debug
        this.log('convert percent value', 'percentOperator');

        // calc
		curVal = this.getOperatorFunc('%')(bufVal, curVal);

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