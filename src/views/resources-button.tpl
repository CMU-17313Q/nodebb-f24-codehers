<!DOCTYPE html>
<html lang="en">
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
        <ul id="links-list">
            {{#each links}}
            <li><a href="{{this}}" target="_blank">{{this}}</a></li>
            {{/each}}
        </ul>
    </div>

    <script>
        async function fetchLinks() {
            try {
                const response = await fetch('/api/resources/links');
                const data = await response.json();
                const linksList = document.getElementById('links-list');
                data.links.forEach(link => {
                    const listItem = document.createElement('li');
                    const linkElement = document.createElement('a');
                    linkElement.href = link;
                    linkElement.target = '_blank';
                    linkElement.textContent = link;
                    listItem.appendChild(linkElement);
                    linksList.appendChild(listItem);
                });
            } catch (error) {
                console.error('Error fetching links:', error);
            }
        }

        // Fetch links when the page loads
        window.onload = fetchLinks;
    </script>
</body>
</html>