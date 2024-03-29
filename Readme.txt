Microsoft Windows [Version 10.0.22000.2538]
(c) Microsoft Corporation. All rights reserved.

C:\Users\PC>cd Desktop

C:\Users\PC\Desktop>mkdir banking-web-app

C:\Users\PC\Desktop>mkdir banking-web-app
A subdirectory or file banking-web-app already exists.

C:\Users\PC\Desktop>cd banking-web-app

C:\Users\PC\Desktop\banking-web-app>npm init -y
Wrote to C:\Users\PC\Desktop\banking-web-app\package.json:

{
  "name": "banking-web-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}



C:\Users\PC\Desktop\banking-web-app>
C:\Users\PC\Desktop\banking-web-app>npm install express

added 64 packages, and audited 65 packages in 15s

12 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
npm notice
npm notice New minor version of npm available! 10.1.0 -> 10.5.0
npm notice Changelog: https://github.com/npm/cli/releases/tag/v10.5.0
npm notice Run npm install -g npm@10.5.0 to update!
npm notice

C:\Users\PC\Desktop\banking-web-app>touch server.js
'touch' is not recognized as an internal or external command,
operable program or batch file.

C:\Users\PC\Desktop\banking-web-app>echo. > server.js

C:\Users\PC\Desktop\banking-web-app>node server.js
Server is running on port 3000
^C
C:\Users\PC\Desktop\banking-web-app>
C:\Users\PC\Desktop\banking-web-app>npm install body-parser express-session

added 5 packages, and audited 70 packages in 8s

12 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

C:\Users\PC\Desktop\banking-web-app>npm install mysql2

added 11 packages, and audited 81 packages in 11s

12 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

C:\Users\PC\Desktop\banking-web-app>npm install sequelize sequelize-cli

added 117 packages, and audited 198 packages in 44s

29 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

C:\Users\PC\Desktop\banking-web-app>npm install ejs

added 12 packages, and audited 210 packages in 8s

30 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

C:\Users\PC\Desktop\banking-web-app>node server.js
Server is running on port 3000
^C
C:\Users\PC\Desktop\banking-web-app>npm install express-session bcrypt

added 58 packages, and audited 268 packages in 33s

33 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

C:\Users\PC\Desktop\banking-web-app>npm install selenium-webdriver

added 14 packages, and audited 282 packages in 23s

33 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

C:\Users\PC\Desktop\banking-web-app>npm install mocha --save-dev

added 46 packages, and audited 328 packages in 15s

49 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

SELECT * from accounts;

