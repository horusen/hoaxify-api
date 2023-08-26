<h1 align="center">Hoaxify</h1>

<p align="center">
  <strong>Hoax Publishing Platform with Extensive Testing</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT">
  </a>
</p>

<p align="center">
  Hoaxify is a platform designed to enhance your testing experience by covering various aspects such as unit testing, integration testing, end-to-end testing, and mock testing. The platform serves as a space for sharing and exploring hoaxes in a controlled environment.
</p>

## :rocket: Tech Stack

- **Node.js Framework**: Express.js
- **Database**: Sequelize (MySQL)
- **Authentication**: Passport.js
- **Email**: Nodemailer
- **Translation**: i18n
- **Testing Frameworks**: Jest, Supertest, Sequelize Mocking, Nock, Sqlite

## :sparkles: Key Features

- **Hoax Publishing**: Share and explore hoaxes within a secure environment.
- **User Authentication**: Implement user authentication using Passport.js.
- **Email Notifications**: Utilize Nodemailer for sending email notifications.
- **Translation**: Enhance user experience with i18n localization.
- **Extensive Testing**: Cover various testing types - unit, integration, end-to-end, and mocking.
  
## :gear: Testing Strategy

- **Unit Testing**: Test individual units of code with Jest.
- **Integration Testing**: Test interaction between different parts of the application with Supertest and Sequelize Mocking.
- **End-to-End Testing**: Test entire user workflows with real browser interactions using tools like Cypress.
- **Mock Testing**: Mock external services and APIs using Nock.

## :hammer_and_wrench: Getting Started

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Set up your database configuration in `config/config.json`.
4. Set up environment variables for email and localization.
5. Run the server: `npm start`.
6. For testing:
   - Run unit tests: `npm test`.
   - Run integration tests: `npm run test:integration`.
   - Run end-to-end tests: `npm run test:e2e`.

## :octocat: Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## :scroll: License

This project is licensed under the MIT License.
