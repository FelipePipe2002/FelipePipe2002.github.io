document.addEventListener("DOMContentLoaded", function() {
    // Get all h3 elements inside divs with id "contenttitle"
    var contentTitles = document.querySelectorAll('#contenttitle h3');
    
    // Loop through each h3 element
    contentTitles.forEach(function(element) {
        // Get the content of the h3 element
        var content = element.textContent.trim().toLowerCase();
        
        // Check the content and change the background color accordingly
        if (content === 'finished') {
            element.style.backgroundColor = 'green';
        } else if (content === 'in progress') {
            element.style.backgroundColor = 'orange';
        }
    });
});
