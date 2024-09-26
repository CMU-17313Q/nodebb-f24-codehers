<!-- views/admin/dashboard/bug-archive.tpl -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Bug Archive</title>
    <link rel="stylesheet" href="{relative_path}/styles.css">
</head>
<body>
    <h1>Bug Archive</h1>
    <table>
        <thead>
            <tr>
                <th>Key</th>
                <th>Bug Description</th>
                <th>Submitted By</th>
                <th>Date Submitted</th>
            </tr>
        </thead>
        <tbody>
            {{#each archive}}
            <tr>
                <td>{{this.key}}</td>
                <td>{{this.description}}</td>
                <td>{{this.submittedBy}}</td>
                <td>{{this.dateSubmitted}}</td>
            </tr>
            {{/each}}
        </tbody>
    </table>
</body>
</html>