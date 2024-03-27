(function ($) {
    'use strict';
    /*==================================================================
        [ Daterangepicker ]*/
    try {
        $('.js-datepicker').daterangepicker({
            "singleDatePicker": true,
            "showDropdowns": true,
            "autoUpdateInput": false,
            locale: {
                format: 'DD/MM/YYYY'
            },
        });
    
        var myCalendar = $('.js-datepicker');
        var isClick = 0;
    
        $(window).on('click',function(){
            isClick = 0;
        });
    
        $(myCalendar).on('apply.daterangepicker',function(ev, picker){
            isClick = 0;
            $(this).val(picker.startDate.format('DD/MM/YYYY'));
    
        });
    
        $('.js-btn-calendar').on('click',function(e){
            e.stopPropagation();
    
            if(isClick === 1) isClick = 0;
            else if(isClick === 0) isClick = 1;
    
            if (isClick === 1) {
                myCalendar.focus();
            }
        });
    
        $(myCalendar).on('click',function(e){
            e.stopPropagation();
            isClick = 1;
        });
    
        $('.daterangepicker').on('click',function(e){
            e.stopPropagation();
        });
    
    
    } catch(er) {console.log(er);}
    /*[ Select 2 Config ]
        ===========================================================*/
    
    try {
        var selectSimple = $('.js-select-simple');
    
        selectSimple.each(function () {
            var that = $(this);
            var selectBox = that.find('select');
            var selectDropdown = that.find('.select-dropdown');
            selectBox.select2({
                dropdownParent: selectDropdown
            });
        });
    
    } catch (err) {
        console.log(err);
    }
    

})(jQuery);

//Event listener to prevent form submission for the registration page
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function(event) {
        const firstName = document.querySelector('input[name="first_name"]').value.trim();
        const lastName = document.querySelector('input[name="last_name"]').value.trim();
        const birthday = document.querySelector('input[name="birthday"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        const phone = document.querySelector('input[name="phone"]').value.trim();
        const subject = document.querySelector('select[name="subject"]').value.trim();

        // Validate First Name (must be at least 2 characters)
        if (firstName === '' || firstName.length < 2) {
            alert('Please enter a valid first name (minimum 2 characters)');
            event.preventDefault(); // Prevent form submission
            return;
        }

        // Validate Last Name (must be at least 2 characters)
        if (lastName === '' || lastName.length < 2) {
            alert('Please enter a valid last name (minimum 2 characters)');
            event.preventDefault(); // Prevent form submission
            return;
        }

        // Define acceptable age range (e.g., 18 to 120 years old)
        const MINIMUM_AGE = 10;
        const MAXIMUM_AGE = 120;

        // Validate Birthday (must be within acceptable age range)
        const birthdayDate = new Date(birthday);
        const currentDate = new Date();
        const userAge = currentDate.getFullYear() - birthdayDate.getFullYear();

        // Check if the birthday is a valid date
        // Check if the user is at least MINIMUM_AGE years old
        // Check if the user is not older than MAXIMUM_AGE
        if (
            isNaN(birthdayDate.getTime()) ||
            birthdayDate >= currentDate || // Check if the birthday is not in the future
            userAge < MINIMUM_AGE ||
            userAge > MAXIMUM_AGE
        ) {
            alert(`Please enter a valid birthday between ${MINIMUM_AGE} and ${MAXIMUM_AGE} years old`);
            event.preventDefault(); // Prevent form submission
            return;
        }

        // Validate Email (must be a valid email format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            event.preventDefault(); // Prevent form submission
            return;
        }

        // Validate Phone Number (must be a valid phone number format)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Please enter a valid 10-digit phone number');
            event.preventDefault(); // Prevent form submission
            return;
        }

        // Validate Subject (must not be the default option)
        if (subject === 'Choose option') {
            alert('Please select a subject');
            event.preventDefault(); // Prevent form submission
            return;
        }

        // All validations passed, allow form submission
    });
});
