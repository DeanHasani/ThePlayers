import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import bagIcon from '../assets/bag-icon.svg';
import heartIcon from '../assets/heart-icon.svg';
import profileIcon from '../assets/profile-icon.svg';
import searchIcon from '../assets/search-icon.svg';

const Navbar = ({
  isShopPage = false,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  toggleSearch,
  searchInputRef,
  cartItems,
  openCartModal,
  showCartModal,
  cartCountKey,
  wishlistItems,
  openWishlistModal,
  showWishlistModal,
  wishlistCountKey,
  userName,
  showProfileMenu,
  toggleProfileMenu,
  profileMenuRef,
  handleSignInClick,
  handleRegisterClick,
  handleLogout,
  showMenu,
  setShowMenu
}) => {
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlistItems.length;
  const menuRef = useRef(null);

  // Close menu and search bar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        toggleSearch(); // Assuming toggleSearch sets isSearchOpen to false when open
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowMenu, toggleSearch, searchInputRef]);

  return (
    <nav className={`navbar ${isShopPage ? 'shop-navbar' : ''}`}>
      <div className="nav-content">
        <div className="menu-container" ref={menuRef}>
          <button className="menu-toggle" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? '−' : '☰'}
          </button>
          {showMenu && (
            <div className="menu-content">
              <ul>
                <li><Link to="/discover">Discover</Link></li>
                <li><Link to="/support">Support</Link></li>
                <li><a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
                <li><Link to="/home">Go Back</Link></li>
              </ul>
            </div>
          )}
        </div>
        <div className="auth-status">
          <div className={`search-item ${isSearchOpen ? 'open' : ''}`}>
            {isSearchOpen ? (
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                ref={searchInputRef}
                autoFocus
              />
            ) : (
              <img src={searchIcon} alt="Search" className="search-icon" onClick={toggleSearch} />
            )}
          </div>
          <div className={`cart-item ${showCartModal ? 'modal-open' : ''}`} onClick={openCartModal}>
            <div className="cart-icon-wrapper">
              <img src={bagIcon} alt="Bag" className="bag-icon" />
              {totalCartItems > 0 && (
                <span className="cart-count" key={cartCountKey}>
                  {totalCartItems}
                </span>
              )}
            </div>
          </div>
          <div className={`wishlist-item ${showWishlistModal ? 'modal-open' : ''}`} onClick={openWishlistModal}>
            <div className="wishlist-icon-wrapper">
              <img src={heartIcon} alt="Wishlist" className="wishlist-icon-top" />
              {totalWishlistItems > 0 && (
                <span className="wishlist-count" key={wishlistCountKey}>
                  {totalWishlistItems}
                </span>
              )}
            </div>
          </div>
          <div
            className={`profile-item ${showProfileMenu ? 'active' : ''}`}
            data-tooltip={userName ? "Logout" : "Sign In"}
            ref={profileMenuRef}
          >
            <img
              src={profileIcon}
              alt="Profile"
              className="profile-icon"
              onClick={toggleProfileMenu}
            />
            {showProfileMenu && (
              <div className="profile-menu">
                {userName ? (
                  <>
                    <p>{userName}</p>
                    <button onClick={handleLogout} className="profile-logout">Logout</button>
                  </>
                ) : (
                  <>
                    <button onClick={handleSignInClick} className="profile-logout">Sign In</button>
                    <button onClick={handleRegisterClick} className="profile-logout">Register</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;