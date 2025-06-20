# Games Directory

This directory will contain individual game files for the Arcade website.

## How to Add a New Game

1. Create a new folder for your game (e.g., `snake/`, `tetris/`, etc.)
2. Create a main JavaScript file for your game (e.g., `snake.js`)
3. Add any assets your game needs in a subfolder
4. Update the gallery interface in `js/components/gallery-arcade.js` to include your new game

## Game Structure Example

```
games/
├── snake/
│   ├── snake.js
│   └── assets/
│       ├── food.png
│       └── snake-body.png
└── tetris/
    ├── tetris.js
    └── assets/
        └── block-colors.png
```

All games should be created using p5.js for consistency.
