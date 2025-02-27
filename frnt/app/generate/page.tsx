"use client"; // Required for useState & useEffect in App Router

import { useState } from "react";
import axios from "axios";

interface CertificateRequest {
  customerName: String,
  siteLocation: String,
  makeModel: String,
  range: String,
  serialNo: String,
  calibrationGas: String,
  gasCanisterDetails: String,
  dateOfCalibration: Date,
  calibrationDueDate: Date
}

interface CertificateResponse {
  certificateId: string;
  message: string;
  downloadUrl: string;
}

export default function GenerateCertificate() {
  const [formData, setFormData] = useState<CertificateRequest>({ customerName: "", siteLocation: "", makeModel: "", range: "", serialNo: "", calibrationGas: "", gasCanisterDetails: "", dateOfCalibration: new Date(), calibrationDueDate: new Date() });
  const [certificate, setCertificate] = useState<CertificateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'date'
      ? new Date(e.target.value).toISOString().split('T')[0]
      : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/certificates/generateCertificate",
        formData
      );
      setCertificate(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to generate certificate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!certificate?.downloadUrl) return;

    try {
      const response = await axios.get(
        `http://localhost:5000${certificate.downloadUrl}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificate.certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download certificate. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Generate Your Certificate</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="customerName"
          placeholder="Enter Name"
          value={formData.customerName}
          onChange={handleChange}
          className="p-2 border rounded"

        />
        <input
          type="text"
          name="siteLocation"
          placeholder="Enter Site Location"
          value={formData.siteLocation}
          onChange={handleChange}
          className="p-2 border rounded"

        />
        <input
          type="text"
          name="makeModel"
          placeholder="Enter Make and Model"
          value={formData.makeModel}
          onChange={handleChange}
          className="p-2 border rounded"

        />
        <input
          type="text"
          name="range"
          placeholder="Enter Range"
          value={formData.range}
          onChange={handleChange}
          className="p-2 border rounded"

        />
        <input
          type="text"
          name="serialNo"
          placeholder="Enter Serial Number"
          value={formData.serialNo}
          onChange={handleChange}
          className="p-2 border rounded"

        />
        <input
          type="text"
          name="calibrationGas"
          placeholder="Enter Calibration Gas"
          value={formData.calibrationGas}
          onChange={handleChange}
          className="p-2 border rounded"

        />
        <input
          type="text"
          name="gasCanisterDetails"
          placeholder="Enter Gas Canister Details"
          value={formData.gasCanisterDetails}
          onChange={handleChange}
          className="p-2 border rounded"

        />
        <input
          type="date"
          name="dateOfCalibration"
          placeholder="Enter Date of Calibration"
          value={formData.dateOfCalibration.toString().split('T')[0]}
          onChange={handleChange}
          className="p-2 border rounded"

        />
        <input
          type="date"
          name="calibrationDueDate"
          placeholder="Enter Calibration Due Date"
          value={formData.calibrationDueDate.toString().split('T')[0]}
          onChange={handleChange}
          className="p-2 border rounded"

        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {certificate && (
        <div className="mt-4 text-center">
          <p className="text-green-600 mb-2">{certificate.message}</p>
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Download Certificate
          </button>
        </div>
      )}
    </div>
  );
}
