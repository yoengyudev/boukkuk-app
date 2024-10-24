let g9_host = "https://mps10.chandalen.dev";



// login


let login = document.getElementById("login");



login.addEventListener("submit", (even) => {
    even.preventDefault();
    let formdata = new FormData();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    formdata.append('email_or_phone', email);
    formdata.append('password', password);
    
    fetch(`${g9_host}/api/login`,{
        method: "POST",
        body: formdata,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(res=>res.json())
        .then(json=>{
            let token = json.data.token;
            localStorage.setItem('token', token);
            if(token) {
                location.href = '../../../index.html';
            }
        });
});

// end of login