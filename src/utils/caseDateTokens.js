export const CASE_PROBLEM_DATE_TOKEN = "{case_problem_date}";

export const CASE_DATE_SYSTEM_TOKENS = Object.freeze([
    {
        id: "system:case:problem-date",
        token: CASE_PROBLEM_DATE_TOKEN,
        key: "case.problemDate",
        label: "Case problem date",
        input_type: "date",
        display_mode: "on_demand",
        system: true
    }
]);
