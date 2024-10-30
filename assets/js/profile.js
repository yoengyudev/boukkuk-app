//=============================>> Get User Information Functions <<===============================//

let g9_host = "https://mps10.chandalen.dev";

function getData() {
    let token = localStorage.getItem("token");

    fetch(`${g9_host}/api/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
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


//===============================>> Update User Information Function <<================================//

document.getElementById("updateForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let updateName = document.getElementById('fullname').value;
    let updateEmail = document.getElementById('email').value;
    let updatePhone = document.getElementById('phone').value;
    let updateAddress = document.getElementById('address').value;
    let updateButton = document.getElementById('updateButton');
    let spinner = document.getElementById('spinner');
    let buttonText = document.getElementById('buttonText');

    updateButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'កំពុងរក្សាទុក...';

    let token = localStorage.getItem("token");

    if (!token) {
        updateButton.disabled = false;
        spinner.style.display = 'none';
        buttonText.textContent = 'រក្សាទុកការផ្លាស់ប្តូរ';
        return;
    }

    let updatedData = {
        name: updateName,
        email: updateEmail,
        phone: updatePhone,
        address: updateAddress,
    };
    console.log(updatedData.address);
    fetch(`${g9_host}/api/profile/info`, {    
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(updatedData)
    })
        .then(res => res.json())
        .then(response => {
            console.log(response.data);
            console.log(response.data.name);
            console.log(response.data.email);
            console.log(response.data.phone);
            console.log(response.data.address);
        })
        .finally(() => {
            updateButton.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = 'រក្សាទុកការផ្លាស់ប្តូរ';
        });
});