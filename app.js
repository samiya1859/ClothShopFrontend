// for getting CSRFToken
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Check if the cookie contains the specified name
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




// function getCSRFToken() {
//     const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
//     if (csrfCookie) {
//         return csrfCookie.split('=')[1];
//     }
//     return null;
// }



  

// for loading all products through API
const loadAllProducts = (search) => {
    console.log(search);
    fetch(`https://clothshopbackend-2.onrender.com/product/list/?search=${search?search:""}`)
    .then(res => res.json())
    .then(data => displayProducts(data));
};

const displayProducts = (products) => {
    const parent = document.getElementById("product-container");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    parent.innerHTML = ""; // Clear existing products

    products.forEach((product) => {
        const li = document.createElement("li");
        li.classList.add("slide-visible");
        li.innerHTML = `
            <div class="card-cloth card shadow h-90">
                <div class="cardImg ratio ratio-16x9">
                    <a  href="product-details.html?productId=${product.id}"><img src="${product.image}" class="card-img-top w-50" loading="lazy" alt="..."></a>
                </div>
                <div class="card-body p-2 p-xl-5">
                    <h6 class="brand">${product.brand}</h6>
                    <h5 style="font-weight: bold;">${product.product_name}</h5>
                    <div class="star">
                        <ul class="d-flex">
                            <li>${product.rating}</li>
                        </ul>
                    </div>
                    <div class="d-flex gap-5">
                        <h4 class="price">${product.price}</h4>
                        <div class="cart-icon">
                            <i class="ri-shopping-cart-2-line"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        parent.appendChild(li);
    });
};

loadAllProducts();

// product details

const getparams = () => {
    const params = new URLSearchParams(window.location.search).get("productId");
    console.log(params);
    fetch(`https://clothshopbackend-2.onrender.com/product/list/${params}`)
    .then(res => res.json())
    .then((data) => displayProductDetails(data));

    fetch(`https://clothshopbackend-2.onrender.com/product/reviews/?product=${params}`)
    .then((res) => res.json())
    .then((Revdata) => displayAllReviewsForAProduct(Revdata))
};


// Adding to cart
// Function to retrieve the customer ID from the JWT token
const getCustomerIdFromToken = () => {
    // Check if the user ID exists in local storage
    if (localStorage.getItem('user_id')) {
        // Retrieve the user ID from local storage
        const userId = localStorage.getItem('user_id');

        // Return the user ID
        return userId;
    } else {
        // If user ID does not exist in local storage, return null or handle it as needed
        return null;
    }
};


// Function to add a product to the cart
const addToCart = (productId) => {

    const customerId = getCustomerIdFromToken();
    console.log(customerId);
    console.log(productId);

    if (customerId) {
        // If customer ID is available, make the request to add the product to the cart
        fetch(`https://clothshopbackend-2.onrender.com/product/carts/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify({  
                "Customer": customerId, 
                "product": productId,
                "quantity": 1
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to add product to cart');
            }
        })
        .then(data => {
            console.log('Product added to cart successfully:', data);
            alert("Product added to cart successfully");
            
        })
        .catch(error => {
            console.error('Error adding product to cart:', error);
            
        });
    } else {
        
        console.error('Customer ID not available. User may not be authenticated.');
        
    }
};

const Purchase = (productId) => {
    const customerId = getCustomerIdFromToken();
    if (customerId){
        fetch(`https://clothshopbackend-2.onrender.com/purchase/buy/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'), 
            },
            body: JSON.stringify({
                "customer": customerId,
                "product": productId,
            })
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to purchase the product');
            }
            return res.json();
        })
        .then((data) => {
            console.log('Purchase successful:', data);
            // Show alert indicating successful purchase
            alert('Product purchased successfully!');
            // removeProductFromCart(productId);
            // Optionally, update UI or navigate to another page
            window.location.href = 'profile.html';
        })
        .catch((error) => {
            console.error('Purchase failed:', error.message);
            
        });
    }
    
    else {
        console.error('Customer ID not available');
        alert('You are not a logged in Customer. Please login or registr!')
    }
}


// const removeProductFromCart = (productId) => {
//     // Assuming cartItems is an array containing product IDs
//     const index = cartItems.indexOf(productId);
//     if (index !== -1) {
//         // Remove the product ID from the cartItems array
//         cartItems.splice(index, 1);
//     }
// }


const getAllpurchaseItem = () => {
    const customerId = localStorage.getItem('user_id');
    if (customerId){
        fetch(`https://clothshopbackend-2.onrender.com/purchase/buy/?user_id=${customerId}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch purchased products');
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            if (data && Array.isArray(data.results)) { // Check if 'results' property exists and is an array
                const purchaseItems = [];
                data.results.forEach(purItem => {
                    console.log(purItem.product);
                    fetch(`https://clothshopbackend-2.onrender.com/product/list/${purItem.product}`)
                    .then((res) => res.json())
                    .then((purdata) => {
                        console.log(purdata);
                        purchaseItems.push(purdata);
                        if(purchaseItems.length === data.results.length){
                            displayPurchaseItems(purchaseItems);
                        }
                    })
                    .catch(error => console.error("Error fetching product details:", error));
                });
            } else {
                throw new Error('Invalid data format for purchased products');
            }
        })
        .catch(error => console.error("Error fetching purchased products:", error.message));
    } else {
        console.log('Not a logged in user');
        alert('Please Login or Register!');
    } 
}


const displayPurchaseItems = (products) => {
    const parent = document.getElementById("purchased");
    if (!parent){
        console.error("Parent element not found");
        return;
    }
    parent.innerHTML ="";
    products.forEach((product) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
        <img class="card-img-top" src="${product.image}" alt="Card image cap">
        <div class="card-body">
          <h3>${product.product_name}</h3>
          <h6>ProductID - ${product.id}</h6>
          <span>
            <h6>${product.price}</h6>
            <h6>XL</h6>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. </p>
          </span>
          <div class="pur-options">
            <button>Return</button>
            <button><a href="review.html">Write Review</a></button>
          </div>
        </div>
        `;
        parent.appendChild(div); // Append the created div to the parent element
    });
} 

getAllpurchaseItem();


// for wishlist items
const getAllWishlistItem = () => {
    const customerId = localStorage.getItem('user_id');
    if (customerId){
        fetch(`https://clothshopbackend-2.onrender.com/purchase/wishlist/?user_id=${customerId}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch wishlisted products');
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
            if (data && Array.isArray(data.results)) { // Check if 'results' property exists and is an array
                const wishedItems = [];
                data.results.forEach(wishItem => {
                    console.log(wishItem.product);
                    fetch(`https://clothshopbackend-2.onrender.com/product/list/${wishItem.product}`)
                    .then((res) => res.json())
                    .then((wishdata) => {
                        console.log(wishdata);
                        wishedItems.push(wishdata);
                        if(wishedItems.length === data.results.length){
                            displayWislistItems(wishedItems);
                        }
                    })
                    .catch(error => console.error("Error fetching product details:", error));
                });
            } else {
                throw new Error('Invalid data format for Wished products');
            }
        })
        .catch(error => console.error("Error fetching wished products:", error.message));
    } else {
        console.log('Not a logged in user');
        alert('Please Login or Register!');
    } 
}


const displayWislistItems = (products) => {
    const parent = document.getElementById("wishedProducts");
    if (!parent){
        console.error("Parent element not found");
        return;
    }
    parent.innerHTML ="";
    products.forEach((product) => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `
        <img class="card-img-top" src="${product.image}" alt="Card image cap">
        <div class="card-body">
          <h3>${product.product_name}</h3>
          <span>
            <h6>${product.price}</h6>
            <h6>XL</h6>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. </p>
          </span>
          <div class="pur-options">
            <button><a href="#" onclick="removeFromWishlist(${product.id})">Remove from Wishlist</a></button>
          </div>
        </div>
        `;
        parent.appendChild(div); // Append the created div to the parent element
    });
} 

getAllWishlistItem();


// Removing from cart
const removeFromCart = (cartId) => {
    const customer = getCustomerIdFromToken()
    if (customer){
        fetch(`https://clothshopbackend-2.onrender.com/product/carts/${cartId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                
            },
            // Include any additional request body if needed
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }
            // Handle success response
            console.log('Item removed from cart successfully');
            alert('Item removed from cart successfully!')
            // Optionally, update the UI or perform any other action
        })
        .catch(error => {
            console.error('Error removing item from cart:', error.message);
            // Handle error
        });
    }
    else{
        console.log('Not a logged in user');
        alert('You are not a logged in User. Please login or Register');
    }
    // Send a DELETE request to the backend API endpoint
    
}
// Removing from wishlist
const removeFromWishlist = (wishId) => {
    const customer = getCustomerIdFromToken()
    if (customer){
        fetch(`https://clothshopbackend-2.onrender.com/purchase/wishlist/${wishId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                
            },
            // Include any additional request body if needed
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to remove item from Wishlist');
            }
            // Handle success response
            console.log('Item removed from Wishlist successfully');
            alert('Item removed from Wishlist successfully!')
            // Optionally, update the UI or perform any other action
        })
        .catch(error => {
            console.error('Error removing item from Wishlist:', error.message);
            // Handle error
        });
    }
    else{
        console.log('Not a logged in user');
        alert('You are not a logged in User. Please login or Register');
    }
    // Send a DELETE request to the backend API endpoint
    
}

// Function to load all carts from the backend
const loadAllCarts = () => {
    const customerId = localStorage.getItem('user_id');
    console.log(customerId);
    fetch(`https://clothshopbackend-2.onrender.com/product/carts/?user_id=${customerId}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const cartItems = []; // Create an array to store fetched product data
            data.forEach(cartItem => {
                console.log(cartItem.product);
                // Fetch product data for each cart item
                fetch(`https://clothshopbackend-2.onrender.com/product/list/${cartItem.product}`)
                    .then((res) => res.json())
                    .then((prodata) => {
                        console.log(prodata);
                        cartItems.push(prodata); // Add fetched product data to the array
                        // Check if all cart items have been processed
                        if (cartItems.length === data.length) {
                            // If all cart items have been fetched, call displayCartProduct
                            displayCartProduct(cartItems);
                        }
                    })
                    .catch(error => console.error("Error fetching product details:", error));
            });
        })
        .catch(error => console.error("Error fetching cart products:", error));  
}

const displayCartProduct = (carts) => {
    const parent = document.getElementById("cart-body");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    parent.innerHTML = "";
    carts.forEach((cart) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><a href="#" onclick="removeFromCart(${cart.id})" style="text-decoration: none;font-size: 30px;"><i class="ri-close-circle-line"></i></a></td>
            <td><a class="product-img" href="product-details.html?productId=${cart.id}"><img src="${cart.image ? cart.image : 'placeholder.jpg'}" alt="${cart.product_name}"></a></td>
            <td>${cart.product_name}</td>
            <td>$${cart.price}</td>
            <td><input type="number" value="1"></td>
            <td>$${cart.price}</td>
            
            <td>${cart.quantity > 0 ? `<a href="#" id="buyButton${cart.id}" onclick="Purchase(${cart.id})" class="btn btn-success">Buy</a>` : `<a href="#" class="btn btn-warning">StockOut!</a>`}</td>
        `;
        parent.appendChild(tr);
    });
};
// Call the function to load carts when the page loads
loadAllCarts();




// for getting wishlist
const addToWishlist = (productId) => {
   
    // Retrieve the customer ID from local storage
    const customerId = getCustomerIdFromToken();

    if (customerId) {
        // If customer ID is available, make the request to add the product to the cart
        fetch(`https://clothshopbackend-2.onrender.com/purchase/wishlist/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            },
            body: JSON.stringify( 
                {"customer": customerId, // Use the customerId retrieved from local storage
                "product": productId,}
                
            )
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to add product to wishlist');
            }
        })
        .then(data => {
            console.log('Product added to Wishlist successfully:', data);
            alert("Product added to Wishlist successfully");
        })
        .catch(error => {
            console.error('Error adding product to Wishlist:', error);
        });
    } else {
        // Handle case where customer ID is not available (e.g., user not authenticated)
        console.error('Customer ID not available. User may not be authenticated.');
        
    }
};


const displayProductDetails = (product) => {
    console.log(product);
    const parent = document.getElementById("product-details");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("details", "row", "p-5");
    div.innerHTML = `
        <div class="col-md-4 p-5">
            <img class="productImg" src="${product.image}" alt="">
        </div>
        <div class="col-md-1"></div>
        <div class="col-md-7">
            <div class="details-content">
                <span><h6>Home/Shop</h6></span>
                <span><h6>${product.brand}</h6></span>
                <h5 style="font-weight: bold;letter-spacing: 2px;">${product.product_name}</h5>
                <h2 style="font-weight: bold;">${product.price}$</h2>
                <h5>${product.rating}</h5>
                <select name="" id="">
                    <option value="">Available Sizes</option>
                    ${product.sizes?.map((item) => `<option value="">${item}</option>`).join("")}
                    </select>
                    ${product.category?.map((item) => `<button class="categorybutton">${item}</button>`).join(" ")}
                    
                    <h6 class="quantity">Quantity : ${product.quantity}</h6>
                <div class="d-flex pt-3 pb-3 gap-2">

                    ${product.quantity > 0 ? 
                        `<input type="number" value="1" style="width: 10%;"> 
                        <a onclick="addToCart(${product.id})" href="#" class="adding-cart btn text-white" style="background: teal;font-weight: bold;">Add To Cart</a>` 
                        :
                        `<a href="#" onclick="addToWishlist(${product.id})" class="adding-cart btn text-white" style="background: teal;font-weight: bold;">Add To wishlist</a>`
                    }
                </div>
                <span class="Pro-detail-text">
                    <h4 style="font-weight:bold ;color: black;">Product Details</h4>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore laboriosam quo unde ad animi. Ipsa earum quas, veniam accusantium delectus fuga impedit nulla libero asperiores. Perferendis facere debitis </p>
                </span>
            </div>
        </div>
    `;
    parent.appendChild(div);
       
};

// const displayProductDetailsAndReviews = (productId) => {
//     // Fetch product details
//     fetch(`http://127.0.0.1:8000/product/list/${productId}`)
//         .then(response => response.json())
//         .then(product => {
//             const parent = document.getElementById("product-details");
//             if (!parent) {
//                 console.error("Parent element not found");
//                 return;
//             }

//             // Create product details div
//             const productDiv = document.createElement("div");
//             productDiv.classList.add("details", "row", "p-5");
//             productDiv.innerHTML = `
//                 <div class="col-md-4 p-5">
//                     <img class="productImg" src="${product.image}" alt="">
//                 </div>
//                 <div class="col-md-1"></div>
//                 <div class="col-md-7">
//                     <div class="details-content">
//                         <span><h6>Home/Shop</h6></span>
//                         <span><h6>${product.brand}</h6></span>
//                         <h5 style="font-weight: bold;letter-spacing: 2px;">${product.product_name}</h5>
//                         <h2 style="font-weight: bold;">${product.price}$</h2>
//                         <h5>${product.rating}</h5>
//                         <select name="" id="">
//                             <option value="">Available Sizes</option>
//                             ${product.sizes?.map((item) => `<option value="">${item}</option>`).join("")}
//                         </select>
//                         ${product.category?.map((item) => `<button class="categorybutton">${item}</button>`).join(" ")}
//                         <h6 class="quantity">Quantity : ${product.quantity}</h6>
//                         <div class="d-flex pt-3 pb-3 gap-2">
//                             ${product.quantity > 0 ? 
//                                 `<input type="number" value="1" style="width: 10%;"> 
//                                 <a onclick="addToCart(${product.id})" href="#" class="adding-cart btn text-white" style="background: teal;font-weight: bold;">Add To Cart</a>` 
//                                 :
//                                 `<a href="#" onclick="addToWishlist(${product.id})" class="adding-cart btn text-white" style="background: teal;font-weight: bold;">Add To wishlist</a>`
//                             }
//                         </div>
//                         <span class="Pro-detail-text">
//                             <h4 style="font-weight:bold ;color: black;">Product Details</h4>
//                             <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore laboriosam quo unde ad animi. Ipsa earum quas, veniam accusantium delectus fuga impedit nulla libero asperiores. Perferendis facere debitis </p>
//                         </span>
//                     </div>
//                 </div>
//             `;
//             parent.appendChild(productDiv);

//             // Fetch and display all reviews for the product
//             fetch(`http://127.0.0.1:8000/product/reviews/?product=${productId}`)
//                 .then((res) => res.json())
//                 .then((data) => displayAllReviewsForAProduct(data))
//                 .catch(error => console.error("Error fetching product reviews:", error));
//         })
//         .catch(error => console.error("Error fetching product details:", error));
// };


const displayAllReviewsForAProduct = (reviews) => {
    const parent = document.getElementById("review-area-det");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    parent.innerHTML = ""; // Clear previous content before adding new reviews

    reviews.forEach((review) => {
        const div = document.createElement("div");
        div.classList.add("review");
        div.innerHTML = `
            <div class="review-text">
    
                <h6>Reviewer's Id - ${review.reviewer}</h6> 
                <h5>Product Id - ${review.product}</h5> 
                <div class="rating d-flex">
                    ${review.rating}
                </div>
                <span><p>${review.review}</p></span>
            </div>
        `;
        parent.appendChild(div);
    });
};


// Call the function with the product ID when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const productId = urlParams.get('product_id');
//     if (productId) {
//         displayProductDetailsAndReviews(productId);
//     }
// });


getparams();

// Load sizes and display



const loadSizes = () => {
    fetch(`https://clothshopbackend-2.onrender.com/product/sizes/`)
    .then(res => res.json())
    .then(data => displaySizes(data));
};

const displaySizes = (sizes) => {
    const parent = document.getElementById("size-container");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    sizes.forEach((size) => {
        const div = document.createElement("div");
        div.classList.add("all-size");
        div.innerHTML = `
            <button onclick="loadAllProducts('${size.name}')" class="categorybutton" data-size=${size.name} >${size.name}</button>
        `;
        parent.appendChild(div);
    });

    // Add event listeners to size buttons
    const sizeButtons = document.querySelectorAll(".categorybutton");
    sizeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedSize = button.dataset.size.name;
            filterProductsBySize(selectedSize);
        });
    });
};

loadSizes();




// searching products
const handleSearch = () => {
    const value = document.getElementById("search").value;
    console.log(value);
    loadAllProducts(value)
}
handleSearch();

// sorting by product rice

const SortPricelowTohigh = () => {
    // Fetch data from your API
    fetch(`https://clothshopbackend-2.onrender.com/product/list/`)
    .then((res) => res.json())
    .then((data) => {
        // Check if data is an array
        if (Array.isArray(data)) {
            // Sort the data based on price in ascending order
            data.sort(function(a, b) {
                return a.price - b.price;
            });

            // Display the sorted data
            displayProducts(data);
        } else {
            console.error("Received data is not an array.");
        }
    })
    .catch(error => {
        console.error("Error fetching or parsing data:", error);
    });
};


const SortPriceHighToLow = () => {
    // Fetch data from your API
    fetch(`https://clothshopbackend-2.onrender.com/product/list/`)
    .then((res) => res.json())
    .then((data) => {
        // Check if data is an array
        if (Array.isArray(data)) {
            // Sort the data based on price in descending order
            data.sort(function(a, b) {
                return b.price - a.price; // Reversed order
            });

            // Display the sorted data
            displayProducts(data);
        } else {
            console.error("Received data is not an array.");
        }
    })
    .catch(error => {
        console.error("Error fetching or parsing data:", error);
    });
};








