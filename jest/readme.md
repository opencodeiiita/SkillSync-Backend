# Jest Testing Setup with MongoDB and Express

This project sets up a basic Express app with MongoDB integration and includes Jest for API testing.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

## Setup Instructions

1. **Initialize a new Node.js project:**

   ```bash
   npm init -y
   ```

2. **Install the required dependencies:**

   - For Jest and MongoDB integration:
     ```bash
     npm install --save-dev @shelf/jest-mongodb
     npm install -g jest
     ```

   - For Express and Supertest:
     ```bash
     npm install express supertest
     ```

3. **Remove `package-lock.json` (if it exists):**

   ```bash
   rm package-lock.json
   ```

4. **Update `package.json` scripts:**

   Ensure you have the following script in your `package.json`:

   ```json
   "scripts": {
     "test": "jest"
   }
   ```

5. **Set the entry point for tests in `package.json`:**

   Modify the `main` property to specify the location of your test file:

   ```json
   "main": "__tests__/userProfile.test.js"
   ```

   You can change `"__tests__/userProfile.test.js"` to the desired test file.

## Running Tests

After setting up, you can run your tests with:

```bash
npm test
```

Jest will automatically find and run all test files in your project.

## Conclusion

This setup ensures a smooth testing experience with MongoDB and Express APIs using Jest. Modify the test files to fit your application logic and API endpoints.
