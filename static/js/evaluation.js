// LLM Feedback Engine - Client-side JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize rating interactions
    initializeRatingInteractions();
    
    // Initialize responsive features
    initializeResponsiveFeatures();
    
    // Initialize tooltips and popovers
    initializeBootstrapComponents();
    
    // Initialize table interactions
    initializeTableFeatures();
}

// Form Validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.classList.add('was-validated');
        });
    });
    
    // Real-time validation for rating fields
    const ratingSelects = document.querySelectorAll('select[name$="rating"], select[name="helpfulness"], select[name="correctness"], select[name="coherence"], select[name="empathy_tone"], select[name="safety"]');
    ratingSelects.forEach(select => {
        select.addEventListener('change', function() {
            validateRatingField(this);
            updateOverallRating();
        });
    });
}

function validateForm(form) {
    let isValid = true;
    
    // Check required rating fields
    const requiredRatings = form.querySelectorAll('select[required]');
    requiredRatings.forEach(field => {
        if (!field.value) {
            showFieldError(field, 'Please select a rating');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Check text area length limits
    const textAreas = form.querySelectorAll('textarea[maxlength]');
    textAreas.forEach(field => {
        if (field.value.length > field.getAttribute('maxlength')) {
            showFieldError(field, 'Text exceeds maximum length');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

function validateRatingField(field) {
    const value = parseInt(field.value);
    
    if (value < 1 || value > 5) {
        showFieldError(field, 'Rating must be between 1 and 5');
        return false;
    }
    
    clearFieldError(field);
    
    // Add visual feedback based on rating value
    field.classList.remove('text-danger', 'text-warning', 'text-success');
    if (value <= 2) {
        field.classList.add('text-danger');
    } else if (value <= 3) {
        field.classList.add('text-warning');
    } else {
        field.classList.add('text-success');
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Rating Interactions
function initializeRatingInteractions() {
    // Auto-calculate overall rating based on individual ratings
    const ratingFields = document.querySelectorAll('select[name="helpfulness"], select[name="correctness"], select[name="coherence"], select[name="empathy_tone"], select[name="safety"]');
    ratingFields.forEach(field => {
        field.addEventListener('change', function() {
            updateRatingVisuals(this);
            updateOverallRating();
        });
    });
    
    // Initialize safety rating special handling
    const safetyField = document.querySelector('select[name="safety"]');
    if (safetyField) {
        safetyField.addEventListener('change', function() {
            handleSafetyRatingChange(this);
        });
    }
    
    // Initialize rating visuals
    initializeRatingVisuals();
}

function updateOverallRating() {
    const ratingFields = document.querySelectorAll('select[name="helpfulness"], select[name="correctness"], select[name="coherence"], select[name="empathy_tone"], select[name="safety"]');
    const overallField = document.querySelector('select[name="overall_rating"]');
    
    if (!overallField) return;
    
    let totalRating = 0;
    let ratedFields = 0;
    
    ratingFields.forEach(field => {
        if (field.value) {
            totalRating += parseInt(field.value);
            ratedFields++;
        }
    });
    
    if (ratedFields >= 3) { // Only auto-calculate if at least 3 ratings are provided
        const averageRating = Math.round(totalRating / ratedFields);
        overallField.value = averageRating;
        validateRatingField(overallField);
        updateRatingVisuals(overallField);
    }
    
    // Update the average rating display
    updateAverageRating();
}

function handleSafetyRatingChange(field) {
    const value = parseInt(field.value);
    const safetyContainer = field.closest('.row') || field.parentNode;
    
    // Show safety concerns field if rating is low
    const safetyConcernsField = document.querySelector('textarea[name="safety_concerns"]');
    const revisionCheckbox = document.querySelector('input[name="requires_revision"]');
    
    if (value <= 2 && safetyConcernsField) {
        safetyConcernsField.closest('.mb-3').style.display = 'block';
        safetyConcernsField.setAttribute('required', 'required');
        
        // Suggest revision for high-risk responses
        if (revisionCheckbox) {
            revisionCheckbox.checked = true;
        }
        
        // Show warning message
        showSafetyWarning(safetyContainer);
    } else if (safetyConcernsField) {
        safetyConcernsField.closest('.mb-3').style.display = 'block'; // Keep visible but not required
        safetyConcernsField.removeAttribute('required');
        hideSafetyWarning(safetyContainer);
    }
}

function showSafetyWarning(container) {
    // Remove existing warning
    const existingWarning = container.querySelector('.safety-warning');
    if (existingWarning) {
        existingWarning.remove();
    }
    
    const warning = document.createElement('div');
    warning.className = 'alert alert-warning mt-2 safety-warning';
    warning.innerHTML = '<i data-feather="alert-triangle" class="me-2"></i>Low safety rating detected. Please provide detailed safety concerns.';
    container.appendChild(warning);
    
    // Re-initialize feather icons
    if (window.feather) {
        feather.replace();
    }
}

function hideSafetyWarning(container) {
    const warning = container.querySelector('.safety-warning');
    if (warning) {
        warning.remove();
    }
}

// Responsive Features
function initializeResponsiveFeatures() {
    // Responsive table handling
    const tables = document.querySelectorAll('.table-responsive table');
    tables.forEach(table => {
        if (window.innerWidth < 768) {
            makeTableMobileResponsive(table);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        tables.forEach(table => {
            if (window.innerWidth < 768) {
                makeTableMobileResponsive(table);
            } else {
                restoreTableDesktop(table);
            }
        });
    }, 250));
}

function makeTableMobileResponsive(table) {
    // Add mobile-responsive class
    table.classList.add('mobile-responsive');
    
    // Stack table cells vertically on mobile
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.classList.add('mobile-row');
    });
}

function restoreTableDesktop(table) {
    table.classList.remove('mobile-responsive');
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        row.classList.remove('mobile-row');
    });
}

// Bootstrap Components
function initializeBootstrapComponents() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Table Features
function initializeTableFeatures() {
    // Add sorting to tables
    const sortableTables = document.querySelectorAll('table[data-sortable]');
    sortableTables.forEach(table => {
        addTableSorting(table);
    });
    
    // Add filtering
    const filterInputs = document.querySelectorAll('input[data-table-filter]');
    filterInputs.forEach(input => {
        input.addEventListener('input', debounce(function() {
            filterTable(this);
        }, 300));
    });
}

function addTableSorting(table) {
    const headers = table.querySelectorAll('thead th[data-sortable]');
    
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            sortTable(table, index);
        });
        
        // Add sort indicator
        const indicator = document.createElement('span');
        indicator.className = 'sort-indicator ms-2';
        indicator.innerHTML = '<i data-feather="chevrons-up-down"></i>';
        header.appendChild(indicator);
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const header = table.querySelectorAll('thead th')[columnIndex];
    
    // Determine sort direction
    const currentDirection = header.dataset.sortDirection || 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
    header.dataset.sortDirection = newDirection;
    
    // Clear other headers' sort indicators
    table.querySelectorAll('thead th').forEach(th => {
        if (th !== header) {
            delete th.dataset.sortDirection;
        }
    });
    
    // Sort rows
    rows.sort((a, b) => {
        const aVal = a.cells[columnIndex].textContent.trim();
        const bVal = b.cells[columnIndex].textContent.trim();
        
        // Try to parse as numbers
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        
        let comparison;
        if (!isNaN(aNum) && !isNaN(bNum)) {
            comparison = aNum - bNum;
        } else {
            comparison = aVal.localeCompare(bVal);
        }
        
        return newDirection === 'asc' ? comparison : -comparison;
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort indicator
    updateSortIndicator(header, newDirection);
}

function updateSortIndicator(header, direction) {
    const indicator = header.querySelector('.sort-indicator i');
    if (indicator) {
        indicator.setAttribute('data-feather', direction === 'asc' ? 'chevron-up' : 'chevron-down');
        if (window.feather) {
            feather.replace();
        }
    }
}

function filterTable(input) {
    const tableId = input.dataset.tableFilter;
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const filter = input.value.toLowerCase();
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? '' : 'none';
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoadingState(button) {
    if (button) {
        button.classList.add('loading');
        button.disabled = true;
    }
}

function hideLoadingState(button) {
    if (button) {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Export session functionality
function exportSession(sessionId, format = 'json') {
    const exportButton = document.querySelector(`[href*="export_session/${sessionId}"]`);
    showLoadingState(exportButton);
    
    // The actual export is handled by the server route
    // This just provides visual feedback
    setTimeout(() => {
        hideLoadingState(exportButton);
    }, 2000);
}

// Auto-save functionality for long forms
function initializeAutoSave() {
    const form = document.querySelector('#evaluationForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const autoSaveKey = `autosave_${form.dataset.sessionId}_${form.dataset.responseId}`;
    
    // Load saved data
    const savedData = localStorage.getItem(autoSaveKey);
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field) {
                    field.value = data[key];
                }
            });
        } catch (e) {
            console.warn('Could not restore auto-saved data:', e);
        }
    }
    
    // Save on change
    form.addEventListener('input', debounce(function() {
        const currentData = {};
        const formData = new FormData(form);
        
        for (let [key, value] of formData.entries()) {
            currentData[key] = value;
        }
        
        localStorage.setItem(autoSaveKey, JSON.stringify(currentData));
    }, 1000));
    
    // Clear auto-save on successful submit
    form.addEventListener('submit', function() {
        localStorage.removeItem(autoSaveKey);
    });
}

// Enhanced Rating Visual Functions
function initializeRatingVisuals() {
    // Create visual star displays for each rating field
    const ratingFields = document.querySelectorAll('.rating-select[data-rating-type]');
    ratingFields.forEach(field => {
        const ratingType = field.dataset.ratingType;
        const visualContainer = document.querySelector(`[data-rating="${ratingType}"]`);
        if (visualContainer) {
            createStarDisplay(visualContainer, 0);
        }
    });
    
    // Initialize average stars display
    const averageContainer = document.getElementById('averageStars');
    if (averageContainer) {
        createStarDisplay(averageContainer, 0, true);
    }
}

function createStarDisplay(container, rating, isLarge = false) {
    container.innerHTML = '';
    const starClass = isLarge ? 'star' : 'rating-star';
    
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        star.setAttribute('data-feather', 'star');
        star.className = `${starClass} ${i <= rating ? 'filled' : ''}`;
        container.appendChild(star);
    }
    
    // Re-initialize feather icons
    if (window.feather) {
        feather.replace();
    }
}

function updateRatingVisuals(selectField) {
    const ratingType = selectField.dataset.ratingType;
    const rating = parseInt(selectField.value) || 0;
    const visualContainer = document.querySelector(`[data-rating="${ratingType}"]`);
    
    if (visualContainer) {
        createStarDisplay(visualContainer, rating);
        
        // Add visual feedback based on rating value
        selectField.classList.remove('text-danger', 'text-warning', 'text-success');
        if (rating <= 2) {
            selectField.classList.add('text-danger');
        } else if (rating <= 3) {
            selectField.classList.add('text-warning');
        } else if (rating > 0) {
            selectField.classList.add('text-success');
        }
    }
}

function updateAverageRating() {
    const ratingFields = document.querySelectorAll('select[name="helpfulness"], select[name="correctness"], select[name="coherence"], select[name="empathy_tone"], select[name="safety"]');
    const averageContainer = document.getElementById('averageStars');
    const averageScoreElement = document.querySelector('.average-score');
    const averageDisplay = document.querySelector('.average-rating-display');
    
    if (!averageContainer || !averageScoreElement) return;
    
    let totalRating = 0;
    let ratedFields = 0;
    
    ratingFields.forEach(field => {
        if (field.value) {
            totalRating += parseInt(field.value);
            ratedFields++;
        }
    });
    
    if (ratedFields > 0) {
        const averageRating = totalRating / ratedFields;
        const roundedAverage = Math.round(averageRating * 10) / 10; // Round to 1 decimal
        
        averageScoreElement.textContent = roundedAverage.toFixed(1);
        createStarDisplay(averageContainer, Math.round(averageRating), true);
        
        if (averageDisplay) {
            averageDisplay.classList.add('active');
        }
        
        // Update progress indicator if it exists
        updateProgressIndicator(ratedFields / ratingFields.length * 100);
    } else {
        averageScoreElement.textContent = '-';
        createStarDisplay(averageContainer, 0, true);
        
        if (averageDisplay) {
            averageDisplay.classList.remove('active');
        }
    }
}

function updateProgressIndicator(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

// Character count functionality
function initializeCharacterCounts() {
    const textareas = document.querySelectorAll('.feedback-textarea');
    textareas.forEach(textarea => {
        const countElement = textarea.parentNode.querySelector('.char-count');
        if (countElement) {
            // Update count on input
            textarea.addEventListener('input', function() {
                const count = this.value.length;
                countElement.textContent = count;
                
                // Color coding based on length
                const maxLength = 2000;
                if (count > maxLength * 0.9) {
                    countElement.className = 'text-warning';
                } else if (count > maxLength * 0.95) {
                    countElement.className = 'text-danger';
                } else {
                    countElement.className = 'text-muted';
                }
            });
            
            // Initialize count
            textarea.dispatchEvent(new Event('input'));
        }
    });
}

// Initialize auto-save when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAutoSave();
    initializeCharacterCounts();
});
