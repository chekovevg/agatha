export type CalBookingStatus = "loading" | "slow" | "ready" | "failed";

export type CalBookingAction =
  | {type: "reset"}
  | {type: "slow"}
  | {type: "linkReady"}
  | {type: "bookerReady"}
  | {type: "linkFailed"};

export function calBookingStatusReducer(
  status: CalBookingStatus,
  action: CalBookingAction,
): CalBookingStatus {
  if (action.type === "reset") {
    return "loading";
  }

  if (status === "ready" || status === "failed") {
    return status;
  }

  if (action.type === "slow") {
    return "slow";
  }

  if (action.type === "bookerReady") {
    return "ready";
  }

  if (action.type === "linkFailed") {
    return "failed";
  }

  return status;
}
