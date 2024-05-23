
### Project Summary:
The project is a RESTful API for identifying contacts based on their email addresses and phone numbers. It allows users to query the system with either an email address, a phone number, or both. If the contact does not exist, a new primary contact is created. If the contact already exists, the system determines the oldest contact and designates it as the primary contact. If both email and phone number exist but are from different contacts, the system maps the earlier contact to the primary ID.

### Command to Run:
To run the project, follow these steps:
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the server using `node src/index.js`.
5. The server will start running on `localhost:3000`.

### Endpoints:
- **POST /identify**: Endpoint to identify contacts based on email addresses and phone numbers.

#### Test Cases:
Here are some test cases to validate the functionality of the API:

#### Test Case 1: Add Two Different Contacts with Different Emails and Phone Numbers
```bash
$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "12@test.com", "phoneNumber": "12"}'
$response | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "13@test.com", "phoneNumber": "13"}'
$response | ConvertTo-Json
```

#### Test Case 2: Add a New Contact with an Existing Email and a New Phone Number
```bash
$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "12@test.com", "phoneNumber": "14"}'
$response | ConvertTo-Json
```

#### Test Case 3: Add a New Contact with a New Email and an Existing Phone Number
```bash
$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "15@test.com", "phoneNumber": "13"}'
$response | ConvertTo-Json
```

#### Test Case 4: Add a New Contact with Existing (Old) Email and Phone Number, and a New Contact with Existing (New) Email and Phone Number
```bash
$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "16@test.com", "phoneNumber": "16"}'
$response | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "17@test.com", "phoneNumber": "17"}'
$response | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "16@test.com", "phoneNumber": "17"}'
$response | ConvertTo-Json
```

#### Test Case 5: Add a New Contact with Existing (New) Email and Phone Number, and a New Contact with Existing (Old) Email and Phone Number
```bash
$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "18@test.com", "phoneNumber": "18"}'
$response | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "19@test.com", "phoneNumber": "19"}'
$response | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "19@test.com", "phoneNumber": "18"}'
$response | ConvertTo-Json
```
