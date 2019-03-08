
var mockData = [{"id": "1", "name": "Snickers", "price": 1.5, "quantity": 10}, {"id": "2", "name": "M&M's", "price": 1.25, "quantity": 8},
 {"id": "3", "name": "Almond Joy", "price": 1.25, "quantity": 11}, {"id": "4", "name": "Milky Way", "price": 1.65, "quantity": 3},
{"id": "5", "name": "Payday", "price": 1.75, "quantity": 2}, {"id": "6", "name": "Reese's", "price": 1.5, "quantity": 5},
{"id": "7", "name": "Pringles", "price": 2.35, "quantity": 4}, {"id": "8", "name": "Cheezits", "price": 2, "quantity": 6},
{"id": "9", "name": "Doritos", "price": 1.95, "quantity": 7}];


function dataService(){

  this.addItem = function(data, callback, error){
    // push the data onto the form
    mockData.push(data);
    // callback is after the task it performed is finished it tells you what it did
    callback(data);
  }
  this.getItems = function(callback,error){
    // get everything from mockData and pass it along to wherever it was called
    callback(mockData);
  }
}






// HOME.JS????
function itemButtonHtml(itemId, itemName, itemPrice, itemQuantity){

// construct the recipe for 1 button, might need button tag
  var data = `<div class "itemInfo" data-itemId="1">
  <button>
  <p>{itemId}</p>
  <p>{itemName}</p>
  <p>{itemPrice}</p>
  <p>{itemQuantity}</p>
  </button>
  </div>`;

// return the html
  return data;

}

// when you get an error, tell the user (the error gets passed in)
function onError(error){
  console.log(error);
  alert('Something went wronf')
}


function onAddItem(){

}

var mockData =[]; // hold info

// an object called DataService
// when you click the button, DataService to run the addItem function. The addiTem will do what you want it to do in the code you wrote for it
var DataService = {

  // you will give the data, callback and error will be used for functions
// we have an addItem function here, that takes in 3 parameters
  addItem: function(data,callback,error){

// we push whatever you passed into the addItem function to the mockData array you declared
    mockData.push(data);

    // call the callback variable you passed in
    call(callback);
  }
}
