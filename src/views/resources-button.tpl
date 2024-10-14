<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Resources</title>
</head>
<body>
    <div id="links-container">
        <ul id="links-list"></ul>
    </div>
    <script>
        // Parse the links JSON string
        const links = JSON.parse('{{{escapedLinks}}}');
        const linksList = document.getElementById('links-list');
        
        // Generate the HTML for the links
        links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link;
            a.target = '_blank';
            a.textContent = link;
            li.appendChild(a);
            linksList.appendChild(li);
        });
    </script>
</body>
</html>