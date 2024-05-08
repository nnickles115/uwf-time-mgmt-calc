/**
 * 
 */
function setDefaultLabelAttributes() {
    const wrapper = document.querySelector('.input-wrapper');
    if(!wrapper) return;

    const inputs = wrapper.querySelectorAll('input');
    const defaultAttributes = [
        { name: 'type', value: 'number'},
        { name: 'class', value: 'hour-input' },
        { name: 'min', value: '0' },
        { name: 'step', value: '1' },
        { name: 'placeholder', value: '0' },
        { name: 'onblur', value: 'fillEmptyInput(this)' },
        { name: 'onfocus', value: 'clearZero(this)' },
        { name: 'oninput', value: 'validateInput(this)' }
    ];

    inputs.forEach(input => {
        // Set each attr ID to match the name
        input.id = input.name; 

        defaultAttributes.forEach(attr => {
            // Fill in the rest of the defaults
            if(!input.hasAttribute(attr.name)) {
                input.setAttribute(attr.name, attr.value);
            }
        });
    });
}

function fillEmptyInput(input) {
    if(input.value === '') {
        input.value = parseInt(input.min, 10);
    }
    updateHours();
}

function clearZero(input) {
    if (input.value === '0') {
        input.value = '';
    }
}

function validateInput(input) {
    const min = parseInt(input.min, 10);
    const max = parseInt(input.max, 10);
    let value = parseInt(input.value, 10);

    if(value < min) {
        value = min;
    }
    else if(value > max) {
        value = max;
    }

    updateHours();
}

function updateHours() {
    const totalHours = 168;
    let usedHours = 0;

    const inputs = document.querySelectorAll('.hour-input');
    inputs.forEach(input => {
        usedHours += parseInt(input.value, 10);
    });

    const remainingHours = totalHours - usedHours;
    if(!isNaN(remainingHours)) {
        document.getElementById('hours-left').textContent = `${remainingHours}`;
    }

    calculatePercentages();
}

function updateStudyHours() {
    const creditHours = document.getElementById('credit-hours').value;
    const suggestedHours = creditHours * 3;
    document.getElementById('study-hours').value = suggestedHours;
}

function attachEventListeners() {
    const slider = document.getElementById('slider');
    const creditHoursInput = document.getElementById('credit-hours');
    const sliderCredits = document.getElementById('slider-credits');

    // Sync the credit hour slider and attending class input box
    if(slider && creditHoursInput) {
        slider.addEventListener('input', function() {
            creditHoursInput.value = this.value;
            sliderCredits.textContent = this.value;

            updateStudyHours(); // Allow only slider to scale study hours
            updateHours();
        });

        creditHoursInput.addEventListener('input', function() {
            slider.value = this.value;
            sliderCredits.textContent = this.value;
            
            updateHours();
        });
    }

    // Listener for the reset button
    const resetButton = document.getElementById('reset-button');
    if(resetButton) {
        resetButton.addEventListener('click', function() {
            resetToDefault();
        });
    }
}

function calculatePercentages() {
    const totalHours = 168;
    const inputs = document.querySelectorAll('.hour-input');

    // Calculate and display percentage for each input
    inputs.forEach(input => {
        const percentage = ((parseFloat(input.value, 10) || 0) / totalHours) * 100;
        const percentageSpanId = input.id + '-percentage';
        const percentageDisplay = document.getElementById(percentageSpanId);
        if(percentageDisplay) {
            percentageDisplay.textContent = `${percentage.toFixed(2)}%`;
        }
    });
}

/**
 * 
 */
function resetToDefault() {
    // Reset each input field
    const inputs = document.querySelectorAll('.hour-input');
    inputs.forEach(input => {
        if(input) {
            // Reset each element to its default
            input.value = input.getAttribute('value');
        }
    });

    // Reset slider
    const slider = document.getElementById('slider');
    if(slider) {
        slider.value = slider.getAttribute('value');
    }

    // Reset slider credits
    const sliderCredits = document.getElementById('slider-credits');
    if(sliderCredits) {
        sliderCredits.textContent = document.getElementById('credit-hours').value;
    }

    // Reset number of hours remaining
    updateHours();

    // Reset percentages
    calculatePercentages();
}

/**
 * 
 */
window.onload = function() {
    setDefaultLabelAttributes();
    updateHours();
    updateStudyHours();
    attachEventListeners();
};