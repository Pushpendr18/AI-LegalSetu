import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ContractGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({});
  const [generatedContract, setGeneratedContract] = useState('');
  const [loading, setLoading] = useState(false);

  const contractTemplates = [
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      icon: '🔒',
      description: 'Protect your confidential information and trade secrets',
      color: 'blue',
      fields: [
        { name: 'party1_name', label: 'Disclosing Party Name', type: 'text', required: true, placeholder: 'Company/Individual name' },
        { name: 'party1_address', label: 'Disclosing Party Address', type: 'text', required: true, placeholder: 'Full address' },
        { name: 'party2_name', label: 'Receiving Party Name', type: 'text', required: true, placeholder: 'Company/Individual name' },
        { name: 'party2_address', label: 'Receiving Party Address', type: 'text', required: true, placeholder: 'Full address' },
        { name: 'confidential_info', label: 'Confidential Information', type: 'textarea', required: true, placeholder: 'Describe what information is confidential' },
        { name: 'duration', label: 'Agreement Duration (years)', type: 'number', required: true, placeholder: '2' }
      ]
    },
    {
      id: 'rental_agreement',
      name: 'Rental Agreement', 
      icon: '🏠',
      description: 'Create residential or commercial rental agreements',
      color: 'green',
      fields: [
        { name: 'landlord_name', label: 'Landlord Name', type: 'text', required: true, placeholder: 'Full name of landlord' },
        { name: 'landlord_address', label: 'Landlord Address', type: 'text', required: true, placeholder: 'Landlord contact address' },
        { name: 'tenant_name', label: 'Tenant Name', type: 'text', required: true, placeholder: 'Full name of tenant' },
        { name: 'tenant_address', label: 'Tenant Address', type: 'text', required: true, placeholder: 'Tenant permanent address' },
        { name: 'property_address', label: 'Property Address', type: 'text', required: true, placeholder: 'Rental property address' },
        { name: 'rent_amount', label: 'Monthly Rent (₹)', type: 'number', required: true, placeholder: '15000' },
        { name: 'security_deposit', label: 'Security Deposit (₹)', type: 'number', required: true, placeholder: '30000' },
        { name: 'lease_months', label: 'Lease Term (months)', type: 'number', required: true, placeholder: '11' },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true }
      ]
    },
    {
      id: 'service_agreement',
      name: 'Service Agreement',
      icon: '💼',
      description: 'Agreement between service provider and client',
      color: 'purple',
      fields: [
        { name: 'provider_name', label: 'Service Provider Name', type: 'text', required: true, placeholder: 'Company/Individual name' },
        { name: 'provider_address', label: 'Provider Address', type: 'text', required: true, placeholder: 'Business address' },
        { name: 'client_name', label: 'Client Name', type: 'text', required: true, placeholder: 'Company/Individual name' },
        { name: 'client_address', label: 'Client Address', type: 'text', required: true, placeholder: 'Client address' },
        { name: 'services_description', label: 'Services Description', type: 'textarea', required: true, placeholder: 'Detailed description of services to be provided' },
        { name: 'service_fee', label: 'Service Fee (₹)', type: 'number', required: true, placeholder: '50000' },
        { name: 'contract_term', label: 'Contract Term', type: 'text', required: true, placeholder: '6 months or project completion' }
      ]
    }
  ];

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const generateContract = async () => {
    if (!selectedTemplate) {
      alert('Please select a contract template first');
      return;
    }

    // Check required fields
    const template = contractTemplates.find(t => t.id === selectedTemplate);
    const missingFields = template.fields
      .filter(field => field.required && !formData[field.name])
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in required fields:\n${missingFields.join('\n')}`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/generate-contract', {
        template_type: selectedTemplate,
        form_data: formData
      });

      setGeneratedContract(response.data.contract);
    } catch (error) {
      console.error('Contract generation error:', error);
      alert('Error generating contract. Please try again.');
    }
    setLoading(false);
  };

  const downloadContract = () => {
    const blob = new Blob([generatedContract], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate}_agreement_${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetForm = () => {
    setSelectedTemplate('');
    setFormData({});
    setGeneratedContract('');
  };

  const selectedTemplateData = contractTemplates.find(t => t.id === selectedTemplate);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Left Side - Template Selection & Form */}
      <div className="space-y-6">
        {/* Template Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">1. Select Contract Type</h3>
          <div className="grid gap-4">
            {contractTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? `border-${template.color}-500 bg-${template.color}-50`
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setFormData({});
                  setGeneratedContract('');
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Form */}
        {selectedTemplateData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                2. Enter Contract Details
              </h3>
              <button
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Change Template
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedTemplateData.fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="3"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              
              <button
                onClick={generateContract}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Contract...
                  </>
                ) : (
                  'Generate Contract'
                )}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Right Side - Generated Contract Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          3. Generated Contract
        </h3>
        
        {generatedContract ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto border">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {generatedContract}
              </pre>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={downloadContract}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                📥 Download Contract
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedContract);
                  alert('Contract copied to clipboard!');
                }}
                className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                📋 Copy Text
              </button>
            </div>
            
            <button
              onClick={resetForm}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Create New Contract
            </button>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-lg mb-2">No contract generated yet</p>
            <p className="text-sm">Select a template and fill the form to generate your contract</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractGenerator;