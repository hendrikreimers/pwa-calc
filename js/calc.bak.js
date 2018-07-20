$(function() {
	
	var resultView = $('#calc #value'),
		lastSign   = '',
		curNumStr  = '',
		lastOp     = '',
		prevSum    = NaN;
	
	var clear = function() {
		// todo
	};
	
	var clearAll = function() {
		resultView.html('0');
		lastSign  = '';
		lastOp    = '';
		curNumStr = '';
		prevSum   = NaN;
	};
	
	var updateResultView = function() {
		$(resultView).html(curNumStr);
	};
	
	var calculate = function(operator, a, b) {
		var ops = {	'*': (a, b) => a * b,
					'/': (a, b) => a / b,
					'+': (a, b) => a + b,
					'-': (a, b) => a - b,
					'%': (a, b) => a / 100 * b,
					'+/-': (a, b) => b - b * 2 };
		
		if ( ops[operator] ) {
			return ops[operator](parseFloat(a), parseFloat(b));
		}
	};
	
	var dotPress = function() {
		if ( curNumStr.indexOf('.') > 0 ) return;
		
		curNumStr = curNumStr + '.';
		updateResultView();
	};
	
	
	
	var numPress = function(btn) {
		var value = $(btn).data('val');
		
		if ( parseFloat(curNumStr) == 0 )
			curNumStr = '';
		
		curNumStr = curNumStr + '' + value;
		
		updateResultView();
	};
	
	var callAct = function(actionName) {
		var operator = actionName;
		
		if ( !isNaN(prevSum) ) {
			curNumStr = calculate(operator, prevSum, curNumStr);
		}
		
		prevSum   = curNumStr;
		curNumStr = '0';
		lastOp    = operator;
	};
	
	var btnPress = function(btn) {
		var action = $(btn).data('act');
		
		switch ( action ) {
			case 'C':
				clearAll();
				break;
			case '.':
				dotPress();
				break;
			case '+/-':
				curNumStr = calculate('+/-', 0, curNumStr);
				break;
			case '%':
				curNumStr = calculate('%', prevSum, curNumStr);
				break;
			case '=':
				curNumStr = calculate(lastOp, prevSum, curNumStr);
				prevSum = NaN;
				break;
			default:
				callAct(action);
				break;
		}
		
		if ( action != 'C' ) {
			updateResultView();
		}
	};
	
	
	
	$('#calc .btn').on('click', function(el) {
		var btn = $(this),
			sign = btn.data('act') || btn.data('val');
		
		if ( isNaN(sign) ) {
			btnPress(btn);
		} else if ( !isNaN(sign) ) {
			numPress(btn);
		} else return;
		
		lastSign = sign;
	});
	
	clearAll();
});