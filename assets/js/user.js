// =======================>> Get all user <<========================
let getToken = localStorage.getItem('token');
console.log(getToken);

fetch('https://mps10.chandalen.dev/api/users', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken}`
    },
})
    .then(res => res.json())
    .then(json => {
        let tr = '';
        const users = json.data;
        users.forEach(e => {
            tr += `<tr>
                <td class='text-start'>${e.id}</td>
                <td>${e.name}</td>
                <td>${e.email}</td>
               <td>
                    <div class="btn-group dropstart p-0">
                        <button type="button" class="btn p-0 border-0" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-fill"></i>
                            <i class="bi bi-arrow-up-short"></i>
                        </button>
                        <ul class="dropdown-menu" style="width:200px">
                            <li>
                                <button type="button" class="btn" onclick="promoteUser(1, ${e.id})">
                                    <i class="bi bi-person-fill text-success"></i> User
                                </button>
                            </li>
                            <li>
                                <button type="button" class="btn" onclick="promoteUser(3, ${e.id})">
                                    <i class="bi bi-briefcase-fill text-info"></i> Provider
                                </button>
                            </li>
                            <li>
                                <button type="button" class="btn" onclick="promoteUser(2, ${e.id})">
                                    <i class="bi bi-shield-lock-fill text-primary"></i> Admin
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>


                <td>
                    <a href="javascript:void(0)" onclick="toggleUserStatus(this, ${e.id})" class="btn_status p-0 text-decoration-none">
                        <i class="bi bi-toggle-on text-primary btn_status_icon fs-4"></i>
                    </a>
                </td>
                <td>
                    <div class="btn-group dropstart">
                        <button type="button" class="btn border-0 p-0" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                             <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#updateUser" onclick="getUserForUpdate(${e.id})">
                                <i class="bi bi-pencil-square text-warning"></i> Edit
                            </button>
                            </li>
                            <li>
                                <button type="button" onclick="deleteUser(${e.id})" class="btn">
                                    <i class="bi bi-trash text-danger"></i> Delete
                                </button>
                            </li>
                            <li>
                                <button type="button" onclick="viewDetails(${e.id})" class="btn" data-bs-toggle="modal" data-bs-target="#getDetail">
                                    <i class="bi bi-eye text-primary"></i> View Details
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>`;
        });
        document.getElementById('table_body').innerHTML = tr;

        $('#userTabel').DataTable({
            responsive: true
        });
    })
    .catch(error => console.error('Error fetching data:', error));


// ======================  add new users ======================================

document.getElementById('addUserForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let registerButton = document.getElementById('registerButton');
    let spinner = document.getElementById('spinner');
    let buttonText = document.getElementById('buttonText');
    let user_name = document.getElementById('userName').value;
    let user_email = document.getElementById('userEmail').value.trim();
    let user_phone = document.getElementById('userPhone').value.trim();
    let user_location = document.getElementById('userLocation').value;
    let user_pass = document.getElementById('userPass').value.trim();
    let user_confirm_pass = document.getElementById('userConfirmPass').value.trim();
    let user_image = document.getElementById('userImage').files[0];
    let user_role = document.querySelector('input[name="userRole"]:checked').value;

    registerButton.disabled = true;
    spinner.style.display = 'inline-block';
    buttonText.textContent = 'Creating...';

    if (!getToken) {
        alert('No authentication token found. Please log in.');
        return;
    }

    let formData = new FormData();
    formData.append('name', user_name);
    formData.append('email', user_email);
    formData.append('phone', user_phone);
    formData.append('google_map_url', user_location);
    formData.append('password', user_pass);
    formData.append('password_confirmation', user_confirm_pass);
    formData.append('role_id', user_role); // Append role as a numeric value
    if (user_image) {
        formData.append('avatar', user_image);
    }

    fetch('https://mps10.chandalen.dev/api/users', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getToken}`
        },
        body: formData,
    })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            let addUserModal = bootstrap.Modal.getInstance(document.getElementById("addUserModal"));
            addUserModal.hide();
            document.getElementById('addUserForm').reset();
        })
        .finally(() => {
            registerButton.disabled = false;
            spinner.style.display = 'none';
            buttonText.textContent = 'Create User';
        })
        .catch(error => console.error('Error adding user:', error));
});


// ========================= view Details User =======================

function viewDetails(userId) {
    fetch(`https://mps10.chandalen.dev/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getToken}`
        }
    })
        .then(response => response.json())
        .then(userData => {
            console.log("User Details:", userData);
            document.getElementById('de_image').src = userData.data.avatar;
            document.getElementById('de_id').textContent = userData.data.id;
            document.getElementById('de_name').textContent = userData.data.name;
            document.getElementById('de_email').textContent = userData.data.email;
            document.getElementById('de_phone').textContent = userData.data.phone;
            document.getElementById('de_role').textContent = userData.data.role;
            document.getElementById('de_location').textContent = userData.data.google_map_url;
            const roleName = userData.data.roles[0] ? userData.data.roles[0].name : 'Unknown Role';
            document.getElementById('de_role').innerHTML = roleName;

        })
        .catch(error => {
            console.error('Error fetching user details:', error);
        });
}

// delete user ============================

function deleteUser(userId) {
    if (!confirm("Are you sure?")) {
        return;
    }

    fetch(`https://mps10.chandalen.dev/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getToken}`
        }
    })
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log("User deleted:", data);
            document.getElementById(`user-row-${userId}`).remove();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
        });
}


// update usre 


// ========================= Get User Details for Update ========================
function getUserForUpdate(userId) {
    const getToken = localStorage.getItem('token');
    fetch(`https://mps10.chandalen.dev/api/users/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${getToken}`
        }
    })
        .then(response => response.json())
        .then(userData => {

            document.getElementById('editUserId').value = userData.data.id;
            document.getElementById('editUserName').value = userData.data.name;
            document.getElementById('editUserEmail').value = userData.data.email;
            document.getElementById('editUserPhone').value = userData.data.phone;
            document.getElementById('editUserLocation').value = userData.data.google_map_url;
            document.getElementById('editUserPass').value = userData.data.pass;
            document.getElementById('editUserConfirmPass').value = userData.data.confirm_pass; // Leave confirm password empty
            console.log(userData.data.roles);
            const roleId = userData.data.roles[0] ? userData.data.roles[0].id : 'Unknown Role';
            console.log(roleId);

            if (roleId == 1) {
                document.getElementById('editNormalUser').checked = true;
            } else if (roleId == 2) {
                document.getElementById('editAdminUser').checked = true;
            } else if (roleId == 3) {
                document.getElementById('editServiceProviderUser').checked = true;
            }
            document.getElementById('edit_profile').src = userData.data.avatar || 'default_avatar.jpg';
        })
        .catch(error => console.error('Error fetching user data for update:', error));
}

// ========================Update code ========================

document.getElementById('updateForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let userId = document.getElementById('editUserId').value;

    let editName = document.getElementById('editUserName').value;
    let editEmail = document.getElementById('editUserEmail').value.trim();;
    let editPhone = document.getElementById('editUserPhone').value.trim();
    let editLocation = document.getElementById('editUserLocation').value;
    let editPass = document.getElementById('editUserPass').value.trim();
    let editConfirm_pass = document.getElementById('editUserConfirmPass').value.trim();
    let editImage = document.getElementById('editUserImage').files[0];
    let editRole = document.querySelector('input[name="editUserRole"]:checked').value;

    console.log(editConfirm_pass);
    console.log(editPass);





    let formData = new FormData();
    if (editName) formData.append('name', editName);
    if (editEmail) formData.append('email', editEmail);
    if (editPhone) formData.append('phone', editPhone);
    if (editLocation) formData.append('google_map_url', editLocation);
    if (editPass && editConfirm_pass) {
        if (editPass === editConfirm_pass) {
            formData.append('password', editPass);
            formData.append('password_confirmation', editConfirm_pass);
        } else {
            document.getElementById('err_pass').innerHTML = `<i class="bi bi-info-circle"></i> Passwords do not match!`;
            isValid = false;
        }
    }



    formData.append('role_id', editRole);
    if (editImage) {
        formData.append('avatar', editImage);
    }

    let isValid = true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{9,10}$/;

    if (!editName) {
        document.getElementById('err_name').innerHTML = `<i class="bi bi-info-circle"></i> Phone number is required!`;
        isValid = false;
    } else {
        document.getElementById('err_name').style.display = 'none';
    }
    if (!editPhone) {
        document.getElementById('err_phone').innerHTML = `<i class="bi bi-info-circle"></i> Full name is required!`;
        isValid = false;
    } else {
        document.getElementById('err_phone').style.display = 'none';
    }



    if (isValid) {
        let updateUserButton = document.getElementById('updateButton');
        let spinner = document.getElementById('spinner_Update');
        let buttonText = document.getElementById('buttonTex_update');
        updateUserButton.disabled = true;
        spinner.style.display = 'inline-block';
        buttonText.textContent = 'Updating...';

        fetch(`https://mps10.chandalen.dev/api/users/${userId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getToken}`
            },
            body: formData,
        })
            .then(res => res.json())
            .then(json => {
                console.log(json.data);
                let updateUserModal = bootstrap.Modal.getInstance(document.getElementById("updateUser"));
                updateUserModal.hide();
                document.getElementById('updateForm').reset();
            })
            .finally(() => {
                updateUserButton.disabled = false;
                spinner.style.display = 'none';
                buttonText.textContent = 'Update';
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    }
});


// ====================== User status ========================

function toggleUserStatus(element, userId) {
    const btn_status_icon = element.querySelector('.btn_status_icon');
    const currentStatus = btn_status_icon.classList.contains("bi-toggle-on") ? "enabled" : "disabled";

    const apiUrl = currentStatus === "enabled"
        ? `https://mps10.chandalen.dev/api/users/disable/${userId}`
        : `https://mps10.chandalen.dev/api/users/enable/${userId}`;

    console.log(getToken);

    fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
            "Authorization": `Bearer ${getToken}`,
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            if (data.result && data.code === 1) {
                btn_status_icon.classList.toggle("bi-toggle-on");
                btn_status_icon.classList.toggle("bi-toggle-off");
                // Update the `data-status` attribute
                const newStatus = currentStatus === "enabled" ? "disabled" : "enabled";
                element.setAttribute("data-status", newStatus);
            } else {
                alert("Failed to update user status. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
}


// ==============================promote user ==========================

function promoteUser(roleId, userId) {
    fetch(`https://mps10.chandalen.dev/api/users/set-role/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json',
            "Authorization": `Bearer ${getToken}`,
        },
        body: JSON.stringify({ role_id: roleId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.result && data.code === 1) {
                alert("User role updated successfully!");
            } else {
                alert("Failed to update role. Please try again.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
}
