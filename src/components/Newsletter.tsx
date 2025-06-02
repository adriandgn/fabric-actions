import { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY,
          'accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          listIds: [Number(import.meta.env.VITE_BREVO_LIST_ID)],
          updateEnabled: true
        }),
      });

      setIsSubmitting(false);

      if (response.ok) {
        setSuccessMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        const errorData = await response.json();
        console.error('Subscription error:', errorData);
        setErrorMessage(errorData.message || 'Error processing your subscription. Please try again.');
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error('Network error:', error);
      setErrorMessage('Connection error. Please try again later.');
    }
  };

  if (successMessage) {
    return (
      <div className="mt-8 md:mt-0">
        <h3 className="text-sm font-bold font-mono mb-4">THANKS FOR SUBSCRIBING</h3>
        <p className="text-xs font-mono">We'll keep you updated on our latest news and events.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-0">
      <h3 className="text-sm font-bold font-mono mb-4">STAY UPDATED</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="YOUR EMAIL"
            className="w-full bg-transparent border-b border-white text-white placeholder-gray-400 py-2 px-1 text-xs font-mono focus:outline-none focus:border-gray-400 transition-colors"
            required
            disabled={isSubmitting}
          />
          {errorMessage && <p className="text-xs text-red-400 mt-1">{errorMessage}</p>}
        </div>
        <button
          type="submit"
          className="text-xs font-mono border border-white hover:bg-white hover:text-black px-4 py-2 transition-colors disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'SENDING...' : 'SUBSCRIBE'}
        </button>
      </form>
    </div>
  );
};

export default Newsletter;
