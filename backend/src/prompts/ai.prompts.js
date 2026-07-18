export const prompts = {

    translate: ({ text, from, to }) => `
Translate the following text from ${from} to ${to}.

Return ONLY the translated text in ${to}, followed by an English translation (or romanization + English meaning if ${to} uses a non-Latin script) in parentheses.

Format exactly like this:
<translated text in ${to}>(<romanization if applicable> / <English meaning>)

Do not add any labels, explanations, or extra text — just the formatted line.

${text}
`,

    improve: ({ text }) => `
Improve grammar and spelling.

Return ONLY the corrected text.

${text}
`,

    friendly: ({ text }) => `
Rewrite this text in a friendly tone.

Return ONLY rewritten text.

${text}
`,

    formal: ({ text }) => `
Rewrite this text professionally.

Return ONLY rewritten text.

${text}
`

};