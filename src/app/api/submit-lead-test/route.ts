// Dev alias endpoint for LeadForm when NODE_ENV === "development".
// Re-export the POST handler from the production submit-lead route
// so both /api/submit-lead and /api/submit-lead-test behave identically.

export { POST } from "../submit-lead/route";
