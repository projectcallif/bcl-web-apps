### Project Setup

How should we setup implementing the features of this app
should we have a feature folder for each feature
The how should we handle the store and api client calls
use the Login flow as an example of how to implement the features
The request body POST `{ identifier: string, password: string }` and response `{ accessToken: string, user: User }`
The response body is of the format below

```
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNzY2MThjNi1mOTM5LTRjNDYtOTM0Ni1lZGM0MzFlZDBkMzAiLCJlbWFpbCI6InVzZXI0MEBiY2wuY29tIiwicGhvbmUiOiI4MDEyMzQ1NjQwIiwiaWF0IjoxNzc0MzgyNTc0LCJleHAiOjE3NzQ5ODczNzR9.JkG0ZUsyxx7ODHf4LiijMyl_M19oOuD8bt_-k4aDs7Y",
    "user": {
      "id": "276618c6-f939-4c46-9346-edc431ed0d30",
      "email": "user40@bcl.com",
      "phone": "8012345640",
      "isEmailVerified": false,
      "isPhoneVerified": true,
      "registrationStep": "UTILITY_BILL_COMPLETE",
      "status": "ACTIVE",
      "profile": {
        "firstName": "REAdaobi",
        "lastName": "Okonkwo",
        "middleName": "Chidera",
        "dateOfBirth": "1992-06-15",
        "gender": "FEMALE",
        "maritalStatus": "SINGLE",
        "city": "Lagos",
        "state": "Lagos",
        "country": "Nigeria"
      }
    }
  }
}
```

### Api Client Setup

Implement a fully functional ApiClient in the project.
It should be able to handle the following:

- Consider the best approach to handle the API client
- Consider the best approach of the use of this ApiClient for both the customer and admin app (Note: they will have different base URLs and different authentication mechanisms)
- Interceptors for requests and responses
- Error handling
- There is a generic response object from the backend in this form `{ success: true, statusCode: 200, message: "Success", data: <T>{} }`
- We will need to create the types that will handle the generic response object

### Login Flow

Create a login screen with the following features:

1. User enters email or phone number
2. User enteres a strong password
3. User can click a button to show or hide the password
4. User should be able to see a forgot password link

** Design Considerations **

- The UI must be beautiful and user friendly
- Design must follow the design system in the project
- Use soft shadows if you need to use shadows
- Use the input components from the widget library folder if an input is needed
