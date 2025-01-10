Laravel Setup Guide
This is a Laravel project. Follow the steps below to get the application up and running locally.

Prerequisites
Before you begin, ensure you have the following installed on your machine:

PHP (>= 7.4)
Composer
MySQL or another supported database
Laravel (optional if you're setting it up)
Installation
1. Clone the Repository
   First, clone this repository to your local machine:

bash
Copy code
git clone <repository-url>
cd <project-directory>
2. Install Dependencies
   Use Composer to install the required PHP dependencies:

bash
Copy code
composer install
This will download and install all the required packages listed in the composer.json file.

3. Set Up the Environment File
   Copy the .env.example file to create your .env file:

bash
Copy code
cp .env.example .env
4. Generate the Application Key
   Generate a new application key, which is used for encryption and secure session management:

bash
Copy code
php artisan key:generate
This will set the APP_KEY in your .env file.

5. Run Migrations
   Next, run the migrations to set up the database schema:

bash
Copy code
php artisan migrate
This will create the necessary tables in your database.

6. Seed the Database
   You can seed the database with initial data. First, seed the roles:

bash
Copy code
php artisan db:seed --class=RoleSeeder
Then, seed the users:

bash
Copy code
php artisan db:seed --class=UserSeeder
7. Start the Development Server
   Finally, you can start the Laravel development server:

bash
Copy code
php artisan serve
The application will be accessible at http://localhost:8000.
