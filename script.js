let uploadedData = [];
let transformedData = [];

function uploadFile() {

    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];

    if (!file) {
        document.getElementById("uploadStatus").innerText =
            "Please select a CSV file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {

        const text = event.target.result;

        const rows = text.trim().split("\n");

        const headers = rows[0]
            .split(",")
            .map(header => header.trim());

        uploadedData = [];

        for (let i = 1; i < rows.length; i++) {

            const values = rows[i]
                .split(",")
                .map(value => value.trim());

            let row = {};

            headers.forEach((header, index) => {
                row[header] = values[index] || "";
            });

            uploadedData.push(row);
        }

        displayData(uploadedData);

        document.getElementById("uploadStatus").innerText =
            "✅ Spreadsheet imported successfully!";
    };

    reader.readAsText(file);
}


function displayData(data) {

    const table = document.getElementById("dataTable");

    table.innerHTML = `
        <thead>
            <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Salary</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");

    data.forEach(row => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${row.employee_id || ""}</td>
            <td>${row.name || ""}</td>
            <td>${row.email || ""}</td>
            <td>${row.department || ""}</td>
            <td>${row.salary || ""}</td>
        `;

        tbody.appendChild(tr);
    });
}


function transformData() {

    if (uploadedData.length === 0) {

        document.getElementById("transformStatus").innerText =
            "Please upload a spreadsheet first.";

        return;
    }

    const source =
        document.getElementById("sourceField").value;

    const target =
        document.getElementById("targetField").value;

    transformedData = uploadedData.map(row => {

        let newRow = { ...row };

        newRow[target] = row[source];

        return newRow;
    });

    document.getElementById("transformStatus").innerText =
        "✅ Transform Map applied successfully!";

    document.getElementById("result").innerText =
        `${transformedData.length} records transformed successfully.`;

    displayData(transformedData);
}


function downloadData() {

    if (transformedData.length === 0) {

        alert("Please apply Transform Map first.");

        return;
    }

    const headers = [
        "employee_id",
        "name",
        "email",
        "department",
        "salary"
    ];

    let csv = headers.join(",") + "\n";

    transformedData.forEach(row => {

        csv += headers
            .map(header => row[header] || "")
            .join(",") + "\n";

    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "transformed_employee_data.csv";

    link.click();

    URL.revokeObjectURL(url);
}