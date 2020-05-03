import React, { useState } from "react";
import SelectInput from "reusable/lib/SelectInput";
import ScenarioSelector from "reusable/lib/ScenarioSelector";

function ZelleScenarioSelector() {
  const [saveProfileResponse, setSaveProfileResponse] = useState(
    localStorage.getItem("save profile response") || "success"
  );
  const [profileId, setProfileId] = useState(
    localStorage.getItem("profileId") || 2
  );
  const [oobStatus, setOobStatus] = useState(
    localStorage.getItem("oob status") || "challenge"
  );
  const [oobAnswer, setOobAnswer] = useState(
    localStorage.getItem("oob answer") || "success"
  );
  const [enrollmentStatus, setEnrollmentStatus] = useState(
    localStorage.getItem("enrollment status") || "unenrolled"
  );
  const [enrollResponse, setEnrollResponse] = useState(
    localStorage.getItem("enroll response") || "success"
  );
  //const [delay, setDelay] = useState(localStorage.getItem("delay") || 0);

  function handleProfileChange({ target }) {
    setProfileId(target.value);
    localStorage.setItem("profileId", target.value);
    // Must reload when profile changes (so the call to getProfile fires again.)
    window.location.reload();
  }

  function handleSaveProfileResponseChange({ target }) {
    setSaveProfileResponse(target.value);
    localStorage.setItem("save profile response", target.value);
  }

  function handleEnrollmentStatusChange({ target }) {
    setEnrollmentStatus(target.value);
    localStorage.setItem("enrollment status", target.value);
    // Must reload when enrollment changes (so GET enrollment runs again)
    window.location.reload();
  }

  function handleEnrollResponseChange({ target }) {
    setEnrollResponse(target.value);
    localStorage.setItem("enroll response", target.value);
  }

  function handleOobStatusChange({ target }) {
    setOobStatus(target.value);
    localStorage.setItem("oob status", target.value);
    window.location.reload();
  }

  function handleOobAnswerChange({ target }) {
    setOobAnswer(target.value);
    localStorage.setItem("oob answer", target.value);
  }

  // function handleDelayChange({ target }) {
  //   setDelay(target.value);
  //   localStorage.setItem("delay", target.value);
  // }

  return (
    <ScenarioSelector>
      <SelectInput
        label="Profile"
        id="profile"
        required
        name="profile"
        value={profileId}
        setValue={setProfileId}
        onChange={handleProfileChange}
        options={[
          { value: 1, label: "User 1 - Full profile" },
          { value: 2, label: "User 2 - Only work # and email" },
        ]}
      />

      <SelectInput
        label="Save Profile Response"
        id="saveProfileResponse"
        required
        name="saveProfileResponse"
        value={saveProfileResponse}
        setValue={setSaveProfileResponse}
        onChange={handleSaveProfileResponseChange}
        options={[
          { value: "success", label: "Success" },
          { value: "oob", label: "OOB" },
          { value: "error", label: "Error" },
        ]}
      />

      <SelectInput
        label="Enrollment Status"
        name="enrollmentStatus"
        id="enrollmentStatus"
        setValue={setEnrollmentStatus}
        required
        value={enrollmentStatus}
        onChange={handleEnrollmentStatusChange}
        options={[
          { value: "enrolled", label: "Enrolled" },
          { value: "unenrolled", label: "Unenrolled" },
          { value: "General.AccessDenied", label: "General.AccessDenied" },
          {
            value: "General.AccessDenied.BankAuth",
            label: "General.AccessDenied.BankAuth",
          },
          {
            value: "General.AccessDenied.BankSA",
            label: "General.AccessDenied.BankSA (OOB)",
          },
          {
            value: "Ineligible.Customer.Profile.Incomplete",
            label: "Ineligible.Customer.Profile.Incomplete",
          },
          {
            value: "Ineligible.No.Eligible.Accounts",
            label: "Ineligible.No.Eligible.Accounts",
          },
          {
            value: "Ineligible.No.Positive.Balance",
            label: "Ineligible.No.Positive.Balance",
          },
          {
            value: "Terms.Acceptance.Required",
            label: "Terms.Acceptance.Required",
          },
          {
            value: "General.TechnicalDifficulties",
            label: "General.TechnicalDifficulties",
          },
        ]}
      />

      {enrollmentStatus === "unenrolled" && (
        <SelectInput
          label="Enroll Response"
          name="postEnrollment"
          id="postEnrollment"
          required
          value={enrollResponse}
          setValue={setEnrollResponse}
          onChange={handleEnrollResponseChange}
          options={[
            { value: "success", label: "Success" },
            { value: "General.AccessDenied", label: "General.AccessDenied" },
            {
              value: "General.AccessDenied.BankAuth",
              label: "General.AccessDenied.BankAuth",
            },
            {
              value: "General.TechnicalDifficulties",
              label: "General.TechnicalDifficulties",
            },
          ]}
        />
      )}

      <ul>
        <li>
          <SelectInput
            id="oobStatus"
            label="OOB Status"
            name="oobStatus"
            required
            value={oobStatus}
            setValue={setOobStatus}
            onChange={handleOobStatusChange}
            options={[
              { value: "challenge", label: "Challenge" },
              {
                value: "Auth.OOB.ChallengeAnswer.Locked",
                label: "Auth.OOB.ChallengeAnswer.Locked",
              },
              {
                value: "OOB.Unauthenticated",
                label: "Unauthenticated",
              },
            ]}
          />
        </li>

        <li>
          <SelectInput
            id="oobAnswer"
            label="OOB Answer"
            name="oobAnswer"
            required
            value={oobAnswer}
            setValue={setOobAnswer}
            onChange={handleOobAnswerChange}
            options={[
              { value: "success", label: "Success" },
              {
                value: "OOB.ChallengeAnswer.Locked",
                label: "Locked",
              },
              {
                value: "OOB.ChallengeAnswer.CodeExpired",
                label: "CodeExpired",
              },
              {
                value: "OOB.ChallengeAnswer.InvalidCode",
                label: "InvalidCode",
              },
              {
                value: "OOB.ChallengeAnswer.LastAttempt",
                label: "LastAttempt",
              },
              {
                value: "OOB.Unauthenticated",
                label: "Unauthenticated",
              },
            ]}
          />
        </li>
      </ul>

      {/* <SelectInput
          id="delay"
          value={delay}
          name="delay"
          required
          label="API Call Delay"
          onChange={handleDelayChange}
          options={[
            { value: "", label: "No delay" },
            { value: 1000, label: "1 second" },
            { value: 2000, label: "2 second" }
          ]}
        /> */}
    </ScenarioSelector>
  );
}

export default ZelleScenarioSelector;
