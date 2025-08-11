# Marketing Solutions API

This module provides an API endpoint for processing marketing leads in the BBR (Branded Residences) system.

## API Endpoint

### POST /marketing-solutions/process-lead

Processes a marketing lead by checking/creating user and residence.

**Request Body:**
```json
{
  "name": "John Doe",
  "phoneNumber": "+1234567890",
  "email": "john.doe@example.com",
  "companyName": "Luxury Residences Inc.",
  "brandedResidenceName": "Marina Bay Luxury Residences",
  "companyWebsite": "https://www.yourcompany.com"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "fullName": "",
    "status": "INACTIVE",
    "emailVerified": false
  },
  "residence": {
    "id": "uuid",
    "name": "Company Name Residence",
    "slug": "company-name-residence",
    "status": "DRAFT",
    "developmentStatus": "IN_PLANNING"
  },
  "passwordResetEmailSent": true,
  "isNewUser": true,
  "isNewResidence": true
}
```

## Flow

1. **User Check & Creation:**
   - Accepts contact form data (name, phone, email, company, residence name)
   - Checks if a user with the given email exists
   - If user exists, proceeds
   - If user does not exist:
     - Creates a new company with the provided company information
     - Creates a new user with the provided information and no password
     - Assigns the 'buyer' role
     - Sends a "Set Your Password" email using the Forgot Password flow

2. **Residence Check & Creation:**
   - Checks if a residence already exists for this user's company
   - If it exists, proceeds
   - If not and user has a company, creates a new residence entry with:
     - Uses the provided branded residence name
     - Default country (US)
     - Default city (highest population city in US)
     - Default brand (first available brand)
     - Basic residence information

## Dependencies

- User Module: For user creation and management
- Auth Module: For password reset functionality
- Residence Module: For residence creation
- Role Module: For role assignment
- Email Module: For sending password reset emails

## Notes

- New users are created with `INACTIVE` status and no password
- Password reset emails are sent automatically for new users
- Residences are only created if the user has an associated company
- Default values are used for required residence fields (country, city, brand) 