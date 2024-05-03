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

var expandableButtons = document.querySelectorAll('#expandable');
var expandableContent = document.querySelectorAll('#contentexpandable');

expandableButtons.forEach(function(button, index) {
    button.addEventListener('click', function() {
        expandableContent[index].style.height = (expandableContent[index].style.height === '') ? expandableContent[index].scrollHeight + "px" : '';
        //get image in button
        var img = button.querySelector('img');
        img.src = (img.src.includes('down')) ? 'images/up.png' : 'images/down.png';
        //get parent div
        var parent = expandableContent[index].parentElement.parentElement;
        parent.style.height = (expandableContent[index].style.height === '') ? parseInt(parent.style.height) - parseInt(expandableContent[index].scrollHeight) + "px" : parseInt(parent.style.height) + parseInt(expandableContent[index].scrollHeight) + "px";
    });
    button.click();
})