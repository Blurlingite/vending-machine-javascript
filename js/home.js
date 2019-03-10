function HTMLItem(itemId,itemName,itemPrice,itemQuantity){
itemPrice = moneyFormatter(itemPrice);
// filter special characters out of itemName and assign to a new variable to use only for the button's ID
// because document.on can't handle special characters
var replaceAnd = itemName.replace("&", "");
var alsoReplaceSingleQuote = replaceAnd.replace("'","");
var alsoReplaceWhiteSpace = alsoReplaceSingleQuote.replace(" ","");

var data = `<div class="col-md-4 itemButtons">
    					<button type="button" class="btn btn-success snacks" id = "${alsoReplaceWhiteSpace}" value="${itemPrice}">
                <div class = "number">
                  <h7 data-id="${itemName}Id">${itemId}</h7><br />
                </div>
                <div class = "item">
                  <h7 id = "item${itemName}">${itemName}</h7> <br />
                </div>
                <div class = "price">
                  $${itemPrice} <br /><br />
                </div>
                <div class = "quantity">
                  <h7 id="${itemName}quantity">Quantity Left: ${itemQuantity}</h7>
                </div>
    					</button>
    				</div>`;


        return data;


}



function useMoneyButton(moneyType,moneyAmount){
  $('#' + moneyType).click(function(event){

  var numberInBoxNow = parseFloat($('#moneyBox').val());
  if(numberInBoxNow == NaN){
    numberInBoxNow = 0;
  }
  var moneyValue = moneyAmount;

  // multiply & divide otherwise you'll have lots of decimals
  var sum = (numberInBoxNow * 10 + moneyValue * 10) / 10;
  // var z = parseFloat(bFixed);
   $('#moneyBox').val(sum);

  });


}


// update the quantity on the item button by getting an array of all items and going through each one to update it's quantity
function loadItemButtons(){

  $.ajax({

    type: 'GET',
    url: 'http://localhost:8080/items',


    success: function(itemsArray){

      // array to hold the itemNames after ypu remve the special characters, to be returned

       // go through each item in the array and perform this function
       // index holds the current index of the current item u r on
       // item is the object in the itemsArray u r on
      $.each(itemsArray, function(index,item){
        var itemName = item.name;

        var itemPrice = item.price;

         // get each item's quantity from the server (to be used after an item is purchased, so the changes in quantity will be shown on item's button)
        var itemQuantity = item.quantity;

         // get each item's ID so u can identify the item to be updated
        var itemId = item.id;

        $('#allItemsOnLoadUp').append(HTMLItem(itemId,itemName, itemPrice, itemQuantity));


      });
    },

    error: function(){
      alert('Could not get items from server');
    }

  });

}



function selectItem(itemId,itemName){

    // put name of item in item box
    $('#hiddenItemId').val(itemId);
    $('#itemBox').val(itemId);

}


function makeItemButtonsWork(){

  $.ajax({

    type: 'GET',
    url: 'http://localhost:8080/items',


    success: function(itemsArray){
      // array to hold the itemNames after ypu remve the special characters, to be returned

       // go through each item in the array and perform this function
       // index holds the current index of the current item u r on
       // item is the object in the itemsArray u r on
      $.each(itemsArray, function(index,item){
        var itemName = item.name;
        // filter out special characters so you can use document.on
          itemName = itemName.replace("'", "");
          itemName = itemName.replace("&", "");
          itemName = itemName.replace(" ", "");
         // get each item's ID so u can identify the item to be updated
        var itemId = item.id;
        var itemPrice = item.price;
        var itemQuantity = item.quantity;



        // while in the .each, enable each button to work
        $(document).on('click', '#' +itemName, {theItemId: itemId,theItemName: itemName}, function(event) {
          selectItem(event.data.theItemId, event.data.theItemName);
        });


      });
    },

    error: function(){
      alert('Items not found');
    }


  });

}


$(document).ready(function(){

  loadItemButtons();  // make each item button

 // all the buttons made dynamically can be used to let user pick an item and put item's name in item box
  makeItemButtonsWork();


// allow each of the money buttons to work by passing in appropriate parameters to useMoneyButton()
  useMoneyButton('dollar',1.00);
  useMoneyButton('quarter',0.25);
  useMoneyButton('dime',0.10);
  useMoneyButton('nickel',0.05);


  // send amount of money inputted and the item ID back to server to do calculations when the 'Make Purchase' button is clicked

  // select Make Purchase button
  $('#makePurchaseButton').click(function(event){

    var amountInserted = $('#moneyBox').val();
    var itemIdIncognito = $('#hiddenItemId').val();

// use the vars you gathered to send a url to server. The server will auto calculate the change and return it to you, which is why your success function needs the data parameter
    $.ajax({

      type: 'GET',
      url: 'http://localhost:8080/money/' + amountInserted + '/' + 'item/' + itemIdIncognito,  // ex. http://localhost:8080/money/1.65/item/4

      // we need to get data back from the server, so put data parameter in success function
      success: function(change, status){

        // get the number of each coin type the server calculated after doing change and multiply them by the value of that coin

        var allQuarters = change.quarters
        var allDimes = change.dimes
        var allNickels = change.nickels
        var allPennies = change.pennies

        // find the total change by adding (and multiplying and dividing for accuracy) all the change together
        var totalChange = (allQuarters + ' Quarters '  + allDimes + ' Dimes '  + allNickels + ' Nickels ' + allPennies + ' Pennies ');

        // write the total change to the change and message, boxes
        $('#changeBox').val(totalChange);

        $('#messageBox').val('Thank You!!!');

        // set Total$ In to 0 so the user can't buy multiple items without putting in more money
        $('#moneyBox').val('0.00');

        // reset hidden input so the web app won't ask to put in more money after making a purchase but before hitting change return button
        $('#hiddenItemId').val("0");

      },

// pass in data(what you get back from server, including error messages)
        error: function(data){

          //access the error message part
          var errorMessages = (data.responseJSON.message);

          // put the error message in the messages box
          $('#messageBox').val(errorMessages);
        }


    })
  });



  // when the change return button is clicked
  $('#changeReturnButton').click(function(event){

    // empty all input boxes
    $('#moneyBox').val('');
    $('#itemBox').val('');
    $('#messageBox').val('');
    $('#changeBox').val('');

    // empty all item buttons so you can make new ones with the new quantities on line 239
    $('#allItemsOnLoadUp').empty();

    // load up the buttons again to update quantity of all items
    loadItemButtons();

    // give the Total$ In box a value so when you parse it in the useMoneyButton() it won;t pass in NaN
    $('#moneyBox').val(0.00);


  })


// End of document.ready
})


// If the moneyAmount has only 1 character after the decimal, add a 0 right after that character
function moneyFormatter(moneyAmount){

  let numberToReturn = moneyAmount;

// get an array that contains all the characters of the string after the decimal "."
  let arrayOfChars = moneyAmount.toString().split(".")[1];

// if the array is undefined (b/c the number was just a whole number , like 2, add .00 and return it)
  if(arrayOfChars === undefined){
    return numberToReturn + ".00";
  }

  // if the number isn't a whole number, you will
  // come here and get the size of the array
  let sizeOfArrayOfChars = arrayOfChars.length;



  // if the size of the array is 2(the number was something like 1.25)
  // you can return the number (1.25) as it is

  // else if the size was 1 (you got a number like 1.5), add a "0" and return it

  //else, just return the number you got
  if(sizeOfArrayOfChars === 2){
    numberToReturn = numberToReturn;
    return numberToReturn;
  }else if(sizeOfArrayOfChars === 1){
    numberToReturn = numberToReturn + "0"
    return numberToReturn;
  }else{
    return numberToReturn;
  }


}
