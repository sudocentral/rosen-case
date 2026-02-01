"use client";

/**
 * PatientConfirmationGate Component
 *
 * Shows before upload to confirm patient identity and collect DOB.
 * "Is this [Requestor Name]'s medical records you're uploading?"
 * Yes -> collect DOB, proceed
 * No -> show input for patient name + DOB
 */

import { useState } from "react";

const API_URL = "https://api.sudomanaged.com/api/rosen/public/client/cases";

interface PatientConfirmationGateProps {
  caseId: string;
  requestorName: string;
  onConfirmed: (patientName: string) => void;
}

type Step = "confirm" | "dob" | "different_person";

export default function PatientConfirmationGate({
  caseId,
  requestorName,
  onConfirmed
}: PatientConfirmationGateProps) {
  const [step, setStep] = useState<Step>("confirm");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // For the "Yes" flow, we collect DOB for the requestor
  const [isRequestor, setIsRequestor] = useState(true);

  // Format DOB input as user types (MM/DD/YYYY)
  function handleDobChange(value: string) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Format as MM/DD/YYYY
    let formatted = "";
    if (digits.length > 0) {
      formatted = digits.substring(0, 2);
    }
    if (digits.length > 2) {
      formatted += "/" + digits.substring(2, 4);
    }
    if (digits.length > 4) {
      formatted += "/" + digits.substring(4, 8);
    }
    
    setDateOfBirth(formatted);
  }

  // Convert MM/DD/YYYY to YYYY-MM-DD for API
  function convertToIsoDate(mmddyyyy: string): string | null {
    const match = mmddyyyy.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;
    const [, mm, dd, yyyy] = match;
    return `${yyyy}-${mm}-${dd}`;
  }

  // Validate date is real and reasonable
  function isValidDate(mmddyyyy: string): boolean {
    const isoDate = convertToIsoDate(mmddyyyy);
    if (!isoDate) return false;
    
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return false;
    
    // Check it's not in the future
    if (date > new Date()) return false;
    
    // Check it's not before 1900
    if (date.getFullYear() < 1900) return false;
    
    return true;
  }

  async function savePatientIdentity(name: string, dob: string) {
    setSaving(true);
    setError("");

    const token = localStorage.getItem("rosen_client_token");
    if (!token) {
      setError("Session expired. Please reload.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${caseId}/patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-intake-token": token
        },
        body: JSON.stringify({
          patient_name: name,
          patient_name_confirmed: true,
          date_of_birth: dob || undefined
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save");
      }

      onConfirmed(name);

    } catch (err: any) {
      setError(err.message || "Failed to save patient identity");
      setSaving(false);
    }
  }

  function handleYes() {
    setIsRequestor(true);
    setStep("dob");
  }

  function handleNo() {
    setIsRequestor(false);
    setStep("different_person");
  }

  function handleSubmitDob() {
    if (!dateOfBirth) {
      setError("Please enter the date of birth");
      return;
    }
    
    if (!isValidDate(dateOfBirth)) {
      setError("Please enter a valid date (MM/DD/YYYY)");
      return;
    }

    const isoDate = convertToIsoDate(dateOfBirth);
    if (!isoDate) {
      setError("Please enter a valid date (MM/DD/YYYY)");
      return;
    }

    const name = isRequestor ? requestorName : `${patientFirstName.trim()} ${patientLastName.trim()}`.trim();
    savePatientIdentity(name, isoDate);
  }

  function handleContinueToDoB() {
    const fullName = `${patientFirstName.trim()} ${patientLastName.trim()}`.trim();
    if (fullName.length < 2) {
      setError("Please enter the patient's full name");
      return;
    }
    setError("");
    setStep("dob");
  }

  // Step 3: Collect DOB (for both Yes and No flows)
  if (step === "dob") {
    const patientName = isRequestor ? requestorName : `${patientFirstName.trim()} ${patientLastName.trim()}`.trim();

    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Patient Date of Birth
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Please enter the date of birth for <strong>{patientName}</strong>
        </p>
        <p className="text-sm text-gray-500 mb-6 text-center">
          This helps our physicians accurately review your medical records.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={dateOfBirth}
              onChange={(e) => handleDobChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent"
              placeholder="MM/DD/YYYY"
              disabled={saving}
              maxLength={10}
              autoComplete="bday"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep(isRequestor ? "confirm" : "different_person")}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={saving}
            >
              Back
            </button>
            <button
              onClick={handleSubmitDob}
              className="flex-1 px-4 py-3 bg-[#1a5f7a] text-white rounded-lg hover:bg-[#164e66] disabled:opacity-50"
              disabled={saving || dateOfBirth.length < 10}
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2b: Different person - collect name first
  if (step === "different_person") {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Whose medical records are these?
        </h2>
        <p className="text-gray-600 mb-6">
          Please enter the name of the patient whose records you are uploading.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={patientFirstName}
              onChange={(e) => setPatientFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent"
              placeholder="John"
              disabled={saving}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={patientLastName}
              onChange={(e) => setPatientLastName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5f7a] focus:border-transparent"
              placeholder="Smith"
              disabled={saving}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setStep("confirm");
                setError("");
              }}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={saving}
            >
              Back
            </button>
            <button
              onClick={handleContinueToDoB}
              className="flex-1 px-4 py-3 bg-[#1a5f7a] text-white rounded-lg hover:bg-[#164e66] disabled:opacity-50"
              disabled={saving || !patientFirstName.trim() || !patientLastName.trim()}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Initial confirmation
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Confirm Patient Identity
      </h2>

      <p className="text-gray-600 mb-6">
        Are you uploading medical records for <strong>{requestorName}</strong>?
      </p>

      {error && (
        <p className="text-red-600 text-sm mb-4">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleNo}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          disabled={saving}
        >
          No, different person
        </button>
        <button
          onClick={handleYes}
          className="flex-1 px-6 py-3 bg-[#1a5f7a] text-white rounded-lg hover:bg-[#164e66] font-medium disabled:opacity-50"
          disabled={saving}
        >
          Yes, that's me
        </button>
      </div>
    </div>
  );
}
