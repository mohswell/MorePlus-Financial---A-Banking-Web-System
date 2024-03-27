const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Authentication Tests', function() {
    let driver;

    before(async function() {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async function() {
        await driver.quit();
    });

    it('should register a new user', async function() {
        await driver.get('http://localhost:3000/register');
        await driver.findElement(By.name('username')).sendKeys('testuser');
        await driver.findElement(By.name('password')).sendKeys('password123');
        await driver.findElement(By.name('confirmPassword')).sendKeys('password123');
        await driver.findElement(By.tagName('form')).submit();
        await driver.wait(until.urlIs('http://localhost:3000/login'));
    });

    it('should login an existing user', async function() {
        await driver.get('http://localhost:3000/login');
        await driver.findElement(By.name('username')).sendKeys('testuser');
        await driver.findElement(By.name('password')).sendKeys('password123');
        await driver.findElement(By.tagName('form')).submit();
        await driver.wait(until.urlIs('http://localhost:3000/dashboard'));
        const username = await driver.findElement(By.className('username')).getText();
        assert.strictEqual(username, 'testuser');
    });
});
