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
