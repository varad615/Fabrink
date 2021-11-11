function product() {
  var product_page = document.getElementById("product_option").value;
  var id = document.getElementById("user-id").value;
  
  if (product_page == 1) {
    window.location.href = `/user/mockup/tshirt/${id}`;
  } else if (product_page == 2) {
    window.location.href = `/user/mockup/sweatshirt/${id}`;
  } else if (product_page == 3) {
    window.location.href = `/user/mockup/hoodie/${id}`;
  }
}
