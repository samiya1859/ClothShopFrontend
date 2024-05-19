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

const getUserId = () => {
    const isLoggedin = localStorage.getItem("user_id");
    if(isLoggedin){
        return isLoggedin;
    }
    else{
        return "Not a logged in  user";
    }
}

// const getValue = (id) => {
//     const value = document.getElementById(id).value;
//     return value;
// }

const PostReview = async (event) => {
    event.preventDefault();

    const reviewer = getUserId();
    const product = getValue("product");
    const review = getValue("review");
    const rating = getValue("rating");
    
    // Check if the user has already reviewed the product
    const alreadyReviewed = await isReviewed(product, reviewer);
    if (alreadyReviewed) {
        alert("You have already reviewed this product.Now you can edit or delete it.");
        return;
    }

    const reviewInfo = {
        reviewer,
        product,
        review,
        rating,
    };

    fetch(`https://clothshopbackend-2.onrender.com/product/reviews/`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(reviewInfo),
    }) 
    .then((res) => {
        if (!res.ok) {
            throw new Error("Network response was not ok");
        }
        return res.json();
    })
    .then((data) => {
        console.log(data); // Log response data
        alert("Product reviewed Successfully");
    })
    .catch((error) => {
        console.error("Error:", error.message);
        alert("Review failed!");
    });
};

document.getElementById('reviewForm').addEventListener('submit', PostReview);

const isReviewed = async (productId, userId) => {
    try {
        const response = await fetch(`https://clothshopbackend-2.onrender.com/product/reviews/?product=${productId}&user=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken'),
            }
        });
        const data = await response.json();
        return data.length > 0; // Returns true if user has already reviewed the product
    } catch (error) {
        console.error("Error:", error.message);
        return false;
    }
};



const loadAllofyourReviews = () => {
    const userId = getUserId();
    fetch(`https://clothshopbackend-2.onrender.com/product/reviews/?reviewer=${userId}`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data),
        displayAllOfYourReviews(data)
    })
}
const displayAllOfYourReviews = (reviews) => {
    const parent = document.getElementById("your_reviews");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    parent.innerHTML = ""; 

    reviews.forEach((review) => {
        const div = document.createElement("div");
        div.classList.add("review");
        div.innerHTML = `
            <div class="review-text">
                <h5>Product Id - ${review.product}</h5> 
                <div class="rating d-flex">
                    ${review.rating}
                </div>
                <span><p>${review.review}</p></span>
                <div>
                <a href="#" class="btn btn-warning">Update</a>
                <a href="#" onclick="deleteReview(${review.id})" class="btn btn-danger">Delete</a>
                </div>
            </div>
        `;
        parent.appendChild(div);
    });
};
loadAllofyourReviews();


function deleteReview(reviewId) {
    // Confirm with the user before proceeding with deletion
    const confirmation = confirm("Are you sure you want to delete this review?");
    
    // If the user confirms deletion, send a DELETE request to the server
    if (confirmation) {
        fetch(`https://clothshopbackend-2.onrender.com/product/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers if required
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete review');
            }
            // Optionally, you can handle success cases here
            console.log('Review deleted successfully');
            alert("Review deleted successfully")
            // Reload the page or update the UI as needed
        })
        .catch(error => {
            console.error('Error deleting review:', error);
            // Handle error cases, such as displaying an error message to the user
        });
    }
}

