import React, { useState, useEffect } from 'react';

const Login = ({ onLogin, error: externalError }) => {
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (externalError) {
            setError('Invalid PIN or connection failed');
            setIsLoading(false);
        }
    }, [externalError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        if (pin.trim().length !== 6) {
            setError('PIN must be exactly 6 digits');
            return;
        }

        setIsLoading(true);
        try {
            await onLogin(name, pin);
        } catch (err) {
            setError(err.message || 'Connection failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src="/favicon.ico" alt="Bee Logo" className="login-logo" style={{ width: '64px', height: '64px', marginBottom: '10px' }} />
                    <h1>Bee</h1>
                    <p>LAN File Sharing</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Display Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-bold"
                            maxLength={15}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="pin">Access PIN</label>
                        <input
                            id="pin"
                            type="password"
                            placeholder="6-digit PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="input-bold"
                            maxLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    <button type="submit" className="btn-bold btn-login" disabled={isLoading}>
                        {isLoading ? 'Connecting...' : 'Join Network'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
