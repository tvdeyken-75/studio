# **App Name**: CargoPilot

## Core Features:

- User Management (Admin): User authentication and authorization to allow a single admin user. Note: Since no database is possible in this configuration, user management will consist of just a single, hard-coded admin user. All roles are fulfilled by that user.
- Temporary Address Management: Entry of pickup and delivery locations to facilitate other features. No database is provided in this environment, so locations will not be permanently saved, and there is no need for importing bulk addresses from other systems. Locations can be typed in free text, and used until page refresh.
- Address Insights: Generative AI tool to analyze entered addresses and identify any common logistical challenges associated with each location.
- Fleet Viewer: Display available vehicles, their location, capacity and status for a single day.
- Session-Based Customer and Contractor Profiles: Ability to define new customers and contractors with their main information. Note: since no database is possible, the data entered here will be kept for the duration of the browser session, but it cannot be stored longer than that.
- AI-Powered Route Planning: Transport planning assistant, using generative AI to suggest efficient routes and vehicle assignments based on available data. Note: since vehicle and customer information does not persist, this tool uses generative AI to reason from context whether or not it can account for factors such as pre-existing relationships, contractor performance or preferences, vehicle availability and capabilities, and location-specific logistical insights.
- Key Performance Indicators: Display of high-level metrics, as the app does not include any financial data. For example: Number of deliveries performed in time and number of issues occurred for current day.

## Style Guidelines:

- Primary color: HSL values of 220, 70%, and 50% translate to a vibrant, saturated blue, evoking trust and efficiency. Hex code: #3D85E0
- Background color: HSL values of 210, 20%, and 95% create a light, desaturated blueish-white background. Hex code: #F0F4F7
- Accent color: HSL values of 190, 60%, and 40% create a teal-ish tone that will contrast well with the primary. Hex code: #329999
- Body and headline font: 'Inter' (sans-serif) provides a modern, clean, and highly readable style.
- Use clear and simple icons to represent different functions and data points.
- Maintain a clean and structured layout with clear information hierarchy to improve usability.
- Incorporate subtle transitions and animations to enhance user engagement.