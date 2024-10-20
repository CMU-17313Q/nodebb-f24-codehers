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
                <th>Title</th>
                <th>Description</th>
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
                console.log('Fetching bug archive...');
                fetch('/api/admin/get-bug-archive') // Adjust endpoint as necessary
        .then(response => response.json())
        .then(data => {
            const bugArchiveBody = document.getElementById('bug-archive-body');
            bugArchiveBody.innerHTML = ''; // Clear existing data

            if (data.archive && data.archive.length > 0) {
                data.archive.forEach(bug => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${validator.escape(bug.title)}</td>
                        <td>${validator.escape(bug.description)}</td>
                        <td>${bug.submittedBy || 'Unknown'}</td> <!-- Display submittedBy -->
                        <td>${new Date(bug.dateSubmitted).toLocaleString()}</td>
                    `;
                    bugArchiveBody.appendChild(row)
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