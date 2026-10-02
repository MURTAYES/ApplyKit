import React from 'react';
import { Address } from '../../../src/types/profile';

interface AddressSectionProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  data: Address;
  onChange: (field: keyof Address, value: string) => void;
}

export function AddressSection({
  id,
  title,
  description,
  icon,
  data,
  onChange,
}: AddressSectionProps) {
  return (
    <section id={id} className="form-card" data-testid={`section-${id}`}>
      <div className="card-header">
        <div className="card-header-icon">{icon}</div>
        <div>
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`${id}-careOf`}>Care of / Guardian Name</label>
          <input
            id={`${id}-careOf`}
            type="text"
            className="form-input"
            placeholder="e.g. ABDUL KARIM"
            value={data.careOf}
            onChange={(e) => onChange('careOf', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${id}-village`}>Village / Road / House</label>
          <input
            id={`${id}-village`}
            type="text"
            className="form-input"
            placeholder="e.g. House 12, Road 4, Sector 7"
            value={data.village}
            onChange={(e) => onChange('village', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${id}-district`}>District</label>
          <input
            id={`${id}-district`}
            type="text"
            className="form-input"
            placeholder="e.g. Dhaka"
            value={data.district}
            onChange={(e) => onChange('district', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${id}-upazila`}>Upazila / Thana / P.S.</label>
          <input
            id={`${id}-upazila`}
            type="text"
            className="form-input"
            placeholder="e.g. Uttara"
            value={data.upazila}
            onChange={(e) => onChange('upazila', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${id}-postOffice`}>Post Office</label>
          <input
            id={`${id}-postOffice`}
            type="text"
            className="form-input"
            placeholder="e.g. Uttara Model Town"
            value={data.postOffice}
            onChange={(e) => onChange('postOffice', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${id}-postCode`}>Postal Code</label>
          <input
            id={`${id}-postCode`}
            type="text"
            className="form-input"
            placeholder="e.g. 1230"
            value={data.postCode}
            onChange={(e) => onChange('postCode', e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
