let g9_host = "https://mps10.chandalen.dev";

function getData() {
    let token = localStorage.getItem("token");
    fetch(`${g9_host}/api/me`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(json => {
        console.log(json.data);
        document.getElementById("fullname").value = json.data.name;
        document.getElementById("email").value = json.data.email;
        document.getElementById("phone").value = json.data.phone;
        document.getElementById("userAvatar").src = json.data.avatar;
    })
}

getData();