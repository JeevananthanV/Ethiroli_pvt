import React from 'react';

const Comming_Soon = () => {
  // Inject CSS dynamically
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Alice&family=Montserrat:wght@400;500;600;700&display=swap');

      .coming-soon-section {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: clamp(2rem, 5vw, 4rem);
        padding: clamp(2rem, 5vw, 4rem) 5%;
        background: #F1ECE6;
        flex-wrap: wrap;
      }

      .coming-soon-content {
        flex: 1;
        min-width: 280px;
        max-width: 600px;
      }

      .coming-soon-title {
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 700;
        color: #1A4B48;
        margin-bottom: 1rem;
        line-height: 1.2;
      }

      .coming-soon-title span {
        display: block;
        font-weight: 400;
        font-size: clamp(1.2rem, 3vw, 1.8rem);
        color: #819E35;
        letter-spacing: 2px;
        margin-bottom: 0.5rem;
      }

      .coming-soon-subtitle {
        font-family: 'Montserrat', sans-serif;
        font-size: clamp(0.9rem, 2vw, 1.1rem);
        color: #555555;
        margin-bottom: 2rem;
        line-height: 1.6;
      }

      .coming-soon-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
      }

      .coming-soon-input {
        font-family: 'Montserrat', sans-serif;
        font-size: 1rem;
        padding: 0.85rem 1.2rem;
        border: 1px solid rgba(67, 67, 67, 0.15);
        background: #FFFFFF;
        color: #2D2D2D;
        outline: none;
        transition: all 0.3s ease;
        width: 100%;
        border-radius: 0;
      }

      .coming-soon-input:focus {
        border-color: #819E35;
        box-shadow: 0 0 0 2px rgba(129, 158, 53, 0.1);
      }

      .btn {
        cursor: pointer;
        position: relative;
        padding: 10px 20px;
        background: white;
        font-size: 28px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        transition: all 1s;
        font-family: 'Montserrat', sans-serif;
        font-weight: 500;
        border: none;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .btn:after, .btn:before {
        content: " ";
        width: 10px;
        height: 10px;
        position: absolute;
        border: 0px solid #fff;
        transition: all 1s;
      }

      .btn:after {
        top: -1px;
        left: -1px;
        border-top: 5px solid black;
        border-left: 5px solid black;
      }

      .btn:before {
        bottom: -1px;
        right: -1px;
        border-bottom: 5px solid black;
        border-right: 5px solid black;
      }

      .btn:hover {
        border-top-right-radius: 0px;
        border-bottom-left-radius: 0px;
      }

      .btn:hover:before, .btn:hover:after {
        width: 100%;
        height: 100%;
      }

      .coming-soon-btn {
        width: 100%;
        justify-content: center;
        background: #1A4B48;
        color: white;
        font-size: 1rem;
        padding: 0.85rem 1.5rem;
      }

      .coming-soon-btn:after,
      .coming-soon-btn:before {
        border-color: #819E35;
      }

      .coming-soon-btn:hover {
        background: #819E35;
        color: white;
      }

      .btn-icon {
        display: inline-flex;
        transition: transform 0.3s ease;
        font-size: 1.2rem;
      }

      .coming-soon-btn:hover .btn-icon {
        transform: translateX(5px);
      }

      .coming-soon-image {
        flex: 1;
        min-width: 280px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .coming-soon-image img {
        max-width: 100%;
        height: auto;
        display: block;
        border-radius: 20px;
      }

      @media (max-width: 768px) {
        .coming-soon-section {
          flex-direction: column;
          text-align: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }
        .coming-soon-content {
          text-align: center;
        }
        .coming-soon-form {
          align-items: center;
        }
        .coming-soon-input {
          text-align: center;
        }
        .coming-soon-btn {
          justify-content: center;
        }
        .coming-soon-title span {
          font-size: 1rem;
        }
      }

      @media (max-width: 480px) {
        .coming-soon-section {
          padding: 2rem 1rem;
        }
        .coming-soon-title {
          font-size: 2rem;
        }
        .btn {
          font-size: 1rem;
          padding: 10px 16px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="coming-soon-section">
      <div className="coming-soon-content">
        <h1 className="coming-soon-title">
          <span>We're</span> Coming Soon
        </h1>
        <p className="coming-soon-subtitle">We are coming soon</p>
        <form className="coming-soon-form" action="">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="coming-soon-input"
          />
          <button type="submit" className="btn coming-soon-btn">
            Notify Me 
            <span className="btn-icon">→</span>
          </button>
        </form>
      </div>
      <div className="coming-soon-image">
        <img src="/ethiroli-react/frontend/public/assets/images/img/intro.png" alt="Coming Soon Illustration" />
      </div>
    </section>
  );
};

export default Comming_Soon;