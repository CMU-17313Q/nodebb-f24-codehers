<div id="resources-page" style="display: none; padding: 20px;">
    <h1>Resources Page</h1>
    <p>This is an empty page.</p>
</div>

<script>
    $(document).ready(function () {
        $('#custom-button').on('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            
            // Hide other content (if any) and show the resources page
            $('#resources-page').show(); // Show the resources page
            // Optionally hide other elements if needed
            // $('.other-content').hide(); // Hide any other content you want
        });
    });
</script>