# BadCards - ASP.NET + React.js Cards Against Humanity Clone

BadCards is a web application that brings the hilariously irreverent and fun experience of Cards Against Humanity to the digital world. This project combines the power of ASP.NET on the server side with the dynamic and interactive features of React.js on the client side, providing a seamless and engaging user experience.

## Getting Started

To get started with BadCards, follow these steps:

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Puzonn/BadCards.git
   ```

2. Navigate to the project directory:

   ```bash
   cd BadCards
   ```

3. Install the necessary dependencies for both the server and client:

   ```bash
   cd BadCards.Api
   dotnet restore

   cd ../BadCards.Frontend
   npm install
   ```

4. Run the ASP.NET Core server:

   ```bash
   cd ../BadCards.Api
   dotnet run
   ```

   The ASP.NET Core server will be accessible at `https://localhost:5000`.

5. Run the React.js client:

   ```bash
   cd ../BadCards.Frontend
   npm start
   ```

   The React.js development server will be accessible at `http://localhost:3000`.

## Technologies Used

- **ASP.NET Core:** The server-side framework that handles backend logic and communication.
- **React.js:** A JavaScript library for building user interfaces, used for the dynamic frontend of BadCards.
- **SignalR:** Enables real-time communication between the server and clients, making the gameplay interactive and responsive.
- **Entity Framework Core:** An object-relational mapper (ORM) that simplifies database operations.
- **JWT Authentication:** Secure your application with JSON Web Token authentication.
- **Discord Authorization:** Allow users to log in using their Discord credentials.

## Features

- **Cards Against Humanity Gameplay:** Enjoy the classic Cards Against Humanity gameplay with friends or random opponents.
- **Real-Time Updates:** Thanks to SignalR, experience real-time updates as players make moves or submit their answers.

## License

This project is licensed under the CC-BY-NC-SA 2.0 License - see the [LICENSE](<[LICENSE](https://github.com/Puzonn/BadCards/blob/main/license)>) file for details.

## Acknowledgments

- [Cards Against Humanity](https://www.cardsagainsthumanity.com/): Inspiration for the concept and gameplay.

Have fun playing BadCards! 🃏
