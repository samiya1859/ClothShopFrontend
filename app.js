// for getting CSRFToken
function getCSRFToken() {
    const csrfCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfCookie) {
        return csrfCookie.split('=')[1];
    }
    return null;
}




  

// for loading all products through API
const loadAllProducts = (search) => {
    console.log(search);
    fetch(`http://127.0.0.1:8000/product/list/?search=${search?search:""}`)
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
    fetch(`http://127.0.0.1:8000/product/list/${params}`)
    .then(res => res.json())
    .then((data) => displayProductDetails(data));
};


// Adding to cart
const AddtoCart = (productId) => {
    console.log(productId);
    fetch(`http://127.0.0.1:8000/product/carts/`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRFToken': getCSRFToken(),
        },
        body: {
            "Customer": 3,
            "product": 4,
            "quantity": 1
        } // Corrected key name to match backend
    })
    .then(response => {
        console.log(response);
        if (response.ok) {
            // Parse the response body as JSON
            return response.json();
        } else {
            console.error('Failed to add product to cart');
            throw new Error('Failed to add product to cart');
        }
    })
    .then(data => {
        // Handle the response data
        console.log('Product added to cart successfully:', data);
        
    })
    .catch(error => {
        console.error('Error adding product to cart:', error);
    });

};

// for getting wishlist
const addToWishlist = (productId) => {
   
    const data = {
        
        product: productId
    };

    fetch(`http://127.0.0.1:8000/purchase/wishlist/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
            'X-CSRFToken': getCSRFToken(), // Include CSRF token for CSRF protection
        },
        body: JSON.stringify(data) // Convert the data object to a JSON string
    })
    .then(response => {
        if (response.ok) {
            // If the response status is within the success range (200-299)
            console.log('Product added to wishlist successfully');
            
        } else {
            // If the response status is not within the success range
            console.error('Failed to add product to wishlist');
            
        }
    })
    .catch(error => {
        
        console.error('Error adding product to wishlist:', error);
    });
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
                        <a onclick="AddtoCart(${product.id})" href="#" class="adding-cart btn text-white" style="background: teal;font-weight: bold;">Add To Cart</a>` 
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


getparams();

// Load sizes and display



const loadSizes = () => {
    fetch(`http://127.0.0.1:8000/product/sizes/`)
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
    fetch(`http://127.0.0.1:8000/product/list/`)
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
    fetch(`http://127.0.0.1:8000/product/list/`)
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





// Add to wishlist
