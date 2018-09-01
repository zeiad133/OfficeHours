#Registration

**Parameters:**
@email,
@password,
@confirm password,
@username.

**Registration:** Email and password and confirm password and a username are required fields to complete the registration.

**Validations:** Before completing the registration, we must first check the validations found in utils to make sure none of the email, password or username breaks the validation.

**Password-Checking:** Check that the password if more than 8 characters, then check that the first typed password matches the confirm password.

**Email-Checking:** Check that there is not other user registered with this email in the database, if found registration won't complete and a message saying to try another email would show.

**Password-Hashing:** Once we pass Email-Checking, password hashing is a must, so the password is hashed, saved afterwards in the database and the registration is completed.

**Email-Sending:** Upon completing the registration, an email is sent to the users email that's the registration is completed and you can now login into your account.

**Return:**
@Json file contains the created user public info.

**Authors:**
Abdelrahman Rami,

Ziad Haredy













#Login

**Parameters:**
@email,
@password.

**Form-Checking:** Check that both fields for login (email and password) have been entered, and in the correct format.

**Validations:** Search for the entered email in the database to know if it exists, and if it does, check if the entered password matches the corresponding encrypted password in the database.

**Redirection:** The user data is compiled into a JSON file without the password and forwarded to the front-end, to be displayed to the user in his or her profile.

**Authors:**
Anas Mahmoud