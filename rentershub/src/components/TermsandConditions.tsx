"use client"
import React from 'react';

const TermsAndConditions = () => {
  const terms = [
    "This is an agreement between you and Renters Hub.",
    "Renters Hub will connect you with the most suitable tenants.",
    "Renters Hub charges commission for every tenant you get from our network. For a bedsitter, Ksh 500, a 1 bedroom, Ksh 1000, a 2 bedrooms and offices, Ksh 2000, and more than 2 bedrooms, Ksh 5000.",
    "Renters Hub does not accept any other mode of payment than MPESA to the Pay Bill number 4078389, Account=COMMISSION.",
    "Renters Hub expects you to give accurate information to the house hunters all the time. Give a lot of information while posting so that you're called only by ready-to-rent tenants, not window shoppers.",
    "While posting houses on our website, upload at least 7 photos covering as many details of the house as possible.",
    "Renters Hub does not share your personal information you have provided with anyone else. We use the information to verify that you are indeed a genuine property owner/manager.",
    "If your house gets a tenant, mark it as occupied so that you are not bombarded with unnecessary calls from house hunters.",
    "If you are reported and verified as a scammer, you will be deregistered and exposed to Kenyans as someone they should avoid and prosecute.",
    "You must conduct yourself with the highest level of professionalism possible by giving accurate information to your tenants and doing what you promise them.",
    "Paying the agreed commission is mandatory. If you fail to pay even after we have delivered good tenants, you will be banned from using Renters Hub services.",
    "For initial communication with Renters Hub, use 0731352350 or 0723888474. You can also write to us on hello@rentershub.co.ke."
  ];

  return (
    <div className="p-6 bg-gray-50 text-gray-700 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-green-600 mb-6">Terms and Conditions</h1>
      <ul className="list-decimal pl-5 space-y-4">
        {terms.map((term, index) => (
          <li key={index} className="leading-relaxed">
            {term}
          </li>
        ))}
      </ul>
      <div className="text-center mt-6">
        <button
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={() => alert('You have accepted the Terms and Conditions.')}
        >
          Accept Terms
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
