// ====== JsonPowerDB Configuration ======
// This section is now simpler as the proxy handles the full URL.
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
// This function now sends requests to our own proxy serverless function.
async function jpdbRequest(endpoint, body) {
    // Our proxy endpoint on Vercel is at /api/jpdb-proxy
    const proxyEndpoint = '/api/jpdb-proxy';

    const res = await fetch(proxyEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // We wrap the original endpoint and body to send to our proxy.
        body: JSON.stringify({
            jpdbEndpoint: endpoint, // e.g., '/api/irl' or '/api/iml'
            jpdbBody: body          // The original request body for JPDB
        })
    });

    // Check if the proxy itself returned an error.
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Proxy request failed with non-JSON response' }));
        throw new Error(errorData.message || 'An unknown proxy error occurred');
    }
    
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
    // The '/api/irl' endpoint is now passed to our proxy.
    const res = await jpdbRequest('/api/irl', body);
    if (res.status === 400) return null; // Not found
    // The response from the proxy is the direct response from JPDB.
    if (res.status === 200) {
        // The actual record is nested inside a stringified 'data' field in the JPDB response.
        if (typeof res.data === 'string') {
            try {
                const parsedData = JSON.parse(res.data);
                return parsedData.record;
            } catch (e) {
                console.error("Failed to parse JPDB data string:", e);
                throw new Error("Received malformed data from server.");
            }
        }
        return res.data.record;
    }
    throw new Error(res.message || 'Error fetching data');
}

async function saveStudent(data) {
    const body = {
        token: JPDB_TOKEN,
        dbName: DB_NAME,
        rel: RELATION_NAME,
        cmd: 'PUT',
        jsonStr: data
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
        jsonStr: data,
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