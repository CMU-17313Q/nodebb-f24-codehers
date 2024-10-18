'use strict';

define('admin/dashboard/bug-archive', ['hooks'], (hooks) => {
    const ACP = {};

    ACP.init = () => {
        // Fetch the bug data and update the table
        ACP.updateTable();
        hooks.onPage('action:admin.dashboard.updateGraph', ACP.updateTable);

        // Add event listener for the button click
        const submitButton = document.getElementById('submit-bug-feedback');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                ACP.updateTable();
            });
        } else {
            console.error('Submit button not found');
        }
    };

    ACP.updateTable = () => {
        if (window.fetch) {
            const url = `${config.relative_path}/api/admin/get-bug-archive`;
            fetch(url, { credentials: 'include' })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((payload) => {
                    app.parseAndTranslate(ajaxify.data.template.name, 'bugs', payload, (html) => {
                        const tbodyEl = document.querySelector('.bugs-list tbody');
                        if (tbodyEl) {
                            tbodyEl.innerHTML = '';
                            tbodyEl.append(...html.map((idx, el) => el));
                        } else {
                            console.error('Table body element not found');
                        }
                    });
                })
                .catch((error) => {
                    console.error('Error fetching bug archive:', error);
                });
        } else {
            console.error('Fetch API not supported');
        }
    };

    return ACP;
});
