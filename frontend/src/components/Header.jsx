// frontend/src/components/Header.jsx

// Header is a simple functional component — it takes no props
// and just renders static branding content

function Header() {
  return (
    <header className="app-header">
      <h1 className="app-title">📝TASK MANAGMENT SYSTEM</h1>
      {/* <p className="app-subtitle">Stay organized, one task at a time</p> */}
    </header>
  );
}

export default Header;