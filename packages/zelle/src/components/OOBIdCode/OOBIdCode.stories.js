import React from "react";
import { storiesOf } from "@storybook/react";
import OOBIdCode from "./OOBIdCode";

storiesOf("OOBIdCode", module)
  .add("default", () => (
    <OOBIdCode
      channel="555-282-0283"
      onSubmit={() => alert("submitted")}
      onGetNewCode={() => alert("New code requested")}
      onCancel={() => alert("cancelled")}
    />
  ))
  .add("ChallengeRequest.Locked shows lock page", () => (
    <OOBIdCode
      channel="555-282-0283"
      onSubmit={() => alert("submitted")}
      onGetNewCode={() => alert("New code requested")}
      onCancel={() => alert("cancelled")}
      oobError={{
        httpStatus: 403,
        code: "OOB.ChallengeRequest.Locked",
        message: "User Answer Locked",
      }}
    />
  ))
  .add("ChallengeAnswer.Locked shows lock page", () => (
    <OOBIdCode
      channel="555-282-0283"
      onSubmit={() => alert("submitted")}
      onGetNewCode={() => alert("New code requested")}
      onCancel={() => alert("cancelled")}
      oobError={{
        httpStatus: 403,
        code: "OOB.ChallengeAnswer.Locked",
        message: "User Answer Locked",
      }}
    />
  ))
  .add("ChallengeAnswer.CodeExpired", () => (
    <OOBIdCode
      channel="555-282-0283"
      onSubmit={() => alert("submitted")}
      onGetNewCode={() => alert("New code requested")}
      onCancel={() => alert("cancelled")}
      oobError={{
        httpStatus: 422,
        code: "OOB.ChallengeAnswer.CodeExpired",
        message: "Code Expired",
      }}
    />
  ))
  .add("ChallengeAnswer.InvalidCode", () => (
    <OOBIdCode
      channel="555-282-0283"
      onSubmit={() => alert("submitted")}
      onGetNewCode={() => alert("New code requested")}
      onCancel={() => alert("cancelled")}
      oobError={{
        httpStatus: 422,
        code: "OOB.ChallengeAnswer.InvalidCode",
        message: "Invalid Code",
      }}
    />
  ))
  .add("ChallengeAnswer.LastAttempt", () => (
    <OOBIdCode
      channel="555-282-0283"
      onSubmit={() => alert("submitted")}
      onGetNewCode={() => alert("New code requested")}
      onCancel={() => alert("cancelled")}
      oobError={{
        httpStatus: 422,
        code: "OOB.ChallengeAnswer.LastAttempt",
        message: "Invalid Code Last Attempt",
      }}
    />
  ));
