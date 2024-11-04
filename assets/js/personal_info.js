console.log(getData());

const fullName = document.getElementById('fullName');
const email = document.getElementById('email');
const phoneNumber = document.getElementById('phoneNumber');
const address = document.getElementById('address');

if (getData()){
    fullName.value = getData().fullName;
    email.value = getData().email;
    phoneNumber.value = getData().phoneNumber;
    address.value = getData().address;
}