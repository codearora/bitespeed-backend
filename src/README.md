### Sure, here's a summary of the project along with the command to run it:

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

#### Test Case1: Make 2 different - different emails and numbers add in our database.
    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "12", "phoneNumber": "12"}'
    
    $response | ConvertTo-Json

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "13", "phoneNumber": "12"}'
    
    $response | ConvertTo-Json

#### Test Case2: Email of an existing and number not existing - make a new field and add it to db with mapping to primary one.

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "12", "phoneNumber": "14"}'
    
    $response | ConvertTo-Json

#### Test Case3: Email of not existing and number existing - make a new field and add it to db with mapping to primary one.

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "15", "phoneNumber": "13"}'
    
    $response | ConvertTo-Json

#### Test Case4: Email of existing (old) and number of existing (new) - make new field map to secondry and with mapping to primary one (old).

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "16", "phoneNumber": "16"}'
    
    $response | ConvertTo-Json

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "17", "phoneNumber": "17"}'
    
    $response | ConvertTo-Json

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "16", "phoneNumber": "17"}'
    
    $response | ConvertTo-Json

#### Test Case4: Email of existing (new) and number of existing (old) - make new field map to secondry and with mapping to primary one (old).

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "18", "phoneNumber": "18"}'
    
    $response | ConvertTo-Json

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "19", "phoneNumber": "19"}'
    
    $response | ConvertTo-Json

    Test Command: $response = Invoke-RestMethod -Uri http://localhost:3000/identify -Method Post -ContentType "application/json" -Body '{"email": "19", "phoneNumber": "18"}'
    
    $response | ConvertTo-Json

Feel free to adjust the summary and commands according to your project's specific details!