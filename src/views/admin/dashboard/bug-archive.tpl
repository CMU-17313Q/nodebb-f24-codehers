<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bug Archive</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        h1 {
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        button {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
    </style>
</head>
<body>
    <h1>Bug Archive</h1>
    <button id="refresh-bug-archive">Refresh</button>
    <table>
        <thead>
            <tr>
                <th>Key</th>
                <th>Bug Description</th>
                <th>Submitted By</th>
                <th>Date Submitted</th>
            </tr>
        </thead>
        <tbody id="bug-archive-body">
            <!-- Bug data will be inserted here -->
        </tbody>
    </table>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const refreshButton = document.getElementById('refresh-bug-archive');
        const bugArchiveBody = document.getElementById('bug-archive-body');

        function fetchBugArchive() {
            fetch('/api/admin/dashboard/bug-archive')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    bugArchiveBody.innerHTML = '';
                    if (data.archive && data.archive.length > 0) {
                        data.archive.forEach(bug => {
                            const row = document.createElement('tr');
                            row.innerHTML = `
                                <td>${bug.title}</td>
                                <td>${bug.description}</td>
                                <td>${bug.submittedBy}</td>
                                <td>${bug.dateSubmitted}</td>
                            `;
                            bugArchiveBody.appendChild(row);
                        });
                    } else {
                        const row = document.createElement('tr');
                        row.innerHTML = '<td colspan="4">No bugs found</td>';
                        bugArchiveBody.appendChild(row);
                    }
                })
                .catch(error => {
                    console.error('Error fetching bug archive:', error);
                });
        }

        if (refreshButton && bugArchiveBody) {
            refreshButton.addEventListener('click', function() {
                console.log("clicked refresh button");
                fetchBugArchive();
            });

            // Fetch the bug archive when the page loads
            fetchBugArchive();
        } else {
            console.error('Required elements not found in the DOM');
        }
    });
</script>
</body>
</html>