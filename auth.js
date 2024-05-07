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
   fetch(`http://127.0.0.1:8000/customer/register/`, {
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
      fetch(`http://127.0.0.1:8000/customer/login/`,{
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
        }
      });

   }else{
      alert("Username or Password incorrect")
   }
}

const handleNavbar = (isLogged) => {
    const user = document.getElementById("user");
    const cart = document.getElementById("cart")
    const logout = document.getElementById("logout")
    const register = document.getElementById("register")
    const login = document.getElementById("login")

    if(isLogged){
        user.style.display = "inline-block";
        cart.style.display = "inline-block";
        logout.style.display = "inline-block";
        register.style.display = "none";
        login.style.display = "none";
    }else{
        user.style.display = "none";
        cart.style.display = "none";
        logout.style.display = "none";
        register.style.display = "inline-block";
        login.style.display = "inline-block";
    }
};
document.addEventListener("DOMContentLoaded", function() {
    const isLogged = true; // Example: Set to true if user is logged in, false otherwise
    handleNavbar(isLogged);
});