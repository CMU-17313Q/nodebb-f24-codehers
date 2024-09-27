'use strict';

define('admin/dashboard/bug-archive', ['hooks'], (hooks) => {
    const ACP = {};

    ACP.init = () => {
        // Fetch the bug data and update the table
        ACP.updateTable();
        hooks.onPage('action:admin.dashboard.updateGraph', ACP.updateTable);
    };

    ACP.updateTable = () => {
        if (window.fetch) {
            fetch(`${config.relative_path}/api${ajaxify.data.url}${window.location.search}`, { credentials: 'include' }).then((response) => {
                if (response.ok) {
                    response.json().then(function (payload) {
                        app.parseAndTranslate(ajaxify.data.template.name, 'bugs', payload, function (html) {
                            const tbodyEl = document.querySelector('.bugs-list tbody');
                            tbodyEl.innerHTML = '';
                            tbodyEl.append(...html.map((idx, el) => el));
                        });
                    });
                }
            });
        }
    };

    return ACP;
});