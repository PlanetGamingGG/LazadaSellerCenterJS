# LazadaSellerCenterJS
Injectable JavaScript Code for Lazada Seller Center to help sellers thru their day.

**WIP BUT USEABLE. MORE COMING SOON!**

# Usage
Inject the JS and CSS into Lazada Seller Center using an Extension (Chrome: [User JavaScript and CSS](https://www.google.com "User JavaScript and CSS")).  
Refresh the page and the following button by default will be shown on Order Management page:
![What you should see](https://i.ibb.co/Z2ffB7F/image.png "What you should see")  
And this is what it looks like when it need to tell you something:
![Notice me!](https://i.ibb.co/BckMzF7/image.png "Notice me!")  
Note: The "Count Selected" button was pressed in order to make that message appear.

# Documentation

### Getting Started/Introduction
Here's the quick intro:  
- A new method called `size` was added to the `Object` object. This method is used to determine the length of an object.  
- A document manipulator object called `doc` was added.  
- `window.alertCounter` will be used to keep track of the alerts.  
- `Alert`, `Routes`, `Orders`, `SelectOrders`, `InteractionHandler`, and `Button` object was added. Explainations below.  
- `InitOrderQueryPage` function was added and will be called if the current path is `/order/query`

**About `Button` Object**
1. To add or remove buttons, edit `Button.buttons` array.  
2. Everytimne a button is clicked, the corresponding handler on `InteractionHandler` object will be called.  
3. To add a new handler, just add another method/object/function to the `InteractionHandler` object and bind it to the button from the buttons array.

**About `Orders` Object**
This is will WIP but useable. More information will be added soon!
1. You can get all orders with `Orders.getOrders()`.
2. You can select an order **from the returned object itself**. Example: `Orders.getOrders()[0].select()`.

**About `SelectOrders` Object**
This object is responsible for selective selection of the orders such as by date or by print status. Also responsible for counting and inverting the selection.


### The `Alert` Object
- The `Alert.alerts` is an Array which contains collections of JSON object that looks like the following:
```json
{
    "id": "25",
    "timestamp": "1559834459",
    "dateObject": "[object Date]",
    "about": "OrderSelectedCount",
    "type": "info",
    "message": "Selected 5 out of 10 orders"
}
```
- Alerts will be rendered with the About and Timestamp title inside a bracket for easier identification.
- See the JS file for better understanding!

### The Routing System
This system consist of a `Routes` object and an anonymous function below it.
The anonymous function will check the current path and compare it with the path registered in the routes.  
If the path matches, the function that was binded to the route will be called.  

### The `Orders` Object
**Note: Only important methods are documented. Please see the JS files for other methods!**

##### Order's `select` Method
| Argument | Type | Required | Description |
|---|---|---|---|
| orderNumbers | Array | Yes | Array of order numbers to select |
| **Returns** | JSON/Object |  | Information about selected and missed orders |

##### Order's `getOrders` Method
| Argument | Type | Required | Description |
|---|---|---|---|
| - | - | - | - |
| **Returns** | JSON/Object |  | Array of JSON Objects containing the order information |

Example order information:
```json
{
	"orderNumber": "276578706050832",
	"isSelected": false,
	"isPrinted": true,
	"orderDate": "02 Jun 2019"
}
```
