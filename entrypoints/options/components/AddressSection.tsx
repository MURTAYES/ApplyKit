import React from 'react';
import { Address } from '../../../src/types/profile';

interface AddressSectionProps {
  id: string;
  secCode: string;
  title: string;
  titleBn: string;
  telemetryTag: string;
  data: Address;
  onChange: (field: keyof Address, value: string) => void;
}

export function AddressSection({
  id,
  secCode,
  title,
  titleBn,
  telemetryTag,
  data,
  onChange,
}: AddressSectionProps) {
  return (
    <section id={id} className="form-card" data-testid={`section-${id}`}>
      <div className="card-header">
        <div className="card-header-left">
          <span className="sec-badge">{secCode}</span>
          <h3 className="card-title">
            {title} <span className="card-title-bn">// {titleBn}</span>
          </h3>
        </div>
        <span className="card-telemetry-tag">{telemetryTag}</span>
      </div>

      <div className="card-body">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor={`${id}-careOf`}>
              Care of / Guardian Name <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-careOf`}
              type="text"
              className="swiss-input"
              placeholder="NAME OF GUARDIAN / AGENT"
              value={data.careOf}
              onChange={(e) => onChange('careOf', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-village`}>
              Village / Road / House / Flat No. <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-village`}
              type="text"
              className="swiss-input"
              placeholder="PREMISES &amp; STREET DESCRIPTOR"
              value={data.village}
              onChange={(e) => onChange('village', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-district`}>
              District <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-district`}
              type="text"
              className="swiss-input"
              placeholder="e.g. Dhaka"
              value={data.district}
              onChange={(e) => onChange('district', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-upazila`}>
              Upazila / Thana / P.S. <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-upazila`}
              type="text"
              className="swiss-input"
              placeholder="e.g. Uttara"
              value={data.upazila}
              onChange={(e) => onChange('upazila', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-postOffice`}>
              Post Office <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-postOffice`}
              type="text"
              className="swiss-input"
              placeholder="BRANCH POST OFFICE"
              value={data.postOffice}
              onChange={(e) => onChange('postOffice', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor={`${id}-postCode`}>
              Postal Code <span className="req-star">*</span>
            </label>
            <input
              id={`${id}-postCode`}
              type="text"
              className="swiss-input mono"
              placeholder="POSTAL NUMERIC (e.g. 1230)"
              value={data.postCode}
              onChange={(e) => onChange('postCode', e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
