# Sandbox Showcase

## Project Overview

The Sandbox Showcase is a development environment hub designed to display and launch various mini-applications or projects within a single interface. It dynamically lists projects found in the `/apps` directory, renders their individual README files, and provides a convenient way to launch them.

This project serves as a central point for developers to organize, showcase, and access multiple small applications or experiments.

### Core Features:

*   **Project Grid:** Displays a grid of project icons sourced from the `/apps` directory.
*   **README Renderer:** Renders README.md files with enhanced styling.
*   **App Launcher:** Enables launching of individual apps in a new terminal with configurable ports.

## Technologies Used

*   **Next.js:** React framework for building the web application.
*   **React:** JavaScript library for building user interfaces.
*   **TypeScript:** Typed superset of JavaScript that compiles to plain JavaScript.
*   **Tailwind CSS:** A utility-first CSS framework for styling.

## Setup and Run

To get the project up and running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [YOUR REPO URL]
    cd sandbox-showcase
    ```
    _(Replace `[YOUR REPO URL]` with the actual GitHub repository URL.)_

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  Open your browser and visit `http://localhost:3000` (or the port indicated in your terminal).

## Project Structure

*   `/apps`: Contains individual mini-applications to be showcased.
*   `/src`: Contains the source code for the Sandbox Showcase application.
    *   `/src/app`: Next.js application routes.
    *   `/src/components`: Reusable React components.
    *   `/src/data`: Data sources, including the mock project list.
    *   `/src/lib`: Utility functions.
    *   `/src/types`: TypeScript type definitions.

## Adding Your Own Projects

To add a project to the showcase, create a new folder inside the `/apps` directory with your project files. Ensure your project includes:

1.  A `README.md` file describing your project.
2.  An `icon.png` file (or other image format) to be used as the project icon.
3.  (Optional) A `package.json` with a `start` script if it's a web project you want to launch via `npm start`.

Update the `src/data/mock-projects.ts` file to include an entry for your new project, referencing the path to its `README.md` and icon file, and specifying the `launchCommand` and `port` if applicable.

## Contributing

(Add contributing guidelines here if applicable.)

## License

(Add license information here.)
