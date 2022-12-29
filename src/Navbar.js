export default function Navbar() {
  return (
    <nav>
      <div className="container">
        <div className="wrapper">
          <a href="https://github.com/markcalendario/react-tictactoe">
            <h2>TicTacToe</h2>
            <p>&copy; Mark Kenneth Calendario {new Date().getFullYear()}</p>
          </a>
        </div>
      </div>
    </nav>
  )
}