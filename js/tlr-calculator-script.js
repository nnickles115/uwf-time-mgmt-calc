/**
 * @file Time Management Calculator Implementation - Helps calculating and managing time based on user inputs.
 * @author Noah Nickles
 * Email: npn4@students.uwf.edu
 */

/*** Globals ***/
const totalHours = 168;
const percentages = [];
let pieChart;
const colorMapping = {
    'credit-hours': '--nautilus_blue',
    'study-hours': '--luna_blue',
    'work-hours': '--cannon_green',
    'commute-hours': '--spring_green',
    'eating-hours': '--armadillo_grey',
    'sleeping-hours': '--uwf_blue',
    'hygiene-hours': '--uwf_green',
    'org-hours': '--earth',
    'rec-hours': '--camelia',
    'chore-hours': '--regal',
    'social-hours': '--marigold',
    'screen-hours': '--azalea',
    'other-hours': '--ocean'
};

/**
 * Initializes the application by setting default attributes, updating hours and study hours,
 * and attaching necessary event listeners after the window loads.
 */
window.onload = function() {
    initializeApp();
};

function initializeApp() {
    setDefaultAttributes();
    calculateStudyHours();
    attachEventListeners();
    initPieChart();
    calculateHours();
}

/**
 * Sets default attributes for all input elements within the '.input-container' element.
 */
function setDefaultAttributes() {
    const container = document.querySelector('.input-container');
    if(!container) return;

    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => setDefaultAttributesForInput(input));
}

function setDefaultAttributesForInput(input) {
    const defaultAttributes = {
        type: 'number',
        class: 'hour-input',
        min: '0',
        step: '1',
        placeholder: '0'
    };

    Object.entries(defaultAttributes).forEach(([attr, value]) => {
        if(!input.hasAttribute(attr)) {
            input.setAttribute(attr, value);
        }
    });

    input.id = input.name;
    input.onblur = () => fillEmptyInput(input);
    input.onfocus = () => clearZero(input);
    input.oninput = () => validateInput(input);
}

/**
 * Fills the input with the minimum allowed value if it is empty.
 * @param {HTMLInputElement} input - The input element to validate and modify if necessary.
 */
function fillEmptyInput(input) {
    if(input.value === '') {
        input.value = parseInt(input.min, 10);
    }
    calculateHours();
}

/**
 * Clears the input value if it is exactly '0', allowing for placeholder text to show.
 * @param {HTMLInputElement} input - The input element to be cleared if it contains '0'.
 */
function clearZero(input) {
    if(input.value === '0') {
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

    if(isNaN(value) || value < min) {
        value = min;
    }
    else if(value > max) {
        value = max;
    }

    input.value = value;
    calculateHours();
}

/**
 * Updates the displayed total of used hours and recalculates the remaining hours.
 */
function calculateHours() {
    let usedHours = 0;
    const inputs = document.querySelectorAll('.hour-input');
    inputs.forEach(input => usedHours += parseInt(input.value, 10));

    const remainingHours = totalHours - usedHours;
    if(!isNaN(remainingHours) && remainingHours >= 0) {
        document.getElementById('hours-left').textContent = `${remainingHours}`;
        calculatePercentages();
        updatePieChart();
    }
}

/**
 * Calculates suggested study hours based on the 'credit-hours' input value and updates
 * the 'study-hours' input. Assumes study hours should be three times the credit hours.
 */
function calculateStudyHours() {
    const creditHours = document.getElementById('credit-hours').value;
    const suggestedHours = creditHours * 3;
    document.getElementById('study-hours').value = suggestedHours;
}

/**
 * Attaches event listeners to various input elements.
 */
function attachEventListeners() {
    const inputs = document.querySelectorAll('.hour-input');
    inputs.forEach(input => input.addEventListener('input', () => {
        validateInput(input);
        updatePieChart();
    }));

    const resetButton = document.getElementById('reset-button');
    if(resetButton) {
        resetButton.addEventListener('click', resetToDefault);
    }

    syncCreditHoursWithSlider();
}

function syncCreditHoursWithSlider() {
    const slider = document.getElementById('slider');
    const creditHoursInput = document.getElementById('credit-hours');
    const sliderCredits = document.getElementById('slider-credits');

    if(slider && creditHoursInput) {
        creditHoursInput.addEventListener('input', () => {
            syncSliderWithCreditHours(slider, creditHoursInput, sliderCredits);
        });

        slider.addEventListener('input', () => {
            syncCreditHoursWithSliderInput(slider, creditHoursInput, sliderCredits);
        });
    }
}

function syncSliderWithCreditHours(slider, creditHoursInput, sliderCredits) {
    slider.value = creditHoursInput.value;
    sliderCredits.textContent = creditHoursInput.value;
    calculateHours();
    updatePieChart();
}

function syncCreditHoursWithSliderInput(slider, creditHoursInput, sliderCredits) {
    creditHoursInput.value = slider.value;
    sliderCredits.textContent = slider.value;
    calculateStudyHours();
    calculateHours();
    updatePieChart();
}


/**
 * Calculates and displays the percentage use of total hours for each input element.
 */
function calculatePercentages() {
    percentages.length = 0;
    const inputs = document.querySelectorAll('.hour-input');

    inputs.forEach(input => {
        const percentage = ((parseFloat(input.value, 10) || 0) / totalHours) * 100;
        updatePercentageDisplay(input, percentage);
        percentages.push(percentage.toFixed(2));
    });
}

function updatePercentageDisplay(input, percentage) {
    const percentageSpanId = `${input.id}-percentage`;
    const percentageDisplay = document.getElementById(percentageSpanId);
    if(percentageDisplay) {
        percentageDisplay.textContent = `${percentage.toFixed(2)}%`;

        // Set background colors for each percent
        const colorVarName = colorMapping[input.name];
        const color = getComputedStyle(document.documentElement).getPropertyValue(colorVarName).trim();
        percentageDisplay.style.backgroundColor = color;
    }
}

/**
 * Resets all input elements with class 'hour-input' and the slider to their default values.
 * Also resets the visual display of the slider credits and recalculates hours and percentages.
 */
function resetToDefault() {
    resetInputsToDefault();
    resetSliderToDefault();
    calculateHours();
    calculatePercentages();
    updatePieChart();
}

function resetInputsToDefault() {
    const inputs = document.querySelectorAll('.hour-input');
    inputs.forEach(input => {
        if(input) { 
            input.value = input.getAttribute('value'); 
        }
    });
}

function resetSliderToDefault() {
    const slider = document.getElementById('slider');
    if(slider) {
        slider.value = slider.getAttribute('value');
    }

    const sliderCredits = document.getElementById('slider-credits');
    if(sliderCredits) {
        sliderCredits.textContent = document.getElementById('credit-hours').value;
    }
}

// Function to initialize the pie chart
function initPieChart() {
    const ctx = document.getElementById('pie-chart').getContext('2d');
    const data = getPieChartData();

    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: data.colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: false,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const label = data.labels[tooltipItem.index] || '';
                        const value = data.datasets[0].data[tooltipItem.index] || 0;
                        return `${label}: ${value}%`;
                    }
                },
                bodyFontFamily: 'GothamBook',
                bodyFontSize: 14,
            }
        }
    });
}

// Function to update the pie chart
function updatePieChart() {
    if(!pieChart) {
        initPieChart();
    } 
    else {
        const data = getPieChartData();
        pieChart.data.labels = data.labels;
        pieChart.data.datasets[0].data = data.values;
        pieChart.data.datasets[0].backgroundColor = data.colors;
        pieChart.update();
    }
}

// Function to get data for the pie chart
function getPieChartData() {
    const remainingHours = parseInt(document.getElementById('hours-left').textContent);
    const remainingPercentage = (remainingHours / totalHours) * 100;

    const labels = [];
    const values = [];
    const colors = [];

    const inputs = document.querySelectorAll('.hour-input');
    inputs.forEach((input, index) => {
        // Grab label names and associate related percentages with them
        labels.push(input.nextElementSibling.textContent);
        values.push(percentages[index]);

        // Match color of each pie slice with related background colors of percentages
        const colorVarName = colorMapping[input.name];
        const color = getComputedStyle(document.documentElement).getPropertyValue(colorVarName).trim();
        colors.push(color);
    });

    // Define attributes for unused pie slice
    labels.push("Remaining");
    values.push(remainingPercentage.toFixed(2));
    colors.push(getComputedStyle(document.documentElement).getPropertyValue('--background-grey').trim());

    return { labels, values, colors };
}

/**
 * Calculates the luminance of a color.
 * @param {string} hex - The hex color code.
 * @returns {number} The luminance of the color.
 */
function getLuminance(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const a = [r, g, b].map(v => {
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Determines the appropriate font color (black or white) based on the background color luminance.
 * @param {string} hex - The hex color code of the background.
 * @returns {string} The hex color code for the font.
 */
function getContrastColor(hex) {
    const luminance = getLuminance(hex);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}