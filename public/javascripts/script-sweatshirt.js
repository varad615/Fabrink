var e = document.getElementById("color-type");
var strUser = e.value;

function rate() {
  var qty = document.getElementById("user-qty").value;
  var print = document.getElementById("color-type").value;
  var color = document.getElementById("user-color").value;

  var quantity;
  var print_type;
  var tshirt_color;

  if (print == "DTG") {
    print_type = 50;
  } else {
    print_type = 70;
  }

  if (color == "White") {
    tshirt_color = 40;
    document.getElementById("t-shirt-color").src="/images/White Sweatshirt.png";
  } else if (color == "Black") {
    tshirt_color = 30;
    document.getElementById("t-shirt-color").src="/images/Black Sweatshirt.png";
  } else if (color == "Blue") {
    tshirt_color = 50;
    document.getElementById("t-shirt-color").src="/images/Blue Sweatshirt.png";
  }



 

  var final_value = print_type + tshirt_color ;
  var final_with_qty = final_value*qty;
  console.log(final_with_qty)

  document.getElementById("final-rate").value = final_with_qty +"/-";


  if (final_with_qty == 0) {
    document.getElementById("place-order").disabled = true; 
  } else {
    document.getElementById("place-order").disabled = false; 
  }
}
