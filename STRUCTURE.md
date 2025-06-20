# Arcade Website Structure

This file provides an overview of the project structure and file organization.

## Pages

- `index.html`: Home page with welcome message and animated background
- `gallery.html`: Game selection interface with interactive arcade machines
- `about.html`: Information about the project and creator

## Assets

- CSS files are located in the `css/` directory
- JavaScript files are located in the `js/` directory
- UI components are in `js/components/`
- Game files should be placed in the `games/` directory
- Images and other assets should be placed in the `img/` directory

## Adding Content

### Adding a New Game

1. Create a new directory in `games/` for your game
2. Add your game files and assets
3. Update the gallery interface in `js/components/gallery-arcade.js`

### Adding a New Page

1. Create a new HTML file in the root directory
2. Link to CSS files in `css/`
3. Link to JavaScript files in `js/`
4. Add navigation menu with links to all pages
5. Update all other pages to include a link to your new page

## Technologies Used

- HTML5
- CSS3
- JavaScript
- p5.js for animation and game development
