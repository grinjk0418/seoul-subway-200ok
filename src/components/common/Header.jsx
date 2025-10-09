import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  function goBack() {
    navigate(-1);
  }

  return (
    <>
      <div className="header-container">
        <div className="header-back" onClick={goBack}>
          <img src="/back.png" alt="뒤로가기 이미지" />
        </div>
        <Link to = "/">
          <div className="header-home">
            <img src="/home.png" alt="홈 이미지" />
          </div>
        </Link>
      </div>
    </>
  )
}

export default Header;