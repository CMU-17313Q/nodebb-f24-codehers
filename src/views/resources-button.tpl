<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
</head>
<body>
    <div class="container">
        <h1>Resources</h1>
        <p>Welcome to the resources page! Here you can find various links and materials.</p>

        <h2>Useful Links</h2>
        <ul id="links-list"></ul>
    </div>
    <script>
        // Parse the links JSON string
        const links = JSON.parse('{{{links}}}');
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