/**
 * @file Time Management Calculator Implementation - Helps calculating and managing time based on user inputs.
 * @author Noah Nickles
 * @date 2024-05-08
 */

/**
 * Sets default attributes for all input elements within the '.input-wrapper' element.
 * This function queries for the '.input-wrapper' and iteratively applies a set of predefined
 * attributes to each input found unless the attribute is already present.
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

/**
 * Fills the input with the minimum allowed value if it is empty.
 * @param {HTMLInputElement} input - The input element to validate and modify if necessary.
 */
function fillEmptyInput(input) {
    if(input.value === '') {
        input.value = parseInt(input.min, 10);
    }
    updateHours();
}

/**
 * Clears the input value if it is exactly '0', allowing for placeholder text to show.
 * @param {HTMLInputElement} input - The input element to be cleared if it contains '0'.
 */
function clearZero(input) {
    if (input.value === '0') {
        input.value = '';
    }
}

/**
 * Validates an input element's value against its defined minimum and maximum attributes,
 * adjusting the value to remain within these bounds.
 * @param {HTMLInputElement} input - The input element to validate.
 */
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

/**
 * Updates the displayed total of used hours and recalculates the remaining hours.
 * This function iterates through all elements with class 'hour-input' to sum the values
 * and update the UI accordingly.
 */
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

/**
 * Calculates suggested study hours based on the 'credit-hours' input value and updates
 * the 'study-hours' input. Assumes study hours should be three times the credit hours.
 */
function updateStudyHours() {
    const creditHours = document.getElementById('credit-hours').value;
    const suggestedHours = creditHours * 3;
    document.getElementById('study-hours').value = suggestedHours;
}

/**
 * Attaches event listeners to various input elements to synchronize changes across
 * related inputs and controls, ensuring UI consistency.
 */
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

    const resetButton = document.getElementById('reset-button');
    if(resetButton) {
        resetButton.addEventListener('click', function() {
            resetToDefault();
        });
    }
}

/**
 * Calculates and displays the percentage use of total hours for each input element with class 'hour-input'.
 * It uses a predefined total of hours and updates each corresponding display element with the calculated percentage.
 */
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
 * Resets all input elements with class 'hour-input' and the slider to their default values.
 * Also resets the visual display of the slider credits and recalculates hours and percentages.
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
 * Initializes the application by setting default attributes, updating hours and study hours,
 * and attaching necessary event listeners after the window loads.
 */
window.onload = function() {
    setDefaultLabelAttributes();
    updateHours();
    updateStudyHours();
    attachEventListeners();
};