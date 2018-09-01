**mongoose:** A solution for making mongodb models.

**experienceSchema:** The schema for the experience of each job, contains a string for the job name and a numeric value for the required years of experience for said job.

**favExpertsSchema:** The schema for the favorite experts of each user, contains a string for the expert username.

**ratingSchema:** The schema for the ratings of the favorite experts, contains a numeric value for the rating.

**feedbackSchema:** The schema for expert feedback, contains a string for the feedback.

**notesSchema:** The schema for the user notes on each expert, contains a string for the note.

**scheduleSchema:** The schema for time slots that can be reserved for sessions, contains the date and time for the session and a string for its type.

**userSchema:** The schema for the website user, contains a string for the username and a string for the email (both unique), a string for the password, a string for the first name and a string for the last name. Also an array of favorite experts, and an array of notes on favorite experts. Finally contains a rating with a numeric value for the rating itself, a string for the rating type, and a string for the privacy value of the rating.