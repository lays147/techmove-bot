# Tech Move Bot

This is a Telegram Bot that scores points for physical exercises.

# Business Rules & TODO

-   [x] Member get 1 points if register at least 30 minutes of exercises in the day
-   [x] If all members in a team register a exercise in the day, the team wins 1 point, this goes progressively
-   [x] If one member register exercises for 6 consecutives days, it wins an extra point
-   [x] If a member does not register exercises for 7 consecutives days, it losses points progressively (7/14/21/28)
-   [x] If none of the team members registers an exercise in the day, the team looses 1 point
-   [ ] Review naming of variables and functions to keep consistency
-   [ ] Write unit tests where is possible
-   [ ] Discover a way to mock Firestore - hint: Discover how to mock Injected dependencies and firestore specifics

# Dependencies

-   NodeJS > 19.8.1
-   Typescript & NestjS
-   [Google Firestore](https://firebase.google.com/docs/firestore/quickstart)

# How to configure

-   Go to Telegram [BotFather](https://t.me/BotFather) and create a new bot, save the bot token for lather.
-   Go to Google Firestore Console and create a new project.
-   Export and save the access credentials to firestore in your project.
-   Copy the file `.env.model` to your `.env`.
-   Fill the `TELEGRAM_BOT_TOKEN` with the token provided by BotFather.
-   Fill the `FIREBASE_KEY_PATH` with the path of your firestore credentials.
