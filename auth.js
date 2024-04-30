const handleRegistration = (event) => {
    event.preventDefault();
    console.log("yeee");
    const username = getValue("username")
    const first_name = getValue("first_name")
    const last_name = getValue("last_name")
    const email = getValue("email")
    const mobile_no = getValue("number")
    const address = getValue("address")
    const password = getValue("password")
    const password2 = getValue("password2")
    const registrationInfo = {
        username,
        first_name,
        last_name,
        email,
        mobile_no,
        address,
        password,
        password2,
     };
    console.log({username,first_name,last_name,email,mobile_no,address,password,password2});
    if (password == password2) {
       document.getElementById("error").innerText = "passwords matched";
 
      
 
       fetch(`http://127.0.0.1:8000/customer/register/`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(registrationInfo),
       })
       .then((res) => res.json())
       .then((data) => console.log(data))
    } else {
       document.getElementById("error").innerText = "Passwords didn't matched";
       alert("Passwords didn't matched");
    }
 };
 
 
 

const getValue = (id) => {
    const value = document.getElementById(id).value;
    return value;
}