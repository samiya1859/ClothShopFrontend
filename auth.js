const handleRegistration = (event) => {
   event.preventDefault();

   const username = getValue("username");
   const first_name = getValue("first_name");
   const last_name = getValue("last_name");
   const email = getValue("email");
   const mobile_no = getValue("number");
   const address = getValue("address");
   const password = getValue("password");
   const confirm_password = getValue("confirm_password");

   const registrationInfo = {
       username,
       first_name,
       last_name,
       email,
       mobile_no,
       address,
       password,
       confirm_password,
   };

   // Check if passwords match
   if (password !== confirm_password) {
       document.getElementById("error").innerText = "Passwords didn't match";
       alert("Passwords didn't match");
       return;
   }

   // Send POST request to backend
   fetch(`https://clothshopbackend-2.onrender.com/customer/register/`, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(registrationInfo),
   })
   .then((res) => {
       if (!res.ok) {
           throw new Error("Network response was not ok");
       }
       return res.json();
   })
   .then((data) => {
       console.log(data); // Log response data
       document.getElementById("error").innerText = "Check Email for confirmation!";
   })
   .catch((error) => {
       console.error("Error:", error.message);
       document.getElementById("error").innerText = "Registration failed";
   });
};

 
 

const getValue = (id) => {
    const value = document.getElementById(id).value;
    return value;
}


const handleLogin = (event) => {
   event.preventDefault();
   const username = getValue("login-username")
   const password = getValue("login-password")

   if(username ,password){
      fetch(`https://clothshopbackend-2.onrender.com/customer/login/`,{
         method:"POST",
         headers:{"content-type":"application/json"},
         body:JSON.stringify({username,password}),
      
      })
      .then((res) => res.json())
      .then((data) =>{
         console.log(data);
         
        if(data.token && data.user_id){
            localStorage.setItem("token",data.token);
            localStorage.setItem("user_id",data.user_id);
            handleNavbar(true);
            window.location.href="index.html"  
            alert("Logged in successfully");     
        }
      });

   }else{
      alert("Username or Password incorrect")
   }
}

const handleNavbar = (isLogged) => {
    const user = document.getElementById("user");
    const cart = document.getElementById("cart");
    const logout = document.getElementById("logout");
    const register = document.getElementById("register");
    const login = document.getElementById("login");
    const shop = document.getElementById("shop");
    

    if (isLogged) {
        user.style.display = "inline-block";
        cart.style.display = "inline-block";
        logout.style.display = "inline-block";
        shop.style.display = "inline-block";
        register.style.display = "none";
        login.style.display = "none";
    } else {
        user.style.display = "none";
        cart.style.display = "none";
        logout.style.display = "none";
        shop.style.display="none";
        register.style.display = "inline-block";
        login.style.display = "inline-block";
    }
};

document.addEventListener("DOMContentLoaded", function() {
    // Example: Check if user is logged in by retrieving authentication state from local storage
    const isLogged = localStorage.getItem("token") !== null;
    handleNavbar(isLogged);
});


document.addEventListener("DOMContentLoaded", function() {
    // Check if user is logged in by retrieving authentication state from local storage
    const isLogged = localStorage.getItem("token") !== null;

    // Get the <span> element containing the register button
    const registerButton = document.getElementById("registerButton");
    const discoverButton = document.getElementById("discoverButton");


    if (isLogged) {
        // If user is logged in, display a welcome message
        const userId = localStorage.getItem("user_id"); // Assuming you store the username in local storage
        getUsername(userId)
        registerButton.innerHTML = `<p class="btn btn-info">Welcome To our Shop</p>`;
        discoverButton.innerHTML = `<a href="shop.html">Discover More</a>`
    } else {
        // If user is not logged in, display the register button
        registerButton.innerHTML = `<a href="register.html" class="button">Register Now</a>`;
        discoverButton.innerHTML = `<a href="register.html" class="button">Register/Login to learn more</a>`;
    }
});


// for logout
const handlelogOut = () => {
    const token = localStorage.getItem("token");
  
    fetch("https://clothshopbackend-2.onrender.com/customer/logout/", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        alert("Logged out Successfully!");
      });
  };