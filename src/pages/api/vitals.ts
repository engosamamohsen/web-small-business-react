import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const vitals = await request.json();

        // Log to console in development
        if (import.meta.env.DEV) {
            console.log('📊 Web Vitals:', vitals);
        }

        // In production, you can send to your analytics service
        // Example: await sendToAnalyticsService(vitals);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error logging vitals:', error);
        return new Response(JSON.stringify({ error: 'Failed to log vitals' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
