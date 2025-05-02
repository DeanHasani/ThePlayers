import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import '../styles/main.css';
import bagIcon from '../assets/bag-icon.svg';
import heartIcon from '../assets/heart-icon.svg';
import heartFilledIcon from '../assets/heart-filled-icon.svg';
import profileIcon from '../assets/profile-icon.svg';
import searchIcon from '../assets/search-icon.svg';
import Footer from '../components/Footer';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', images: [null, null, null], category: 'clothing' });
  const [editProduct, setEditProduct] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [imageError, setImageError] = useState(''); // New state for image error
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProceedModal, setShowProceedModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showRemoveAllCartModal, setShowRemoveAllCartModal] = useState(false);
  const [showRemoveAllWishlistModal, setShowRemoveAllWishlistModal] = useState(false);
  const [showAddAllToCartModal, setShowAddAllToCartModal] = useState(false);
  const [cartCountKey, setCartCountKey] = useState(0);
  const [wishlistCountKey, setWishlistCountKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMenu, setShowMenu] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const itemsPerPage = 12;
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const fileInputRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
      setUserName(decoded.name);
    }

    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:3080/api/products');
        setProducts(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey && e.key === '/') || (e.key.toLowerCase() === 's' && e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
        searchInputRef.current?.focus();
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserRole(null);
    setUserName(null);
    setShowProfileMenu(false);
    navigate('/signin');
  };

  const toggleProfileMenu = (e) => {
    e.stopPropagation();
    setShowProfileMenu(prev => !prev);
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check for duplicates in newProduct.images
    const isDuplicate = newProduct.images.some(
      (existingFile, i) =>
        i !== index &&
        existingFile &&
        existingFile.name === file.name &&
        existingFile.size === file.size
    );

    if (isDuplicate) {
      setImageError('This photo is already selected. Please choose a different photo.');
      e.target.value = ''; // Reset input
      setTimeout(() => setImageError(''), 3000); // Clear error after 3s
      return;
    }

    const updatedImages = [...newProduct.images];
    updatedImages[index] = file;
    setNewProduct({ ...newProduct, images: updatedImages });

    const updatedPreviews = [...imagePreviews];
    if (file) {
      if (updatedPreviews[index]) {
        URL.revokeObjectURL(updatedPreviews[index]);
      }
      updatedPreviews[index] = URL.createObjectURL(file);
    } else {
      if (updatedPreviews[index]) {
        URL.revokeObjectURL(updatedPreviews[index]);
      }
      updatedPreviews[index] = null;
    }
    setImagePreviews(updatedPreviews);
  };

  const handleRemoveFile = (index) => {
    const updatedImages = [...newProduct.images];
    updatedImages[index] = null;
    setNewProduct({ ...newProduct, images: updatedImages });

    const updatedPreviews = [...imagePreviews];
    if (updatedPreviews[index]) {
      URL.revokeObjectURL(updatedPreviews[index]);
      updatedPreviews[index] = null;
    }
    setImagePreviews(updatedPreviews);

    // Reset the file input
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('description', newProduct.description);
    formData.append('price', newProduct.price);
    newProduct.images.forEach((image, index) => {
      if (image) {
        formData.append('images', image);
      }
    });
    formData.append('category', newProduct.category);

    try {
      const res = await axios.post('http://localhost:3080/api/products', formData, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });
      setProducts([...products, res.data]);
      setNewProduct({ name: '', description: '', price: '', images: [null, null, null], category: 'clothing' });
      setImagePreviews([null, null, null]);
      fileInputRefs.forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
      setShowSidebar(false);
      const totalProducts = products.length + 1;
      const totalPages = Math.ceil(totalProducts / itemsPerPage);
      setCurrentPage(totalPages);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3080/api/products/${editProduct._id}`, editProduct, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setProducts(products.map(p => (p._id === editProduct._id ? res.data : p)));
      setEditProduct(null);
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete(`http://localhost:3080/api/products/${productToDelete}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setProducts(products.filter(p => p._id !== productToDelete));
      setShowDeleteModal(false);
      setProductToDelete(null);
      const totalProducts = products.length - 1;
      const totalPages = Math.ceil(totalProducts / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      console.error('Error deleting product:', error.response?.data || error.message);
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const closePreview = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  const handleAddToCart = (product, fromWishlist = false) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    if (fromWishlist) {
      setWishlistItems(prevItems => prevItems.filter(item => item._id !== product._id));
      setAlertMessage('Added to cart and removed from wishlist');
      setWishlistCountKey(prev => prev + 1);
    } else {
      setAlertMessage('Added to cart successfully');
    }
    setTimeout(() => setAlertMessage(null), 2000);
    setCartCountKey(prev => prev + 1);
    closePreview();
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === productId);
      if (existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevItems.filter(item => item.product._id !== productId);
    });
    setAlertMessage('Removed from cart successfully');
    setTimeout(() => setAlertMessage(null), 2000);
    setCartCountKey(prev => prev + 1);
  };

  const handleToggleWishlist = (product) => {
    if (!product?._id) {
      console.error('Invalid product:', product);
      return;
    }
    setWishlistItems(prevItems => {
      const exists = prevItems.find(item => item._id === product._id);
      if (exists) {
        setAlertMessage('Removed from wishlist');
        setTimeout(() => setAlertMessage(null), 2000);
        return prevItems.filter(item => item._id !== product._id);
      }
      setAlertMessage('Added to wishlist');
      setTimeout(() => setAlertMessage(null), 2000);
      return [...prevItems, product];
    });
    setWishlistCountKey(prev => prev + 1);
  };

  const handleAddAllToCartClick = () => {
    setShowAddAllToCartModal(true);
  };

  const confirmAddAllToCart = () => {
    setCartItems(prevItems => {
      let updatedItems = [...prevItems];
      wishlistItems.forEach(item => {
        const existingItem = updatedItems.find(cartItem => cartItem.product._id === item._id);
        if (existingItem) {
          updatedItems = updatedItems.map(cartItem =>
            cartItem.product._id === item._id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          updatedItems.push({ product: item, quantity: 1 });
        }
      });
      return updatedItems;
    });
    setWishlistItems([]);
    setAlertMessage('All items added to cart');
    setTimeout(() => setAlertMessage(null), 2000);
    setShowAddAllToCartModal(false);
    setCartCountKey(prev => prev + 1);
    setWishlistCountKey(prev => prev + 1);
  };

  const cancelAddAllToCart = () => {
    setShowAddAllToCartModal(false);
  };

  const handleRemoveAllFromWishlistClick = () => {
    setShowRemoveAllWishlistModal(true);
  };

  const confirmRemoveAllFromWishlist = () => {
    setWishlistItems([]);
    setAlertMessage('All items removed from wishlist');
    setTimeout(() => setAlertMessage(null), 2000);
    setShowRemoveAllWishlistModal(false);
    setWishlistCountKey(prev => prev + 1);
  };

  const cancelRemoveAllFromWishlist = () => {
    setShowRemoveAllWishlistModal(false);
  };

  const handleRemoveAllFromCartClick = () => {
    setShowRemoveAllCartModal(true);
  };

  const confirmRemoveAllFromCart = () => {
    setCartItems([]);
    setAlertMessage('All items removed from cart');
    setTimeout(() => setAlertMessage(null), 2000);
    setShowRemoveAllCartModal(false);
    setCartCountKey(prev => prev + 1);
  };

  const cancelRemoveAllFromCart = () => {
    setShowRemoveAllCartModal(false);
  };

  const handleProceedClick = () => {
    if (!userName) {
      setShowSignInModal(true);
    } else {
      setShowProceedModal(true);
    }
  };

  const confirmProceed = () => {
    console.log('Proceeding to checkout...');
    setShowCartModal(false);
    setShowProceedModal(false);
  };

  const cancelProceed = () => {
    setShowProceedModal(false);
  };

  const handleSignInClick = () => {
    setShowSignInModal(false);
    setShowProfileMenu(false);
    navigate('/signin');
  };

  const handleRegisterClick = () => {
    setShowSignInModal(false);
    setShowProfileMenu(false);
    navigate('/register');
  };

  const openCartModal = () => {
    setShowCartModal(true);
  };

  const openWishlistModal = () => {
    setShowWishlistModal(true);
  };

  const closeCartModal = () => {
    setShowCartModal(false);
    setShowProceedModal(false);
    setShowRemoveAllCartModal(false);
    setShowSignInModal(false);
  };

  const closeWishlistModal = () => {
    setShowWishlistModal(false);
    setShowRemoveAllWishlistModal(false);
    setShowAddAllToCartModal(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter]);

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWishlistItems = wishlistItems.length;

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className="shop-container">
        <div className="top-bar">
          <Navbar
            isShopPage={true}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchOpen={isSearchOpen}
            toggleSearch={toggleSearch}
            searchInputRef={searchInputRef}
            cartItems={cartItems}
            openCartModal={openCartModal}
            showCartModal={showCartModal}
            cartCountKey={cartCountKey}
            wishlistItems={wishlistItems}
            openWishlistModal={openWishlistModal}
            showWishlistModal={showWishlistModal}
            wishlistCountKey={wishlistCountKey}
            userName={userName}
            showProfileMenu={showProfileMenu}
            toggleProfileMenu={toggleProfileMenu}
            profileMenuRef={profileMenuRef}
            handleSignInClick={handleSignInClick}
            handleRegisterClick={handleRegisterClick}
            handleLogout={handleLogout}
            showMenu={showMenu}
            setShowMenu={setShowMenu}
          />
        </div>
        {alertMessage && (
          <div className="cart-alert">
            {alertMessage}
          </div>
        )}

        {userRole === 'admin' && (
          <div className={`add-product-sidebar ${showSidebar ? 'show' : ''}`}>
            <button className="sidebar-toggle" onClick={() => setShowSidebar(!showSidebar)}>
              {showSidebar ? '−' : '+'}
            </button>
            <form
              onSubmit={handleAddProduct}
              className="add-product-form"
              style={{
                maxHeight: '80vh',
                maxWidth: '100%',
                overflowY: 'auto',
                overflowX: 'auto',
                paddingBottom: '20px',
                minWidth: '0',
              }}
            >
              <h2>New Product</h2>
              <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" required />
              <input type="text" name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" />
              <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} placeholder="Price" required />
              
              <div className="image-input-group">
                <label htmlFor="main-image" style={{ color: 'grey', fontSize: '0.8em', marginTop: '5px' }}>
                  Main Image (Required)
                </label>
                <input
                  id="main-image"
                  type="file"
                  name="main-image"
                  onChange={(e) => handleFileChange(e, 0)}
                  accept="image/*"
                  required
                  ref={fileInputRefs[0]}
                />
                {imagePreviews[0] && (
                  <>
                    <div className="image-previews">
                      <img src={imagePreviews[0]} alt="Main Image Preview" className="image-preview" />
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(0)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>

              <div className="image-input-group">
                <label htmlFor="second-image" style={{ color: 'grey', fontSize: '0.8em', marginTop: '5px' }}>
                  Second Image (Optional)
                </label>
                <input
                  id="second-image"
                  type="file"
                  name="second-image"
                  onChange={(e) => handleFileChange(e, 1)}
                  accept="image/*"
                  ref={fileInputRefs[1]}
                />
                {imagePreviews[1] && (
                  <>
                    <div className="image-previews">
                      <img src={imagePreviews[1]} alt="Second Image Preview" className="image-preview" />
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(1)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>

              <div className="image-input-group">
                <label htmlFor="third-image" style={{ color: 'grey', fontSize: '0.8em', marginTop: '5px' }}>
                  Third Image (Optional)
                </label>
                <input
                  id="third-image"
                  type="file"
                  name="third-image"
                  onChange={(e) => handleFileChange(e, 2)}
                  accept="image/*"
                  ref={fileInputRefs[2]}
                />
                {imagePreviews[2] && (
                  <>
                    <div className="image-previews">
                      <img src={imagePreviews[2]} alt="Third Image Preview" className="image-preview" />
                    </div>
                    <button
                      type="button"
                      className="remove-file-btn"
                      onClick={() => handleRemoveFile(2)}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>

              {imageError && <p className="error">{imageError}</p>}

              <select name="category" value={newProduct.category} onChange={handleInputChange}>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
              </select>
              <button type="submit" className="submit-button">Add</button>
            </form>
          </div>
        )}

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this product?</p>
              <div className="modal-buttons">
                <button onClick={confirmDelete} className="modal-yes">Yes</button>
                <button onClick={cancelDelete} className="modal-no">No</button>
              </div>
            </div>
          </div>
        )}

        {selectedProduct && (
          <div className="preview-overlay" onClick={closePreview}>
            <div className="product-preview" onClick={(e) => e.stopPropagation()}>
              <div className="preview-wishlist">
                <img
                  src={wishlistItems.find(item => item._id === selectedProduct._id) ? heartFilledIcon : heartIcon}
                  alt="Wishlist"
                  className="wishlist-icon"
                  onClick={(e) => { e.stopPropagation(); handleToggleWishlist(selectedProduct); }}
                />
              </div>
              <div className="gallery-container">
                <img
                  src={`http://localhost:3080${selectedProduct.images[currentImageIndex]}`}
                  alt={selectedProduct.name}
                  className="preview-image"
                />
                {selectedProduct.images.length > 1 && (
                  <>
                    <button className="gallery-nav prev" onClick={handlePrevImage}>←</button>
                    <button className="gallery-nav next" onClick={handleNextImage}>→</button>
                  </>
                )}
              </div>
              <div className="preview-info">
                <h2>{selectedProduct.name}</h2>
                {selectedProduct.images.length > 1 && (
                  <div className="gallery-thumbnails">
                    {selectedProduct.images.map((img, index) => (
                      <img
                        key={index}
                        src={`http://localhost:3080${img}`}
                        alt={`Thumbnail ${index + 1}`}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => handleThumbnailClick(index)}
                      />
                    ))}
                  </div>
                )}
                <p>{selectedProduct.description || 'No description available'}</p>
                <p className="preview-price">${selectedProduct.price}</p>
                <div className="preview-buttons">
                  {userRole === 'admin' ? (
                    <>
                      <button onClick={() => setEditProduct(selectedProduct)}>Edit</button>
                      <button onClick={() => handleDeleteClick(selectedProduct._id)}>Delete</button>
                    </>
                  ) : (
                    <button className="add-to-cart-btn" onClick={() => handleAddToCart(selectedProduct)}>Add to Cart</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {showCartModal && (
          <div className="modal-overlay" onClick={closeCartModal}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tab-view">
                <div className="tab active">Your Cart</div>
              </div>
              <div className="tab-content">
                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <div className="cart-items">
                    {cartItems.map(item => (
                      <div key={item.product._id} className="cart-product-card">
                        <img src={`http://localhost:3080${item.product.images[0]}`} alt={item.product.name} className="cart-product-image" />
                        <div className="cart-product-info">
                          <h4>{item.product.name}</h4>
                          <p>${item.product.price} x {item.quantity}</p>
                          {item.quantity > 1 && (
                            <p>Total: ${(item.product.price * item.quantity).toFixed(2)}</p>
                          )}
                          <button
                            className={item.quantity > 1 ? 'remove-one-btn' : ''}
                            onClick={() => handleRemoveFromCart(item.product._id)}
                          >
                            {item.quantity === 1 ? 'Remove' : 'Remove One'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {cartItems.length > 0 && (
                  <div className="cart-modal-buttons">
                    <button onClick={handleProceedClick} className="proceed-button">Proceed</button>
                    <button onClick={handleRemoveAllFromCartClick} className="remove-all-button">Remove All</button>
                  </div>
                )}
              </div>
              {showProceedModal && (
                <div className="modal-overlay dialog-overlay">
                  <div className="delete-modal">
                    <h3>Confirm Proceed</h3>
                    <p>Are you sure you want to proceed?</p>
                    <div className="modal-buttons">
                      <button onClick={confirmProceed} className="modal-yes">Yes</button>
                      <button onClick={cancelProceed} className="modal-no">No</button>
                    </div>
                  </div>
                </div>
              )}
              {showSignInModal && (
                <div className="modal-overlay dialog-overlay" onClick={closeCartModal}>
                  <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                    <h3>Sign In Required</h3>
                    <p>You need to sign in or register to proceed.</p>
                    <div className="modal-buttons">
                      <button onClick={handleSignInClick} className="modal-signin">Sign In</button>
                      <button onClick={handleRegisterClick} className="modal-register">Register</button>
                    </div>
                  </div>
                </div>
              )}
              {showRemoveAllCartModal && (
                <div className="modal-overlay dialog-overlay">
                  <div className="delete-modal">
                    <h3>Confirm Removal</h3>
                    <p>Are you sure you want to remove all?</p>
                    <div className="modal-buttons">
                      <button onClick={confirmRemoveAllFromCart} className="modal-yes">Yes</button>
                      <button onClick={cancelRemoveAllFromCart} className="modal-no">No</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showWishlistModal && (
          <div className="modal-overlay" onClick={closeWishlistModal}>
            <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
              <div className="tab-view">
                <div className="tab active">Your Wishlist</div>
              </div>
              <div className="tab-content">
                {wishlistItems.length === 0 ? (
                  <p>Your wishlist is empty.</p>
                ) : (
                  <div className="cart-items">
                    {wishlistItems.map(item => (
                      <div key={item._id} className="cart-product-card">
                        <img src={`http://localhost:3080${item.images[0]}`} alt={item.name} className="cart-product-image" />
                        <div className="cart-product-info">
                          <h4>{item.name}</h4>
                          <p>${item.price}</p>
                          <div className="wishlist-buttons">
                            <button
                              className="add-to-cart-btn"
                              onClick={() => handleAddToCart(item, true)}
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => handleToggleWishlist(item)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {wishlistItems.length > 0 && (
                  <div className="cart-modal-buttons">
                    <button onClick={handleAddAllToCartClick} className="proceed-button">Add All to Cart</button>
                    <button onClick={handleRemoveAllFromWishlistClick} className="remove-all-button">Remove All</button>
                  </div>
                )}
              </div>
              {showRemoveAllWishlistModal && (
                <div className="modal-overlay dialog-overlay">
                  <div className="delete-modal">
                    <h3>Confirm Removal</h3>
                    <p>Are you sure you want to remove all?</p>
                    <div className="modal-buttons">
                      <button onClick={confirmRemoveAllFromWishlist} className="modal-yes">Yes</button>
                      <button onClick={cancelRemoveAllFromWishlist} className="modal-no">No</button>
                    </div>
                  </div>
                </div>
              )}
              {showAddAllToCartModal && (
                <div className="modal-overlay dialog-overlay">
                  <div className="delete-modal">
                    <h3>Confirm Action</h3>
                    <p>Add all to cart?</p>
                    <div className="modal-buttons">
                      <button onClick={confirmAddAllToCart} className="modal-yes">Yes</button>
                      <button onClick={cancelAddAllToCart} className="modal-no">No</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {editProduct && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <h3>Edit Product</h3>
              <form onSubmit={handleEditProduct} className="edit-product-form">
                <input
                  type="text"
                  name="name"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  name="description"
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  placeholder="Description"
                />
                <input
                  type="number"
                  name="price"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                  placeholder="Price"
                  required
                />
                <select
                  name="category"
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                >
                  <option value="clothing">Clothing</option>
                  <option value="accessories">Accessories</option>
                </select>
                <div className="modal-buttons">
                  <button type="submit" className="modal-yes">Save</button>
                  <button
                    type="button"
                    className="modal-no"
                    onClick={() => setEditProduct(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="shop-layout">
          <aside className="filter-sidebar">
            <h3>Categories</h3>
            <ul>
              <li onClick={() => { setCategoryFilter('all'); setCurrentPage(1); }} className={categoryFilter === 'all' ? 'active' : ''}>
                All ({products.length})
              </li>
              <li onClick={() => { setCategoryFilter('clothing'); setCurrentPage(1); }} className={categoryFilter === 'clothing' ? 'active' : ''}>
                Clothing ({products.filter(p => p.category === 'clothing').length})
              </li>
              <li onClick={() => { setCategoryFilter('accessories'); setCurrentPage(1); }} className={categoryFilter === 'accessories' ? 'active' : ''}>
                Accessories ({products.filter(p => p.category === 'accessories').length})
              </li>
            </ul>
          </aside>

          <main className="product-grid">
            {loading ? (
              <p>Loading products...</p>
            ) : paginatedProducts.length === 0 ? (
              <p>No products available in this category.</p>
            ) : (
              paginatedProducts.map(product => (
                <div key={product._id} className="product-card" onClick={() => handleProductClick(product)}>
                  <div className={`wishlist-icon-container ${wishlistItems.find(item => item._id === product._id) ? 'wishlisted' : ''}`}>
                    <img
                      src={wishlistItems.find(item => item._id === product._id) ? heartFilledIcon : heartIcon}
                      alt="Wishlist"
                      className="wishlist-icon"
                      onClick={(e) => { e.stopPropagation(); handleToggleWishlist(product); }}
                    />
                  </div>
                  <img src={`http://localhost:3080${product.images[0]}`} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p>${product.price}</p>
                    {userRole === 'admin' ? (
                      <>
                        <button onClick={(e) => { e.stopPropagation(); setEditProduct(product); }}>Edit</button>
                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(product._id); }}>Delete</button>
                      </>
                    ) : (
                      <button
                        className="add-to-cart-btn"
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            <div className="pagination">
              <button
                className="pagination-button prev-next"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                <button
                  key={page}
                  className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageClick(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="pagination-button prev-next"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;