'use client';

import { Network, NetworkModalProps } from './NetworkModal.types';
import React, { useEffect, useState } from 'react';

import Button from '../CamBtn';
import Input from '../Input';
import Modal from '../Modal';
import Typography from '../Typography';

const NetworkModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  editingNetworkmode
}: NetworkModalProps) => {
  const [formData, setFormData] = useState<Network>({
    name: '',
    url: '',
    magellanAddress: '',
    signavaultAddress: '',
    status: 'custom'
  });

  useEffect(() => {
    if (isOpen && initialValues) {
      setFormData(initialValues);
    } else if (!isOpen) {
      // Clear form data when modal closes
      setFormData({
        name: '',
        url: '',
        magellanAddress: '',
        signavaultAddress: '',
        status: 'custom'
      });
    }
  }, [isOpen, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    // Clear form and close modal
    setFormData({
      name: '',
      url: '',
      magellanAddress: '',
      signavaultAddress: ''
    });
    onClose();
  };

  const handleChange = (field: keyof Network) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="w-full max-w-xl p-6 bg-slate-950 rounded-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Typography variant="h4" as="h2">
          {!editingNetworkmode ? 'Add New Network' : 'Edit Network'}
        </Typography>

        <div className="space-y-4">
          <Input
            label="Network Name"
            value={formData.name}
            onChange={handleChange('name')}
            required
          />
          <Input
            label="URL"
            value={formData.url}
            onChange={handleChange('url')}
            required
          />
          <Input
            label="Magellan Address"
            value={formData.magellanAddress}
            onChange={handleChange('magellanAddress')}
            required
          />
          <Input
            label="Signavault Address"
            value={formData.signavaultAddress}
            onChange={handleChange('signavaultAddress')}
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={handleClose}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {!editingNetworkmode  ? 'Add Network' : 'Edit Network'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NetworkModal;
