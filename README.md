# Bricks Battle Game

## Game preview
![game preview](https://github.com/atakowiec/atakowiec/blob/main/assets/bricks-battle/game.png)

## Description
This is a real-time pvp Breakout style game where players can play against each other, make own maps, customize profile and more.

### Why this project is my favorite?
This project is my favorite because it's the most complex project I've ever done.
I wanted to create some really challenging application and I think I did it.

Main challenges were:
- **Real-time communication** - I had to implement adequate structure of the backend so real-time communication would be possible.
- **Advanced physics** - Physics, collision detection and ball movement were the most challenging parts of the project. [(colisions and movement)](https://github.com/atakowiec/bricks-battle-game/blob/a9be1d962445880eee7144a9c7858fc2fab4b207/bricks-battle-server/src/game/components/ball.ts#L44)

## Features
- **Accounts**, but players can play without them
- **Rooms**, where players can join and play
- **Cosmetics**: paddle skins, ball skins, trails and icons
- **Adding and deleting gadgets** for admin accounts
- **Map creator** for creating your own maps
- **Map hub** with official, community and user created maps
- **Advanced in-game drops** (powerups and powerdowns) which can be applied to you or your opponent (depending on drop color)
- **Game settings** for enabling/disabling drops
- **Real-time view** of your opponent's board 
- **Advanced physics** (ball speed, paddle speed, ball angle, etc.)
- and more...

## Technologies

Both frontend and backend are written in TypeScript.

### Frontend
- **React** - for building user interfaces
- **Redux** - for managing application state
- **Socket.io** - for real-time communication
- **axios** - for making HTTP requests
- **sass** and **bootstrap** - for styling

### Backend
- **Node.js** - for running JavaScript on the server
- **NestJS** - for building scalable server-side applications
- **MongoDB** - for storing data
- **Socket.io** - for real-time communication
- **JWT** - for authentication
- **bcrypt** - for hashing passwords

## Future plans
- **Optimization** - by changing board render.
- **More gadgets and settings** - but no one will probably use them anyway.
