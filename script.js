document.addEventListener("DOMContentLoaded", function() {
    changeBackgroundColor('.contenttitle h3');
    changeBackgroundColor('.contentsubtitle h3');
});

function changeBackgroundColor(selector) {
    var elements = document.querySelectorAll(selector);
    
    elements.forEach(function(element) {
        var content = element.textContent.trim().toLowerCase();
        
        if (content === 'finished') {
            element.style.backgroundColor = 'green';
        } else if (content === 'in progress') {
            element.style.backgroundColor = 'rgb(233, 135, 0)';
        }
    });
}

let btnExpandable = document.getElementById('expandable');
let contentexpandable = document.getElementById('contentexpandable');

btnExpandable.addEventListener('click', function() {
    contentexpandable.style.height = (contentexpandable.style.height === '') ? contentexpandable.scrollHeight + "px" : '';
});
