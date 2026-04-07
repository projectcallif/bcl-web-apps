### Customer App Payments and Transactions Screen

Implement the payments and transations screen and add it to the dashboard nav @apps/customer/src/layouts/DashboardLayout.vue. This screen should have the history information of any transaction for both Disbursement and Repayment and for which loan product the trasaction is for.

- Add a date picker to filter transactions by date
- Add a pagination component to handle the list of transactions by pages

### My Loans Listing Flow

Implement the feature where a user can see the list of all loand they have collected
this list card can contain the following details:

- Purpose of the loan, Loan amount, Loan status, Amount paid, Outstanding balance, Tenor, Next repayment date
- Create a pagination component to handle the list of loans
- This screen should have a filter option to filter loans by status
- This screen should container a button or entry card to apply for a new loan
- The top of this list can display a summary of the user's loans or statistics of the loans the user have been collecting

### Loan Details Flow

- Create Loan Details screen
- The details screen should contain the ensential details of the loan
- The details screen should have a way to view your loan repayment schedules
- Then schedule list should have a button to download the repayment schedule as a csv
- The details screen should have a way to view your loan agreement
- Add a button to make a payment on the loan (For now do nothing with the button)

### Loan Application Flow

When a user click on apply for a loan on the dashboard or on the My Loans screen the following proceess will take place:

1. Display a scren that shows the BCL terms and conditions to be acceted by the user
2. Customer links bank account (demo screen for now, using Mono)
3. Display a screen that shows the loan eligibility check results
4. Screen for customer to select loan amount & tenor (this screen will show the interest rate per Tenor selected)
5. Repayment schedule list screen is displayed for the selected Tenor
6. Screen for customer to accept and sign loan terms and conditions
7. Screen showing bank details for loan disbursement
8. Beautiful Screen informing customer that Loan is processing and will be disbursed

Note: The loan amount input screen will have a maximum amount, we should also provide a slider that will allow a customer slide between min and max amount

Note: Load agreements and terms screen can display/render html for better formating and readability
Note: you can simualate API calls and return dummy data from the data source for now.

### Customer Dashboard

We need to implement a dashboard and navigation menu for the customer user.
This will be the home page for the customer after login
The dashboard should have the left menu sutiable for a loan fintech web app
The menu should contain the following options:

1. Dashboard
2. My Loans
3. Loan History
4. Profile
5. Support
6. Settings
7. Logout

The top bar of the dashboard should have the following:

1. Logo
2. User profile image and Firstname
3. Notification icon
4. Support icon

Focusing on the dashboard, this screen should have the Loan Performance Summary
Customer dashboard must show the current loan card:
• Total loan amount
• Total amount paid
• Outstanding balance
• Next repayment date
• Loan status: (Active, Overdue, Completed, Closed)
The dashboard should have a recent payments list
The dashboard should have a entry card for applying for a new loan
The dashboard can have a card of information for the next due amount and the date for payment

On the outstanding balance view on the Dashboard view implement an hide and show for the balance display. Make it hidden by default

### Icon Library

Install the lucide icons library then

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
