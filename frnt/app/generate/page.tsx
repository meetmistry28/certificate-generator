"use client"; 

import { useState } from "react";
import axios from "axios";

interface Observation {
  gas: string;
  before: string;
  after: string;
}

interface CertificateRequest {
  certificateNo: String,
  customerName: String,
  siteLocation: String,
  makeModel: String,
  range: String,
  serialNo: String,
  calibrationGas: String,
  gasCanisterDetails: String,
  dateOfCalibration: Date,
  calibrationDueDate: Date,
  observations: Observation[],
  engineerName: String
}

interface CertificateResponse {
  certificateId: string;
  message: string;
  downloadUrl: string;
}

export default function GenerateCertificate() {
  const [formData, setFormData] = useState<CertificateRequest>({
    certificateNo: "",
    customerName: "",
    siteLocation: "",
    makeModel: "",
    range: "",
    serialNo: "",
    calibrationGas: "",
    gasCanisterDetails: "",
    dateOfCalibration: new Date().toISOString().split('T')[0],
    calibrationDueDate: new Date().toISOString().split('T')[0],
    observations: [{ gas: "", before: "", after: "" }],
    engineerName: ""
  });
  const [certificate, setCertificate] = useState<CertificateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedValue = e.target.type === "date"
      ? new Date(e.target.value).toISOString().split("T")[0]
      : value;

    let updatedObservations = formData.observations;

    if (name === "makeModel") {
      switch (value) {
        case "GT":
          updatedObservations = Array(4).fill({ gas: "", before: "", after: "" });
          break;
        case "PS200M1":
          updatedObservations = Array(2).fill({ gas: "", before: "", after: "" });
          break;
        case "PS200M2":
          updatedObservations = Array(3).fill({ gas: "", before: "", after: "" });
          break;
        case "PS200M3":
          updatedObservations = Array(4).fill({ gas: "", before: "", after: "" });
          break;
        case "IR700":
          updatedObservations = Array(2).fill({ gas: "", before: "", after: "" });
          break;
        case "Leak":
          updatedObservations = Array(3).fill({ gas: "", before: "", after: "" });
          break;
        case "GS700":
          updatedObservations = Array(5).fill({ gas: "", before: "", after: "" });
          break;
        default:
          updatedObservations = [{ gas: "", before: "", after: "" }];
      }
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: updatedValue,
      observations: updatedObservations,
    }));
  };

  const handleObservationChange = (index: number, field: keyof Observation, value: string) => {
    const updatedObservations = [...formData.observations];
    updatedObservations[index] = { ...updatedObservations[index], [field]: value };
    setFormData({ ...formData, observations: updatedObservations });
  };

  const addObservation = () => {
    if (formData.observations.length < 5) {
      setFormData({
        ...formData,
        observations: [...formData.observations, { gas: "", before: "", after: "" }]
      });
    }
  };

  const removeObservation = (index: number) => {
    const updatedObservations = [...formData.observations];
    updatedObservations.splice(index, 1);
    setFormData({ ...formData, observations: updatedObservations });
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
          name="certificateNo"
          placeholder="Enter Certificate No"
          value={formData.certificateNo}
          onChange={handleChange}
          className="p-2 border rounded"

        />
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
        <select
          name="makeModel"
          value={formData.makeModel}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Make and Model</option>
          <option value="GT">GT</option>
          <option value="PS200M1">PS200M1</option>
          <option value="PS200M2">PS200M2</option>
          <option value="PS200M3">PS200M3</option>
          <option value="IR700">IR700</option>
          <option value="Leak">Leak Severe</option>
          <option value="GS700">GS700</option>
        </select>

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
        <select
          name="engineerName"
          value={formData.engineerName}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Engineer Name</option>
          <option value="MR. Pintu Rathod">MR. Pintu Rathod</option>
          <option value="MR. Vivek">MR. Vivek</option>
        </select>

        <h2 className="text-lg font-bold mt-4">Observation Table</h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={addObservation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={formData.observations.length >= 5}
          >
            Add Observation
          </button>
        </div>
        <table className="table-auto border-collapse border border-gray-500 w-full">
          <thead>
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Gas</th>
              <th className="border p-2">Before Calibration</th>
              <th className="border p-2">After Calibration</th>
              <th className="border p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {formData.observations.map((observation, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    name="gas"
                    value={observation.gas}
                    onChange={(e) => handleObservationChange(index, 'gas', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    name="before"
                    value={observation.before}
                    onChange={(e) => handleObservationChange(index, 'before', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    name="after"
                    value={observation.after}
                    onChange={(e) => handleObservationChange(index, 'after', e.target.value)}
                    className="w-full p-1 border rounded"
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => removeObservation(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {formData.observations.length === 0 && (
              <tr>
                <td colSpan={5} className="border p-2 text-center text-gray-500">
                  No observations added yet. Click "Add Observation" to add one.
                </td>
              </tr>
            )}
            {formData.observations.length >= 5 && (
              <tr>
                <td colSpan={5} className="border p-2 text-center text-yellow-600">
                  Maximum limit of 5 observations reached.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Certificate"}
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
