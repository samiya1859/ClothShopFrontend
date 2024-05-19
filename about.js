// All reviews 
const loadAllReviews = () => {
    fetch(`https://clothshopbackend-2.onrender.com/product/reviews/`)
    .then((res)=>res.json())
    .then((data)=>displayAllReviews(data))
};
const displayAllReviews = (reviews) => {
    const parent = document.getElementById("review-area");
    if (!parent) {
        console.error("Parent element not found");
        return;
    }

    parent.innerHTML = ""; // Clear previous content before adding new reviews

    reviews.forEach((review) => {
        const div = document.createElement("div");
        div.classList.add("review");
        div.innerHTML = `
            <div class="reviewer-img"><img src="images/p3.jpg" alt=""></div>
            <div class="review-text">
                
                <h6>User ID -${review.reviewer}</h6> <!-- Display reviewer's username -->
                <h5>Product ID -${review.product}</h5> <!-- Display product name -->
                <div class="rating d-flex">
                    ${review.rating}
                </div>
                <span><p>${review.review}</p></span>
            </div>
        `;
        parent.appendChild(div);
    });
};



loadAllReviews();








