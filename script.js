let employees = JSON.parse(localStorage.getItem("employees")) || [];

function saveData() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

function addEmployee() {
    const id = prompt("Nhập ID nhân viên (số, không trùng lặp):");
    const name = prompt("Nhập họ tên:");
    const position = prompt("Nhập chức vụ:");
    const department = prompt("Nhập phòng ban:");

    if (id && !isNaN(id) && !employees.some(emp => emp.id == id) && name && position && department) {
        employees.push({
            id: Number(id),
            name,
            position,
            department,
            tasks: [],
            attendance: {} // Lưu giờ vào và ra theo ngày
        });
        saveData();
        renderTable();
    } else {
        alert("ID không hợp lệ hoặc đã tồn tại.");
    }
}

function deleteEmployee(id) {
    employees = employees.filter(emp => emp.id !== id);
    saveData();
    renderTable();
}

function editEmployee(id) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        const newId = prompt("Sửa ID nhân viên:", employee.id);
        const newName = prompt("Sửa tên nhân viên:", employee.name);
        const newPosition = prompt("Sửa chức vụ:", employee.position);
        const newDepartment = prompt("Sửa phòng ban:", employee.department);
        
        if (
            newId && !isNaN(newId) &&
            (Number(newId) === employee.id || !employees.some(emp => emp.id == newId)) &&
            newName && newPosition && newDepartment
        ) {
            employee.id = Number(newId);
            employee.name = newName;
            employee.position = newPosition;
            employee.department = newDepartment;
            saveData();
            renderTable();
        } else {
            alert("ID không hợp lệ hoặc trùng lặp.");
        }
    }
}

// ✅ Thêm nhiệm vụ
function addTask(id) {
    const task = prompt("Nhập nhiệm vụ mới:");
    const employee = employees.find(emp => emp.id === id);
    if (task && employee) {
        employee.tasks.push(task);
        saveData();
        renderTable();
    }
}

// ✅ Xóa nhiệm vụ
function deleteTask(id, taskIndex) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        employee.tasks.splice(taskIndex, 1);
        saveData();
        renderTable();
    }
}

// ✅ Chấm công (Giờ vào & Giờ ra, mỗi ngày chỉ 1 lần)
function markAttendance(id, type) {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
        const now = new Date();
        const today = now.toLocaleDateString("vi-VN");
        const timeString = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

        if (!employee.attendance[today]) {
            employee.attendance[today] = { in: null, out: null };
        }

        if (type === "in" && !employee.attendance[today].in) {
            employee.attendance[today].in = timeString;
        } else if (type === "out" && !employee.attendance[today].out) {
            employee.attendance[today].out = timeString;
        } else {
            alert("Bạn đã chấm công vào/ra hôm nay!");
            return;
        }

        saveData();
        renderTable();
    }
}

function renderTable() {
    const tableBody = document.getElementById("employeeTable");
    tableBody.innerHTML = "";
    
    employees.forEach(emp => {
        const today = new Date().toLocaleDateString("vi-VN");
        const attendance = emp.attendance[today] || { in: "Chưa có", out: "Chưa có" };

        const taskList = emp.tasks.length > 0 
            ? emp.tasks.map((task, index) => 
                `<p>${task} <button onclick="deleteTask(${emp.id}, ${index})">❌</button></p>`
              ).join("")
            : "Chưa có nhiệm vụ";

        const row = `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.department}</td>
                <td>
                    <button onclick="addTask(${emp.id})">Thêm nhiệm vụ</button>
                    ${taskList}
                </td>
                <td>
                    <button onclick="markAttendance(${emp.id}, 'in')">Chấm công vào</button>
                    <p>${attendance.in}</p>
                </td>
                <td>
                    <button onclick="markAttendance(${emp.id}, 'out')">Chấm công ra</button>
                    <p>${attendance.out}</p>
                </td>
                <td>
                    <button onclick="editEmployee(${emp.id})">✏️ Sửa</button>
                    <button class="delete" onclick="deleteEmployee(${emp.id})">❌ Xóa</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

document.addEventListener("DOMContentLoaded", renderTable);
    