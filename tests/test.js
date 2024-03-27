const { Builder, By, until } = require('selenium-webdriver');

// Define the URL of your application
const URL = 'http://localhost:3000';

// Create a new instance of the WebDriver for each test
async function createDriver() {
    return new Builder().forBrowser('chrome').build();
}

// Test case for registration page
async function testRegistrationPage() {
    let driver;
    try {
        // Open a new browser window
        driver = await createDriver();

        await driver.get(`${URL}/register`);

        // Add a delay to ensure the page is fully loaded
        await driver.sleep(2000);

        // Verify that registration form elements are visible and enabled
        await verifyFormElements(driver, '.validate-form');

        // Fill in the registration form with correct values
        await fillRegistrationForm(driver, 'John', 'Doe', '1990-01-01', 'Male', 'john.doe@example.com', '1234567890', 'password123', 'Test Subject');

        // Submit the form
        await driver.findElement(By.css('.register-form-btn')).click();

        // Wait for registration success message
        await driver.wait(until.elementLocated(By.css('.registration-success')), 10000);

        console.log('Registration test with correct values passed.');

        // Close the browser window
        await driver.quit();

        // Open a new browser window for the next test
        driver = await createDriver();

        await driver.get(`${URL}/register`);

        // Add a delay to ensure the page is fully loaded
        await driver.sleep(2000);

        // Verify that registration form elements are visible and enabled
        await verifyFormElements(driver, '.validate-form');

        // Fill in the registration form with incorrect email
        await fillRegistrationForm(driver, 'A', 'D', '1790-01-01', 'Male', 'fakemail', '1234567890', 'password123', 'Test Subject');

        // Submit the form
        await driver.findElement(By.css('.register-form-btn')).click();

        // Wait for registration error message
        await driver.wait(until.elementLocated(By.css('.registration-error')), 10000);

        console.log('Registration test with incorrect email failed.');
    } catch (error) {
        console.error('Registration test failed:', error);
    } finally {
        // Close the browser window in case of any errors
        if (driver) {
            await driver.quit();
        }
    }
}

// Test case for login page
async function testLoginPage() {
    let driver;
    try {
        // Open a new browser window
        driver = await createDriver();

        await driver.get(`${URL}/login`);

        // Add a delay to ensure the page is fully loaded
        await driver.sleep(2000);

        // Verify that login form elements are visible and enabled
        await verifyFormElements(driver, '.validate-form');

        // Fill in the login form with correct credentials
        await fillLoginForm(driver, 'john.doe@example.com', 'password123');

        // Submit the form
        await driver.findElement(By.css('.login100-form-btn')).click();

        // Wait for dashboard page to load
        await driver.wait(until.titleIs('Dashboard'), 15000);

        console.log('Login test with correct credentials passed.');

        // Close the browser window
        await driver.quit();

        // Open a new browser window for the next test
        driver = await createDriver();

        await driver.get(`${URL}/login`);

        // Add a delay to ensure the page is fully loaded
        await driver.sleep(2000);

        // Verify that login form elements are visible and enabled
        await verifyFormElements(driver, '.validate-form');

        // Fill in the login form with incorrect password
        await fillLoginForm(driver, 'john.doe@example.com', 'invalidpassword');

        // Submit the form
        await driver.findElement(By.css('.login100-form-btn')).click();

        // Wait for login error message
        await driver.wait(until.elementLocated(By.css('.login-error')), 10000);

        console.log('Login test with incorrect password failed.');
    } catch (error) {
        console.error('Login test failed:', error);
    } finally {
        // Close the browser window in case of any errors
        if (driver) {
            await driver.quit();
        }
    }
}

// Helper function to verify form elements visibility and enablement
async function verifyFormElements(driver, formSelector) {
    const formElements = await driver.findElements(By.css(`${formSelector} .input100`));
    for (const element of formElements) {
        if (!(await element.isDisplayed()) || !(await element.isEnabled())) {
            throw new Error('Form element is not visible or enabled');
        }
    }
}

// Helper function to fill registration form
async function fillRegistrationForm(driver, firstName, lastName, birthday, gender, email, phone, password, subject) {
    await driver.findElement(By.name('first_name')).sendKeys(firstName);
    await driver.findElement(By.name('last_name')).sendKeys(lastName);
    await driver.findElement(By.name('birthday')).sendKeys(birthday);
    await driver.findElement(By.name('gender')).sendKeys(gender);
    await driver.findElement(By.name('email')).sendKeys(email);
    await driver.findElement(By.name('phone')).sendKeys(phone);
    await driver.findElement(By.name('password')).sendKeys(password);
    await driver.findElement(By.name('subject')).sendKeys(subject);
}

// Helper function to fill login form
async function fillLoginForm(driver, email, password) {
    await driver.findElement(By.name('email')).sendKeys(email);
    await driver.findElement(By.name('pass')).sendKeys(password);
}

// Run the tests
(async function() {
    await testRegistrationPage();
    await testLoginPage();
})();
