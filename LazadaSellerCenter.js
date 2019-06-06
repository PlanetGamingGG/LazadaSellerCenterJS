/**
 * Determine the length of an object
 * 
 * @param object obj
 */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/** 
 * Document manipulator
 */
doc = {
	getElement(id){
		return document.getElementById(id);
	},
	getClassElement(id){
		return document.getElementsByClassName(id);
	},
	createElement(elem, attr={}, innerHtml=''){
		let element = document.createElement(elem);

		if(Object.size(attr) === 0){
			if(innerHtml.length === 0){
				return element;
			}
			element.innerHTML = innerHtml
			return element;
		}

		element = this.setAttribute(element, attr);
		if(innerHtml.length !== 0){
			element.innerHTML = innerHtml;
		}
		return element;
	},
	createAttribute(attr){
		return document.createAttribute(attr);
	},
	setAttribute(elem, attr={}){
		if(typeof attr !== 'object'){
			return null;
		}
		
		let keys = Object.keys(attr);
		for (let i = 0; i <= keys.length - 1; i++) {
			elem.setAttribute(keys[i], attr[keys[i]]);
		}

		return elem;
	},
	appendChild(elem, child){
		return elem.appendChild(child);
	},
	prependChild(elem, child){
		return elem.insertBefore(child, elem.firstChild);
	},
	removeElement(elem){
		return elem.parentNode.removeChild(elem);
	}
}

/**
 * Alert Counter
 */
window.alertCounter = 0;

/**
 * Alert Object
 *
 * @function add Add an alert
 * @function dismiss Dismiss an alert
 * @function dismissAll Dismiss all alert
 * @function dismissAbout Dismiss alerts with the same "about"
 * @function render Render alerts
 * @var array alerts All alerts
 */
Alert = {
	add(type='info', message, about=null){
		let alert = {
			id: window.alertCounter + 1,
			timestamp: + new Date(),
			dateObject: new Date(),
			about: about,
			type: type,
			message: message
		};

		window.alertCounter++;

		this.alerts.push(alert);
		this.render();
		return alert;
	},
	dismissAbout(about){
		let alerts = this.alerts;
		let toDismiss = [];

		alerts.forEach((alert) => {
			if(alert.about == about){
				toDismiss.push(alert.id);
			}
		});

		toDismiss.forEach((id) => {
			this.dismiss(id);
		});

		return {
			dismissed: toDismiss.length
		};
	},
	dismissAll(){
		let alertCount = this.alerts.length;
		this.alerts = [];
		this.render();

		return {
			dismissed: alertCount
		};
	},
	dismiss(id){
		let alerts = this.alerts;
		let toDismiss = [];
		let currentPosition = 0;

		alerts.forEach((alert) => {
			if(alert.id == id){
				toDismiss.push(currentPosition);
			}
			currentPosition++;
		});

		toDismiss.forEach((position) => {
			this.alerts.splice(position, 1);
		})

		this.render();
		return {
			dismissed: toDismiss.length
		};
	},
	render(){
		let container = doc.getElement('alerts_container');
		container.innerHTML = ''; // Clear container

		this.alerts.forEach(function(e){
			let elem = doc.createElement("div", {
				class: `alert alert-${e.type}`
			}, `[${e.about} @ ${e.dateObject.getHours()}:${e.dateObject.getMinutes()}:${e.dateObject.getSeconds()}] ${e.message}`);
			doc.appendChild(container, elem);
		});
	},
	alerts: []
}

/**
 * Routing system
 */
Routes = {
	'/order/query': function(){
		return InitOrderQueryPage();
	}
};

(function(){
	let keys = Object.keys(Routes);
	for (let i = 0; i <= keys.length - 1; i++) {
		if(location.pathname == keys[i]){
			Routes[keys[i]]();
		}
	}
})();

/**
 * Initialize Order Query Page
 */
function InitOrderQueryPage(){
	setTimeout(function(){
		let alerts_container = doc.createElement("div", {
			id: 'alerts_container'
		});
		doc.prependChild(document.getElementsByClassName('la-page-filters')[0], alerts_container);

		Button.inject(); 

		// Reset Alert Button Injection
		(function(){
			let container = doc.getClassElement('next-tabs-nav')[0];

			let wrapper = doc.createElement('div', {class: 'next-tabs-tab'});
			let inner = doc.createElement('div', {class: 'next-tabs-tab-inner'});
			let content = doc.createElement('span', {onclick: 'InteractionHandler.dismissAllAlerts()'}, 'Dismiss All Alerts');

			inner.appendChild(content);
			wrapper.appendChild(inner);

			container.appendChild(wrapper);
		})();

	}, 3500);
}

/**
 * Orders Object
 */
var Orders = {
	select(orderNumbers){
		let status = {
			selected: [],
			missing: []
		};

		if(orderNumbers.length === 0){
			return result;
		}

		orderNumbers.forEach((order) => {
			let xpath = document.evaluate(`//a[text()='${order}']`, document, null, XPathResult.ANY_TYPE, null);
			let element = xpath.iterateNext();

			if(element == null){
				status.missing.push(order);
				return;
			}
			
			let click = function(){
				element.parentNode.parentNode.parentNode.parentNode.parentNode.firstChild.firstChild.firstChild.lastChild.click()
			};

			click();
			status.selected.push(order);
		});
		return status;
	},
	getOrdersElement(){
		return document.getElementsByClassName('next-table-row');
	},
	getOrders(){
		let orders = this.getOrdersElement();
		let orders_array = [];

		let thisOrder = function(selector){
			return orders[i].getElementsByClassName(selector);
		}

		for (var i = 0; i < orders.length; i++) {

			let orderNumber = thisOrder('orderNumber')[0].firstChild.firstChild.firstChild.firstChild.innerText;

			orders_array.push({
				select: function(){
					let order = [];
					order.push(orderNumber);
					return Orders.select(order);
				},
				orderNumber: orderNumber, // Defined at the top
				isSelected: thisOrder('next-table-selection')[0].firstChild.firstChild.lastChild.checked,
				isPrinted: (function(){
					let x = thisOrder('printed')[0].firstChild.firstChild.firstChild.firstChild.firstChild.getAttribute("style");
					if(x !== 'color: rgb(29, 193, 29);'){
						return false;
					}
					return true;
				})(),
				orderDate: thisOrder('orderDate')[0].firstChild.firstChild.firstChild.innerText
			});
		}
		return orders_array;
	}
};

/**
 * SelectOrders Object
 */
var SelectOrders = {
	toPrint: function(){
		let status = {
			selected: [],
			orderCount: 0
		};

		let orders = Orders.getOrders();
		orders.forEach((order) => {
			if(order.isPrinted == false && order.isSelected == false){
				order.select();
				status.selected.push(order.orderNumber);
			}
			status.orderCount++;
		});

		return status;
	},
	invertSelection: function(){
		let status = {
			inverted: [],
			invertedCount: 0
		};

		let orders = Orders.getOrders();
		orders.forEach((order) => {
			order.select();
			status.inverted.push(order.orderNumber);
			status.invertedCount++;
		});

		return status;
	},
	countSelected(){
		let orders =  Orders.getOrders();
		let selected = 0;
		let orderCount = 0;

		orders.forEach((order) => {
			if(order.isSelected){
				selected++;
			}
			orderCount++;
		});
		
		return {
			selected: selected,
			outOf: orderCount
		};
	}
};

/**
 * Interaction Handler Object
 */
var InteractionHandler = {
	invertSelection: function(){
		let result = SelectOrders.invertSelection();
		Alert.dismissAbout('OrderInvertSelection');
		Alert.add('info', `Inverted ${result.invertedCount} orders`, 'OrderInvertSelection');

		return {
			inverted: result.invertedCount
		};
	},
	countSelected: function(){
		let result = SelectOrders.countSelected();

		Alert.dismissAbout('OrderSelectedCount');
		Alert.add('info', `Selected ${result.selected} out of ${result.outOf} orders`, 'OrderSelectedCount');

		return {
			selected: result.selected,
			outOf: result.outOf
		};
	},
	selectToPrint: function(){
		let result = SelectOrders.toPrint();

		Alert.dismissAbout('OrderSelectToPrint');
		if(result.selected.length == 0){
			Alert.add('info', `All orders on this page has been printed`, 'OrderSelectToPrint');
		}else{
			Alert.add('success', `Selected ${result.selected.length} out of ${result.orderCount} orders to print`, 'OrderSelectToPrint');
		}
	
		return result;
	},
	dismissAllAlerts: function(){
		let result = Alert.dismissAll();

		if(result){
			let alert = Alert.add('danger', `All (${result.dismissed}) alerts has been dismissed. This will be cleared in 3s`, 'NoticeAlertDismissed');
			setTimeout(() => {
				Alert.dismiss(alert.id);
			}, 3000);
		}

		return result;
	}
}

/**
 * Button Interface Object
 */
var Button = {
	buttons: [
		{
			text: 'Invert Selection',
			handler: "invertSelection"
		},
		{
			text: 'Count Selected',
			handler: "countSelected"
		},
		{
			text: 'Select Orders to Print',
			handler: "selectToPrint"
		}
	],
	inject: function(){
		let container = doc.getClassElement('next-col col-secondary')[0];

		this.buttons.forEach((button) => {
			let element = doc.createElement('button', {
				class: "next-btn next-btn-normal next-btn-medium",
				onclick: `InteractionHandler.${button.handler}()`
			}, button.text);

			doc.prependChild(container, element);
		});
	}
};
