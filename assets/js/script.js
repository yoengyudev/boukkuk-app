let g9_host = "https://mps10.chandalen.dev/";



// login


let login = document.getElementById("login");



login.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Hello");
    
    e.defaultPrevented();
    fetch(`${g9_host}/api/login`,{
        method:"POST",
        body:JSON.stringify(
            {
                title: 'test product',
                price: 13.5,
                description: 'lorem ipsum set',
                image: 'https://i.pravatar.cc',
                category: 'electronic'
            }
        )
    })
        .then(res=>res.json())
        .then(json=>console.log(json))
});

// end of login