# Deel tech assignment

## Introduction
The goal of this assignment is to create an autocomplete component that can be used in a web application. 
The component should be production ready or close to it.
For this project I created a small [mock server](https://github.com/rtyurin/mock-server) with some data to simulate a real world scenario.

It's available on this URL: https://mock-server-sepia.vercel.app/users

### Important
If, for some reason, the server is down, you can run it using local data by doing the following:
in the root of the project there is .env file with the following content:
```
VITE_API_URL=https://mock-server-sepia.vercel.app
```
Simply remove `VITE_API_URL` and the app will use the local data.

## How to run
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
