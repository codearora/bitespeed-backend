### Sure, here's a summary of the project along with the command to run it:

### Project Summary:
The project is a RESTful API for identifying contacts based on their email addresses and phone numbers. It allows users to query the system with either an email address, a phone number, or both. If the contact does not exist, a new primary contact is created. If the contact already exists, the system determines the oldest contact and designates it as the primary contact. If both email and phone number exist but are from different contacts, the system maps the earlier contact to the primary ID.

### Command to Run:
To run the project, follow these steps:
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the server using `npm start`.
5. The server will start running on `localhost:3000`.

### Endpoints:
- **POST /identify**: Endpoint to identify contacts based on email addresses and phone numbers.

Feel free to adjust the summary and commands according to your project's specific details!