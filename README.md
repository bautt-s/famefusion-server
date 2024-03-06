#  FameFusion -- API

This is the repository for the FameFusion API. Below, you will find all dependencies, instruction and information regarding the app.

  

##  Dependencies & installation

Backend is made on TypeScript. It uses Express, Apollo Server and GraphQL to mount a proper GraphQL structure. It stores and fetchs data from a Mongo database, managed by Prisma ORM. Other dependencies are Cloudinary, used for image management (mainly images & videos uploaded by users on their profiles), and Stripe to handle payments. Also, Kinde API is installed but not entirely implemented. It can be used to secure private routes, like each user profile edition.

To install them, simply run `npm install` inside the directory. To run the api, `npm start`.

  

##  Environment variables

There are 7 needed environment variables that need to be defined. They are;

1. *DATABASE_URL*: url of the Mongo database being used, needed to sync Prisma.
2. *KINDE_DOMAIN*: domain provided by Kinde.
3. *CLOUD_NAME*: this, as well as the other 2 variables below, are provided by Cloudinary.
4. *CLOUD_KEY*
5. *CLOUD_SECRET*
6. *FRONTEND_URL*: main home link of the frontend. in dev environment, should be localhost:3000.
7. *STRIPE_STORE*: url of the away Stripe store.

## Placeholder data
In the ./dumps directory, several JSONs containing sample data for collections can be found. They can be restored to the Mongo database using *mongoimport*.

##  State of the code
In this repository, we can find an index.ts file, which would be the main file. Here, we join GraphQL queries and mutations, and set up an Apollo Server instance to use with Express. 

Then, inside the /src folder, we can find three things:

 1. types.ts: used to define GraphQL types for models and inputs.
 2. cloudinary.ts: used to connect to Cloudinary db.
 3. ./src/resolvers directory, where queries and mutations are stored. they are divided into files, based on the model they are working on, and use mainly Prisma to query and mutate the database.
 
 Finally, in the ./prisma directory, we can find the Prisma schema that defines the database. 
