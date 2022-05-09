# petblog
# Pledge: I pledge my honor that I have abided by the Stevens Honor System
# Contributors: Joseph Scalera, Cassidy Savettiere, Shreyas Keerthi, Nicole Romero


.env configuration example:
```
MONGO_URI=mongodb+srv://username:password@domain.net
```

Install:
`npm instal`

Seed:
`npm run seed`

Deploy:
`npm start`

Github:
`https://github.com/CS546PetBlog/petblog`


We used the following libraries:
- bcryptjs for password hashing and constant time string comparisons
- crypto for generating random passwords for the sessions
- dotenv for loading the database URI
- express-handlebars for the frontend
- express-session for handeling the login sessions
- fs for writing the images uploaded to the local filesystem
- multer for processing file uploads over http
- path for properly joining the current working directory with a specific path
- uuid for generating a random identifier for the uploaded images.