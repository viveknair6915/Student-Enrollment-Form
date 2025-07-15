// ====== JsonPowerDB Configuration ======
// Replace these with your JPDB credentials
const JPDB_API_BASE = "https://api.login2explore.com:5577";
const JPDB_TOKEN = "90934988|-31949251224252504|90959176"; // <-- Replace with your JPDB token
const DB_NAME = "SCHOOL-DB";
const RELATION_NAME = "STUDENT-TABLE";

// ====== DOM Elements ======
const rollNo = document.getElementById('rollNo');
const fullName = document.getElementById('fullName');
const classField = document.getElementById('class');
const birthDate = document.getElementById('birthDate');
const address = document.getElementById('address');
const enrollDate = document.getElementById('enrollDate');
const saveBtn = document.getElementById('saveBtn');
const updateBtn = document.getElementById('updateBtn');
const resetBtn = document.getElementById('resetBtn');
const message = document.getElementById('message');
const form = document.getElementById('studentForm');

// ====== Utility Functions ======
function setFormState(state) {
    // state: 'empty', 'new', 'existing'
    if (state === 'empty') {
        rollNo.disabled = false;
        fullName.disabled = true;
        classField.disabled = true;
        birthDate.disabled = true;
        address.disabled = true;
        enrollDate.disabled = true;
        saveBtn.disabled = true;
        updateBtn.disabled = true;
        resetBtn.disabled = true;
        form.reset();
        message.textContent = '';
        rollNo.focus();
    } else if (state === 'new') {
        rollNo.disabled = false;
        fullName.disabled = false;
        classField.disabled = false;
        birthDate.disabled = false;
        address.disabled = false;
        enrollDate.disabled = false;
        saveBtn.disabled = false;
        updateBtn.disabled = true;
        resetBtn.disabled = false;
        fullName.focus();
    } else if (state === 'existing') {
        rollNo.disabled = true;
        fullName.disabled = false;
        classField.disabled = false;
        birthDate.disabled = false;
        address.disabled = false;
        enrollDate.disabled = false;
        saveBtn.disabled = true;
        updateBtn.disabled = false;
        resetBtn.disabled = false;
        fullName.focus();
    }
}

function getFormData() {
    return {
        rollNo: rollNo.value.trim(),
        fullName: fullName.value.trim(),
        class: classField.value.trim(),
        birthDate: birthDate.value,
        address: address.value.trim(),
        enrollDate: enrollDate.value
    };
}

function validateForm(data, skipRollNo = false) {
    if (!skipRollNo && !data.rollNo) return false;
    return data.fullName && data.class && data.birthDate && data.address && data.enrollDate;
}

function showMessage(msg, isError = false) {
    message.textContent = msg;
    message.style.color = isError ? '#d32f2f' : '#388e3c';
}

// ====== JPDB API Functions ======
async function jpdbRequest(endpoint, body) {
    const res = await fetch(JPDB_API_BASE + endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'JPDB-Token': JPDB_TOKEN
        },
        body: JSON.stringify(body)
    });
    return res.json();
}

async function getStudentByRollNo(rollNoVal) {
    const body = {
        token: JPDB_TOKEN,
        dbName: DB_NAME,
        rel: RELATION_NAME,
        cmd: 'GET_BY_KEY',
        key: rollNoVal
    };
    const res = await jpdbRequest('/api/irl', body);
    if (res.status === 400) return null; // Not found
    if (res.status === 200) return res.data;
    throw new Error(res.message || 'Error fetching data');
}

async function saveStudent(data) {
    const body = {
        token: JPDB_TOKEN,
        dbName: DB_NAME,
        rel: RELATION_NAME,
        cmd: 'PUT',
        record: data
    };
    const res = await jpdbRequest('/api/iml', body);
    if (res.status === 200) return true;
    throw new Error(res.message || 'Error saving data');
}

async function updateStudent(data) {
    const body = {
        token: JPDB_TOKEN,
        dbName: DB_NAME,
        rel: RELATION_NAME,
        cmd: 'UPDATE',
        record: data,
        key: data.rollNo
    };
    const res = await jpdbRequest('/api/iml', body);
    if (res.status === 200) return true;
    throw new Error(res.message || 'Error updating data');
}

// ====== Event Handlers ======
rollNo.addEventListener('blur', async () => {
    const rollNoVal = rollNo.value.trim();
    if (!rollNoVal) {
        setFormState('empty');
        return;
    }
    showMessage('Checking Roll No...');
    try {
        const student = await getStudentByRollNo(rollNoVal);
        if (student) {
            // Existing record
            fullName.value = student.fullName;
            classField.value = student.class;
            birthDate.value = student.birthDate;
            address.value = student.address;
            enrollDate.value = student.enrollDate;
            setFormState('existing');
            showMessage('Record found. You can update or reset.');
        } else {
            // New record
            setFormState('new');
            showMessage('No record found. Enter details and save.');
        }
    } catch (err) {
        setFormState('empty');
        showMessage('Error: ' + err.message, true);
    }
});

saveBtn.addEventListener('click', async () => {
    const data = getFormData();
    if (!validateForm(data)) {
        showMessage('Please fill all fields.', true);
        return;
    }
    try {
        await saveStudent(data);
        showMessage('Record saved successfully!');
        setFormState('empty');
    } catch (err) {
        showMessage('Save failed: ' + err.message, true);
    }
});

updateBtn.addEventListener('click', async () => {
    const data = getFormData();
    if (!validateForm(data, true)) {
        showMessage('Please fill all fields.', true);
        return;
    }
    data.rollNo = rollNo.value.trim(); // Ensure rollNo is set
    try {
        await updateStudent(data);
        showMessage('Record updated successfully!');
        setFormState('empty');
    } catch (err) {
        showMessage('Update failed: ' + err.message, true);
    }
});

resetBtn.addEventListener('click', () => {
    setFormState('empty');
});

form.addEventListener('submit', e => e.preventDefault());

// ====== On Page Load ======
window.onload = () => {
    setFormState('empty');
}; 